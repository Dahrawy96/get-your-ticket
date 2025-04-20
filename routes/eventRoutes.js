const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAnalytics,
  updateStatus,
} = require("../controllers/eventController");

const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

// hena el public route ay had momken yeshouf el events
router.get("/", getEvents);


// dol el routes betou3 el organizers
router.post("/", authenticationMiddleware, authorizationMiddleware(["organizer"]), createEvent);
router.put("/:id", authenticationMiddleware, authorizationMiddleware(["organizer"]), updateEvent);
router.delete("/:id", authenticationMiddleware, authorizationMiddleware(["organizer"]), deleteEvent);
router.get("/analytics/me", authenticationMiddleware, authorizationMiddleware(["organizer"]), getEventAnalytics);

// dol el routes betaaet el admins
router.patch("/:id/status", authenticationMiddleware, authorizationMiddleware(["admin"]), updateStatus);

module.exports = router;