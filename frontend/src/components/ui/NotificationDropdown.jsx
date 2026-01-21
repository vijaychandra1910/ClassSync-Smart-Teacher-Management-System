import React, { useState, useEffect, useRef } from "react";
import {
  FiBell,
  FiX,
  FiCheck,
  FiClock,
  FiUser,
  FiCalendar,
} from "react-icons/fi";
import api from "../../utils/api";

const DynamicNotificationDropdown = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/notifications");
      setNotifications(res.data.notifications);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/api/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const formatTimestamp = (timestamp) => {
    const diff = new Date() - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return days < 7
      ? `${days} day(s) ago`
      : new Date(timestamp).toLocaleDateString();
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchNotifications();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case "leave_request":
        return <FiCheck className="w-4 h-4 text-green-600" />;
      case "substitution":
        return <FiUser className="w-4 h-4 text-blue-600" />;
      case "schedule":
        return <FiCalendar className="w-4 h-4 text-purple-600" />;
      case "reminder":
        return <FiClock className="w-4 h-4 text-orange-600" />;
      default:
        return <FiBell className="w-4 h-4 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-lg shadow-xl border border-gray-200 z-50"
    >
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Notifications
        </h3>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 sm:p-6 text-center text-sm sm:text-base text-gray-500">
            Loading...
          </div>
        ) : error ? (
          <div className="p-4 sm:p-6 text-center text-sm sm:text-base text-red-500">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 sm:p-6 text-center text-sm sm:text-base text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-3 sm:p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                !n.read ? "bg-indigo-50" : ""
              }`}
            >
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start sm:items-center justify-between gap-2">
                    <p
                      className={`text-xs sm:text-sm font-medium flex-1 ${
                        !n.read ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {n.title}
                    </p>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      {!n.read && (
                        <button
                          onClick={() => markAsRead(n._id)}
                          className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50 transition-colors"
                          title="Mark as read"
                        >
                          <FiCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(n._id)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <FiX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                    {n.message}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2">
                    {formatTimestamp(n.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-2.5 sm:p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs sm:text-sm text-gray-600">
          <span>{unreadCount} unread</span>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors">
            View all
          </button>
        </div>
      )}
    </div>
  );
};

export default DynamicNotificationDropdown;
