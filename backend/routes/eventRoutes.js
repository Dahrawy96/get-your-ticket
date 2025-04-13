const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");


router.get(
  "/analytics",
  authenticationMiddleware,
  authorizationMiddleware(["organizer"]),
  eventController.getEventAnalytics
);

module.exports = router;
