const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signout = (req, res) => {
  res.clearCookie("jwt");
  req.user = null;
  res.status(200).json({ status: "success" });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: false,
    domain: "localhost", // Set this to 'localhost' or '127.0.0.1'
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // remove password from output for protection
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  //check if a user is blocked
  const user = await userModel.findOne({ email: req.body.email });
  if (user) return next(new AppError("This email is  already in use", 400));
  else if (user && user.blocked)
    return next(new AppError("This user is blocked by admin", 400));

  const newUser = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    major: req.body.major,
    year: req.body.year,
  });

  createSendToken(newUser, 201, res);
});

exports.eventOrganizerSignup = catchAsync(async (req, res, next) => {
  const newUser = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    major: "מתמטיקה שימושית",
    year: 1,
    role: "EventOrganizer",
  });
  newUser.year = undefined;
  newUser.major = undefined;
  newUser.save({ validateBeforeSave: false });
  res.status(200).json({ status: "success", data: newUser });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await userModel
    .findOne({ email })
    .select("+password")
    .select("+blocked");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  if (user.blocked) {
    return next(new AppError("This user is blocked", 400));
  }
  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await userModel.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.updateUserPassowrd = catchAsync(async (req, res, next) => {
  // get User from collection

  if (!req.body.currentPassword)
    return next(new AppError("Please provide the current password", 401));

  const CurrentUser = await userModel.findById(req.user.id).select("+password");
  // check if  posted password is correct
  if (
    !(await CurrentUser.correctPassword(
      req.body.currentPassword,
      CurrentUser.password
    ))
  ) {
    return next(new AppError("Your current password is not correct ", 401));
  }
  // update password in collection
  if (!req.body.password || !req.body.confirmPassword)
    return next(
      new AppError("Please provide a new password and confirm it", 401)
    );

  CurrentUser.password = req.body.password;
  CurrentUser.confirmPassword = req.body.confirmPassword;
  await CurrentUser.save();

  // log user in with the correct token
  createSendToken(CurrentUser, 200, res);
});

exports.forgotPassowrd = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  if (!req.body.email) return next(new AppError("Please provide email", 400));
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address", 404));
  }
  // 2) Create reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `http://localhost:5173/edit-password/${resetToken}`;

  Email.sendEmail(user.email, resetURL);

  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

const TokenToUser = async (token) => {
  try {
    const user = await userModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
    return user;
  } catch (err) {
    console.log(err);
  }
};

exports.isValidToken = catchAsync(async (req, res, next) => {
  const user = await TokenToUser(req.params.token);
  if (!user) return next(new AppError("Token is invalid or has expired", 400));

  res.status(200).json({
    status: "success",
    message: "Token is valid",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const user = await TokenToUser(req.params.token);
  if (!user) return next(new AppError("Token is invalid or has expired", 400));

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});
