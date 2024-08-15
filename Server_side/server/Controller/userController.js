const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../Models/userModel");
const { request } = require("express");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getUserData = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUserAllData = catchAsync(async (req, res, next) => {
  const filteredObj = filterObj(req.body, "name", "email", "major", "year");
  const user = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.searchSpecificUser = catchAsync(async (req, res, next) => {
  const user = await User.find(req.query).select("-password");
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getSignUpsPerDay = catchAsync(async (req, res, next) => {
  let Dict = {};
  let date1 = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000);
  let date2 = new Date();
  let d1 = req.params.d1;
  let d2 = req.params.d2;

  if (d1 == null || d2 == null || !isValidDate(d1) || !isValidDate(d2)) {
    d1 = date1;
    d2 = date2;
  }
  d1 = new Date(d1);
  d2 = new Date(d2);

  const DateArray = await User.find(
    { createdAt: { $gte: d1, $lte: d2 } },
    { _id: 0, createdAt: 1 }
  );

  const start = new Date(d1);
  const end = new Date(d2);
  let loop = new Date(start);
  while (loop <= end) {
    let date = loop.toISOString();
    date = date.split("T")[0];
    if (!Dict[date]) Dict[date] = 0;
    let newDate = loop.setDate(loop.getDate() + 1);
    loop = new Date(newDate);
  }

  DateArray.forEach((element) => {
    let date = element["createdAt"].toISOString();
    date = date.split("T")[0];
    Dict[date]++;
  });
  res.status(200).json({
    status: "success",
    data: {
      Dict,
    },
  });
});

function isValidDate(dateString) {
  // Check if the input is a string and not null or undefined
  if (typeof dateString !== "string" || dateString.trim() === "") {
    return false;
  }
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
