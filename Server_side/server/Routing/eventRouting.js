const express = require("express");
const eventController = require("../Controller/eventController");
const authController = require("../Controller/authController");
const ticketController = require("../Controller/ticketController");
const adminController = require("../Controller/adminController");

const router = express.Router();

router.get("/", eventController.getAllEvents);

router.get("/event/:eventId", eventController.getEventById);

// reserving Tickets
router
  .route("/event/:eventId/reserve")
  .post(authController.protect, ticketController.reserveTickets)
  .patch(eventController.updateRemainingTickets);

router.get(
  "/events-organizer",
  authController.protect,
  authController.restrictTo("EventOrganizer", "Admin"),
  eventController.getOrganizerEvents
);

router.get(
  "/myTopPopularEvents/:Organizer",
  authController.protect,
  authController.restrictTo("EventOrganizer", "Admin"),
  eventController.myTopPuplarEvents
);

// Save Event
router.post(
  "/creat_events",
  authController.protect,
  authController.restrictTo("EventOrganizer"),
  eventController.createEvent
);

//Update event
router.put(
  "/event/:eventId",
  authController.protect,
  authController.restrictTo("EventOrganizer"),
  eventController.updateEvent
);

//Delete event
router.delete(
  "/event/:eventId",
  authController.protect,
  authController.restrictTo("EventOrganizer"),
  eventController.deleteEvent
);

router.get("/getCategories", eventController.getCategories);

router.get(
  "/allTopPopularEvents",
  authController.protect,
  authController.restrictTo("Admin"),
  adminController.allTopPopularEvents
);

router.get("/getRellevantCategories", eventController.getRellevantCategories);

module.exports = router;
