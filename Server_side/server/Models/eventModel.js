const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: [true, "a specific date is required"],
    },
    location: {
      type: Array,
      required: [true, "location is required"],
      validate: {
        validator: function (arr) {
          return arr.length === 2;
        },
        message: "Coordinates must have exactly 2 elements",
      },
    },
    duration: {
      type: Number,
      required: [true, "a duration is required"],
    },
    CreatedAt: {
      type: Date,
      default: Date.now(),
    },
    Cost: {
      type: Number,
      required: [true, "a cost is required"],
    },
    emptyTickets: {
      type: Number,
      required: [true, "a number of empty tickets is required"],
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "a description is required"],
    },
    city: {
      type: String,
      required: [true, "a city is required"],
    },
    category: {
      type: String,
      required: [true, "a category is required"],
    },
    Organizer: {
      type: String,
      required: [true, "an organizer is required"],
    },
  },
  { collection: "Events" }
);

const eventModel = new mongoose.model("Event", eventSchema);

module.exports = eventModel;
