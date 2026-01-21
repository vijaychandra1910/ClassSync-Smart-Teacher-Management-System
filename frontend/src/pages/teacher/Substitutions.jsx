import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { FiUsers, FiCalendar, FiBookOpen, FiClock } from "react-icons/fi";
import Toast from "../../components/ui/Toast";

const StatCard = ({ icon, title, value, subtitle }) => (
  <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-md flex items-center">
    <div className="bg-indigo-100 text-indigo-600 p-2 sm:p-3 md:p-4 rounded-full flex-shrink-0">
      {icon}
    </div>
    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
      <p className="text-xs sm:text-sm text-gray-500 truncate">{title}</p>
      <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-[10px] sm:text-xs text-gray-400 truncate">
        {subtitle}
      </p>
    </div>
  </div>
);

const Substitutions = () => {
  const [substitutions, setSubstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  const weekdayMap = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    const fetchSubstitutions = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/substitutions/mine");
        setSubstitutions(response.data);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch substitutions."
        );
        console.error(err);
        setToast({ message: "Failed to fetch substitutions.", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchSubstitutions();
  }, []);

  const getTodaysSubstitutions = () => {
    const today = new Date().getDay();
    return substitutions.filter((sub) => {
      const subDate = new Date(sub.createdAt);
      return (
        subDate.getDay() === today &&
        subDate.toDateString() === new Date().toDateString()
      );
    }).length;
  };

  const getThisWeekSubstitutions = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

    return substitutions.filter((sub) => {
      const subDate = new Date(sub.createdAt);
      return subDate >= startOfWeek && subDate <= endOfWeek;
    }).length;
  };

  const getUniqueOriginalTeachers = () => {
    const uniqueTeachers = new Set(
      substitutions.map((sub) => sub.originalTeacherId?._id)
    );
    return uniqueTeachers.size;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading substitutions...</p>
      </div>
    );
  }

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />

      <div className="w-full px-0 sm:px-2 md:px-4 lg:px-6 xl:px-8">
        {/* Top summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <StatCard
            icon={<FiCalendar size={24} />}
            title="Today's Substitutions"
            value={getTodaysSubstitutions()}
            subtitle="Substitutions assigned for today"
          />
          <StatCard
            icon={<FiClock size={24} />}
            title="This Week"
            value={getThisWeekSubstitutions()}
            subtitle="Total substitutions this week"
          />
          <StatCard
            icon={<FiUsers size={24} />}
            title="Teachers Covered"
            value={getUniqueOriginalTeachers()}
            subtitle="Different teachers you've substituted"
          />
        </div>

        {/* Substitutions List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 border dark:border-gray-700">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 p-3 sm:p-4 md:p-6 border-b dark:border-gray-700">
            Your Substitute Assignments
          </h2>

          {error && (
            <div className="p-4 sm:p-6 text-center text-sm sm:text-base text-red-500">
              {error}
            </div>
          )}

          {!error && (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                      <th className="p-3 sm:p-4 font-semibold text-xs sm:text-sm dark:text-gray-200">
                        Date
                      </th>
                      <th className="p-3 sm:p-4 font-semibold text-xs sm:text-sm dark:text-gray-200">
                        Time
                      </th>
                      <th className="p-3 sm:p-4 font-semibold text-xs sm:text-sm dark:text-gray-200">
                        Original Teacher
                      </th>
                      <th className="p-3 sm:p-4 font-semibold text-xs sm:text-sm dark:text-gray-200">
                        Subject
                      </th>
                      <th className="p-3 sm:p-4 font-semibold text-xs sm:text-sm dark:text-gray-200">
                        Class
                      </th>
                      <th className="p-3 sm:p-4 font-semibold text-xs sm:text-sm dark:text-gray-200">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {substitutions.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center p-6 sm:p-8 text-gray-500"
                        >
                          <div className="flex flex-col items-center">
                            <FiBookOpen
                              size={40}
                              className="sm:w-12 sm:h-12 text-gray-300 mb-3 sm:mb-4"
                            />
                            <p className="text-sm sm:text-base">
                              No substitutions assigned yet.
                            </p>
                            <p className="text-xs sm:text-sm mt-1">
                              When you're assigned as a substitute, they'll
                              appear here.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      substitutions.map((substitution) => (
                        <tr
                          key={substitution._id}
                          className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="p-3 sm:p-4">
                            <div className="font-medium text-xs sm:text-sm dark:text-gray-200">
                              {new Date(substitution.date).toLocaleDateString()}
                            </div>
                            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                              {weekdayMap[substitution.scheduleSlotId?.weekday]}
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="text-[10px] sm:text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded inline-block">
                              Period{" "}
                              {(substitution.scheduleSlotId?.periodIndex || 0) +
                                1}
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="font-medium text-xs sm:text-sm dark:text-gray-200">
                              {substitution.originalTeacherId?.name || "N/A"}
                            </div>
                            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] sm:max-w-none">
                              {substitution.originalTeacherId?.email || "N/A"}
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="font-medium text-xs sm:text-sm text-indigo-600 dark:text-indigo-400">
                              {substitution.scheduleSlotId?.subject || "N/A"}
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="font-medium text-xs sm:text-sm dark:text-gray-200">
                              {substitution.scheduleSlotId?.classSection ||
                                "N/A"}
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                              {substitution.reason ||
                                "Teacher leave substitution"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity Summary - if there are substitutions */}
        {substitutions.length > 0 && (
          <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-4 sm:p-6 border dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
              Recent Activity
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {substitutions.slice(0, 3).map((substitution) => (
                <div
                  key={substitution._id}
                  className="flex items-center p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 flex-shrink-0">
                    <FiUsers size={14} className="sm:w-4 sm:h-4" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate dark:text-gray-200">
                      Substituted for{" "}
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {substitution.originalTeacherId?.name}
                      </span>
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                      {substitution.scheduleSlotId?.subject} - Class{" "}
                      {substitution.scheduleSlotId?.classSection} •{" "}
                      {new Date(substitution.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">
                    {new Date(substitution.assignedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Substitutions;
