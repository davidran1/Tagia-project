const express = require("express");
const userController = require("../Controller/userController");
const ticketController = require("../Controller/ticketController");
const adminController = require("../Controller/adminController");
const authController = require("../Controller/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.login);
router.post("/signout", authController.signout);

router.get(
  //gets info about the *connected* user
  "/getUserData",
  authController.protect,
  authController.restrictTo("User", "Admin", "EventOrganizer"),
  userController.getUserData
);

// updating user password
router.patch(
  "/changeUserPassword",
  authController.protect,
  authController.restrictTo("User", "EventOrganizer"),
  authController.updateUserPassowrd
);

// updating user Data
router.patch(
  "/updateUserAllData",
  authController.protect,
  authController.restrictTo("User", "EventOrganizer"),
  userController.updateUserAllData
);

router.post("/forgotPassword", authController.forgotPassowrd); //email sending
router.get("/isValidToken/:token", authController.isValidToken); //Route Token validation
router.patch("/resetPassword/:token", authController.resetPassword); //Updating new password

//RESTRICTED ROUTE

router.post(
  "/signup-EventOrganizer",
  authController.protect,
  authController.restrictTo("Admin"),
  authController.eventOrganizerSignup
);

router.post(
  "/signup-User",
  authController.protect,
  authController.restrictTo("Admin"),
  authController.signup
);

router.get(
  "/getAllUsers",
  authController.protect,
  authController.restrictTo("Admin"),
  adminController.getAllUsers(10)
);

router.patch(
  "/edit-users/:userId",
  authController.protect,
  authController.restrictTo("Admin"),
  adminController.editUsers
);

router.post(
  "/toggleBlockUser/:userId",
  authController.protect,
  authController.restrictTo("Admin"),
  adminController.toggleBlockUser
);

//Stats

router.get(
  "/SearchSpecificUsers",
  authController.protect,
  authController.restrictTo("Admin"),
  userController.searchSpecificUser
);

router.get(
  "/getSignUpsPerDay/:d1/:d2",
  authController.protect,
  authController.restrictTo("Admin"),
  userController.getSignUpsPerDay
);

module.exports = router;
