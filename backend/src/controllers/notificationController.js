const Notification = require("../models/Notification");

// Get notifications (latest 50)
exports.getNotifications = async (req, res) => {
  try {
    console.log("Fetching notifications for userId:", req.user.userId);
    const notifications = await Notification.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    console.log("Notifications fetched:", notifications);
    res.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Mark single notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: req.user.userId },
      { read: true },
      { new: true }
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json({ notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.userId, read: false },
      { read: true }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Failed to mark all as read" });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: req.user.userId,
    });
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.userId,
      read: false,
    });
    res.json({ unreadCount: count });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ message: "Failed to get unread count" });
  }
};

// Internal helper: create notification
exports.createNotification = async (userId, data) => {
  try {
    const notification = new Notification({
      userId,
      ...data,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};
