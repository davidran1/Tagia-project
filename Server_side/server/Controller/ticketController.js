const mongoose = require("mongoose");
const APIFeatures = require("../utils/apiFeatures");
const reservedTicket = require("../Models/TicketsModel");
const Event = require("../Models/eventModel");
const userModel = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const eventModel = require("../Models/eventModel");

//Reserving tickets
exports.reserveTickets = catchAsync(async (req, res, next) => {
  const currentDate = new Date();
  const { ticketsAmount, userID, totalPrice } = req.body;
  const eventID = req.params.eventId;

  //Checking if all data is provided correctly
  if (!ticketsAmount || !userID || !totalPrice)
    return next(new AppError("Please Provide All Data", 404));
  if (
    !mongoose.Types.ObjectId.isValid(userID) ||
    !mongoose.Types.ObjectId.isValid(eventID)
  )
    return next(new AppError("Invalid User or Event ID", 404));

  //event and user exist:
  const event = await Event.findById(eventID);
  const user = await userModel.findById(userID);
  if (!event || !user)
    return next(new AppError("Event or User not found", 404));

  //Checking Ticket amount
  if (event.emptyTickets < ticketsAmount)
    return next(new AppError("Too many tickets requested", 404));
  else if (ticketsAmount <= 0) return next(new AppError("Invalid amount", 404));

  // checking total price:
  if (totalPrice != event.Cost * ticketsAmount)
    return next(new AppError("Invalid Total Price", 404));

  //saving tickets
  const newTicket = await reservedTicket.create({
    eventID: req.params.eventId,
    ticketsAmount: req.body.ticketsAmount,
    userID: req.body.userID,
    date: currentDate,
    totalPrice: req.body.totalPrice,
  });

  res.status(200).json({
    status: "success",
    data: {
      newTicket,
    },
  });
});

exports.getEventsUserRelated = catchAsync(async (req, res, next) => {
  const currentDate = new Date();
  const AllEventsID = await reservedTicket
    .find({ userID: req.user.id })
    .select("eventID");

  if (!AllEventsID) return next(new AppError("No Events found", 404));

  const eventIds = [];
  Object.keys(AllEventsID).forEach((key) => {
    eventIds.push(AllEventsID[key].eventID);
  });

  // getting all events
  const AllEvents = await Event.find({
    _id: { $in: eventIds },
  });

  const FutureEvents = AllEvents.filter((event) => {
    return event.date > currentDate;
  });
  const PastEvents = AllEvents.filter((event) => {
    return event.date <= currentDate;
  });

  res.status(200).json({
    status: "success",
    results: AllEvents.length,
    data: {
      FutureEvents,
      PastEvents,
    },
  });
});

function isValidDate(dateString) {
  // Check if the input is a string and not null or undefined
  if (typeof dateString !== "string" || dateString.trim() === "") {
    console.log("Invalid date format");
    return false;
  }
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

exports.getAllTicketsPerDay = catchAsync(async (req, res, next) => {
  let d1 = req.params.d1;
  let d2 = req.params.d2;
  const date1 = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000);
  const date2 = new Date();

  if (!d1 || !d2 || !isValidDate(d1) || !isValidDate(d2)) {
    d1 = date1;
    d2 = date2;
  }

  d1 = new Date(d1);
  d2 = new Date(d2);

  // Generate the date range dictionary
  const Dict = {};
  let loop = new Date(d1);
  while (loop <= d2) {
    const date = loop.toISOString().split("T")[0];
    Dict[date] = 0;
    loop.setDate(loop.getDate() + 1);
  }

  // Aggregate query to sum tickets per day for all events
  const ticketsPerDay = await reservedTicket.aggregate([
    {
      $match: {
        date: {
          $gt: d1,
          $lt: d2,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        totalTickets: { $sum: "$ticketsAmount" },
      },
    },
    {
      $sort: { _id: 1 }, // Sort by date
    },
  ]);

  // Update the dictionary with the actual ticket counts
  ticketsPerDay.forEach((entry) => {
    Dict[entry._id] = entry.totalTickets;
  });

  res.status(200).json({
    status: "success",
    data: {
      Dict,
    },
  });
});

exports.getPeopleYear = catchAsync(async (req, res, next) => {
  const Dict = {};
  const eventID = req.params.EventID;
  const PeopleOrderd = await reservedTicket.distinct("userID", { eventID });
  const YearArray = await userModel.find(
    { _id: { $in: PeopleOrderd } },
    { _id: 0, year: 1 }
  );

  YearArray.forEach((element) => {
    if (element["year"] === undefined) return; //we dont count Organizers
    if (!Dict[element["year"]]) Dict[element["year"]] = 1;
    else Dict[element["year"]]++;
  });

  res.status(200).json({
    status: "success",
    data: {
      Dict,
    },
  });
});

exports.getPeopleMajor = catchAsync(async (req, res, next) => {
  const Dict = {};
  const eventID = req.params.EventID;
  const PeopleOrderd = await reservedTicket.distinct("userID", { eventID });
  const MajorArray = await userModel.find(
    { _id: { $in: PeopleOrderd } },
    { _id: 0, major: 1 }
  );
  MajorArray.forEach((element) => {
    if (element["major"] === undefined) return; //we dont count Organizers
    if (!Dict[element["major"]]) Dict[element["major"]] = 1;
    else Dict[element["major"]]++;
  });

  res.status(200).json({
    status: "success",
    data: {
      Dict,
    },
  });
});
