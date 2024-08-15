const mongoose = require("mongoose");
const fs = require("fs");
const APIFeatures = require("../utils/apiFeatures");
const Event = require("../Models/eventModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllEvents = catchAsync(async (req, res, next) => {
  let features;

  if (req.query.loc) {
    // Start with an aggregation pipeline if location-based sorting is requested
    let order = req.query.order == "down" ? -1 : 1;
    features = APIFeatures.aggregate(req.query)
      .closest(res, req, next, order)
      .filter()
      .sort()
      .paginate();
  } else if (req.query.sort && req.query.sort.includes("popular")) {
    // Use the normal find operation for other queries
    let order = req.query.order == "down" ? -1 : 1;
    features = APIFeatures.aggregate(req.query)
      .filter()
      .popular(order)
      .paginate();
  } else {
    features = new APIFeatures(Event.find(), req.query)
      .filter()
      .sort()
      .paginate();
  }
  const total = await features.countEvents();
  const events = await features.query.exec();
  res.status(200).json({
    status: "success",
    results: events.length,
    data: {
      total,
      events,
    },
  });
});

exports.getEventById = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;
  const event = await Event.findById(eventId);

  if (!event) {
    // If event with provided ID is not found, return 404 Not Found status
    return next(new AppError("Event not found", 404));
  }
  res.status(200).json(event);
});

//Update remaining tickets to event.
exports.updateRemainingTickets = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;
  const { ticketsAmount } = req.body;
  const event = await Event.findById(eventId);
  if (!event) return next(new AppError("Event not found", 404));

  event.emptyTickets = event.emptyTickets - ticketsAmount;
  await event.save();
  res.status(200).json({
    status: "success",
    data: {
      event,
    },
  });
});

//Event org chooses to see his own events
exports.getOrganizerEvents = catchAsync(async (req, res, next) => {
  const events = await Event.find({ Organizer: req.user.id });

  res.status(200).json({
    status: "success",
    results: events.length,
    data: {
      events,
    },
  });
});

exports.myTopPuplarEvents = catchAsync(async (req, res, next) => {
  let features;
  const Organizer = req.params.Organizer;
  features = APIFeatures.aggregate({ sort: "popular" })
    .filter(false, Organizer)
    .popular(1)
    .paginate(5);

  const events = await features.query.exec();
  res.status(200).json({
    status: "success",
    results: events.length,
    data: {
      events,
    },
  });
});

exports.createEvent = catchAsync(async (req, res, next) => {
  req.body["Organizer"] = req.user._id;
  const newEvent = await Event.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      event: newEvent,
    },
  });
});

//Update Event
exports.updateEvent = catchAsync(async (req, res, next) => {
  req.body["Organizer"] = req.user._id;
  const eventId = req.params.eventId;

  const event = await Event.findById(eventId);
  if (!event) return next(new AppError("לא נמצא אירוע עם המזהה הזה", 404));

  const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedEvent) {
    return next(new AppError("עדכון האירוע נכשל", 500));
  }

  res.status(200).json({
    status: "success",
    data: {
      event: updatedEvent,
    },
  });
});

//Delete event
exports.deleteEvent = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const event = await Event.findByIdAndDelete(eventId);

  if (!event) {
    return next(new AppError("לא נמצא אירוע עם המזהה הזה", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Event.distinct("category");
  res.status(200).json({
    status: "success",
    results: categories.length,
    data: {
      categories,
    },
  });
});

//Return relevant categories - which have at least one future event
exports.getRellevantCategories = catchAsync(async (req, res, next) => {
  const categories = await Event.distinct("category");
  const currentDate = new Date();
  let collections = [];

  for (const category of categories) {
    const event = await Event.find({
      category,
      date: { $gte: currentDate },
    });
    if (event.length > 0) {
      collections.push(category);
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      collections,
    },
  });
});
