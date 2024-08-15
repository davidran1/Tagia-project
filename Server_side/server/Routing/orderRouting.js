const express = require("express");

const {
  createOrderController,
  captureOrderController,
} = require("../Controller/orderController");

const authController = require("../Controller/authController");
const ticketController = require("../Controller/ticketController");

const router = express.Router();

router.post("/", authController.protect, createOrderController);
router.post("/:orderID/capture", captureOrderController);

//IDK IF IT IS SECURE ENOUGH
router.get(
  "/getMajorStat/:EventID",
  authController.protect,
  authController.restrictTo("Admin", "EventOrganizer"),
  ticketController.getPeopleMajor
);

router.get(
  "/getMyEvents",
  authController.protect,
  authController.restrictTo("User", "EventOrganizer"),
  ticketController.getEventsUserRelated
);

router.get(
  "/getPeopleYear/:EventID",
  authController.protect,
  authController.restrictTo("Admin", "EventOrganizer"),
  ticketController.getPeopleYear
);

router.get(
  "/getAllTicketsPerDay/:d1/:d2",
  authController.protect,
  authController.restrictTo("Admin", "EventOrganizer"),
  ticketController.getAllTicketsPerDay
);

module.exports = router;
