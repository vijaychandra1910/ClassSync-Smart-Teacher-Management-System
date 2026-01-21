const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} = require("../controllers/notificationController");
const auth = require("../middlewares/authMiddleware");

// All routes require authentication
router.use(auth);

// Get all notifications for the logged-in user
router.get("/", getNotifications);

// Get unread notification count
router.get("/unread-count", getUnreadCount);

// Mark a single notification as read
router.patch("/:notificationId/read", markAsRead);

// Mark all notifications as read
router.patch("/mark-all-read", markAllAsRead);

// Delete a notification
router.delete("/:notificationId", deleteNotification);

module.exports = router;
