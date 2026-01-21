import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiLogOut,
  FiHelpCircle,
  FiBell,
  FiUsers,
  FiCalendar,
  FiRepeat,
  FiBookOpen,
  FiClipboard,
  FiInfo,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FiMoon, FiSun } from "react-icons/fi";
import logo from "../../logo.svg";
import DynamicNotificationDropdown from "../ui/NotificationDropdown";
import { useTheme } from "../../context/ThemeContext";

const Dummy = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400">
    <FiInfo className="text-6xl mb-4" />
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p className="text-lg">Coming soon...</p>
  </div>
);

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get("/api/notifications/unread-count");
      setUnreadCount(response.data.unreadCount);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Fetch unread count when component mounts
    fetchUnreadCount();

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderNavLinks = () => (
    <>
      {user?.role === "admin" && (
        <>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <FiHome className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
            <span className="truncate">Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/manage-teachers"
            className={({ isActive }) =>
              `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
            <span className="truncate">Teachers</span>
          </NavLink>
          <NavLink
            to="/admin/manage-students"
            className={({ isActive }) =>
              `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
            <span className="truncate">Students</span>
          </NavLink>
          <NavLink
            to="/admin/manage-leaves"
            className={({ isActive }) =>
              `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <FiClipboard className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
            <span className="truncate">Leave Requests</span>
          </NavLink>
          <NavLink
            to="/admin/substitutions"
            className={({ isActive }) =>
              `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <FiRepeat className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
            <span className="truncate">Substitutions</span>
          </NavLink>
        </>
      )}
      {user?.role === "teacher" && (
        <>
          <NavLink
            to="/teacher/my-schedule"
            className={({ isActive }) =>
              `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <FiBookOpen className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
            <span className="truncate">My Schedule</span>
          </NavLink>
          <NavLink
            to="/teacher/apply-leave"
            className={({ isActive }) =>
              `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <FiClipboard className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
            <span className="truncate">Apply Leave</span>
          </NavLink>
          <NavLink
            to="/teacher/substitutions"
            className={({ isActive }) =>
              `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <FiRepeat className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
            <span className="truncate">Substitutions</span>
          </NavLink>
          <NavLink
            to="/teacher/my-students"
            className={({ isActive }) =>
              `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
            <span className="truncate">My Students</span>
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col justify-between">
        <div>
          <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-gray-700">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white dark:bg-gray-700 shadow hover:scale-110 hover:rotate-6 transition-transform duration-300 ease-in-out cursor-pointer"
              title="ClassSync"
            >
              <img
                src={logo}
                alt="ClassSync Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
          <nav className="mt-6 flex flex-col gap-1 px-4">
            {renderNavLinks()}
          </nav>
        </div>
        <div className="p-3 sm:p-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">
              {user?.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="ml-2 p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
          >
            <FiLogOut size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 sm:w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col justify-between border-r border-gray-200 dark:border-gray-700">
            <div>
              <div className="h-16 flex items-center justify-between px-4 border-b dark:border-gray-700">
                <div className="h-16 flex items-center justify-center">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-gray-700 shadow hover:scale-110 hover:rotate-6 transition-transform duration-300 ease-in-out cursor-pointer"
                    title="ClassSync"
                  >
                    <img
                      src={logo}
                      alt="ClassSync Logo"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <nav className="mt-6 flex flex-col gap-1 px-3 sm:px-4">
                {renderNavLinks()}
              </nav>
            </div>
            <div className="p-3 sm:p-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">
                  {user?.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="ml-2 p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
              >
                <FiLogOut size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
          <div
            className="flex-1 bg-black opacity-40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 sm:h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiMenu size={20} className="sm:w-6 sm:h-6" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 ml-auto">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <FiSun size={20} className="sm:w-5 sm:h-5" />
              ) : (
                <FiMoon size={20} className="sm:w-5 sm:h-5" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={() =>
                  setNotificationDropdownOpen(!notificationDropdownOpen)
                }
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiBell size={20} className="sm:w-6 sm:h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs text-white font-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </span>
                )}
              </button>
              <DynamicNotificationDropdown
                isOpen={notificationDropdownOpen}
                onClose={() => setNotificationDropdownOpen(false)}
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
