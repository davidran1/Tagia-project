const userModel = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIfeatures = require("../utils/apiFeatures");
const mongoose = require("mongoose");
const APIFeatures = require("../utils/apiFeatures");
const Event = require("../Models/eventModel");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = (limit) => {
  return catchAsync(async (req, res, next) => {
    let features;

    features = new APIfeatures(userModel.find().select("-password"), req.query)
      .filter(false)
      .sort()
      .paginate(limit);
    console.log(features.queryString);

    const users = await features.query.exec();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  });
};

exports.allTopPopularEvents = catchAsync(async (req, res, next) => {
  let features;
  features = APIFeatures.aggregate({ sort: "popular" })
    .filter(false)
    .popular(1)
    .paginate();

  const events = await features.query.exec();
  res.status(200).json({
    status: "success",
    results: events.length,
    data: {
      events,
    },
  });
});

exports.editUsers = catchAsync(async (req, res, next) => {
  const filteredObj = filterObj(req.body, "name", "email", "major", "year");

  const user = await userModel.findById(req.params.userId);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  if (user.role == "Admin")
    return next(new AppError("You can't edit this user", 403));

  const updatedUser = await userModel.findByIdAndUpdate(
    req.params.userId,
    filteredObj,
    {
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
});

exports.toggleBlockUser = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.params.userId);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  } else if (user.role == "Admin")
    return next(new AppError("You can't block this user", 403));
  if (user.blocked) user.blocked = false;
  else user.blocked = true;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
