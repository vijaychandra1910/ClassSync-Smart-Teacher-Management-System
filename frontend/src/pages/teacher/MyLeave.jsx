import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import Toast from "../../components/ui/Toast";
import { FiCheckCircle, FiXCircle, FiClock, FiPlus } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/datepicker.css";

const StatusBadge = ({ status }) => {
  const statusMap = {
    pending: {
      icon: <FiClock className="mr-2" />,
      color: "bg-yellow-100 text-yellow-800",
      text: "Pending",
    },
    approved: {
      icon: <FiCheckCircle className="mr-2" />,
      color: "bg-green-100 text-green-800",
      text: "Approved",
    },
    rejected: {
      icon: <FiXCircle className="mr-2" />,
      color: "bg-red-100 text-red-800",
      text: "Rejected",
    },
  };

  const currentStatus = statusMap[status] || statusMap.pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatus.color}`}
    >
      {currentStatus.icon}
      {currentStatus.text}
    </span>
  );
};

const MyLeave = () => {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  // Form state
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/leaves/my-leaves");
      setMyRequests(response.data);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch your leave requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/leaves/apply", {
        fromDate,
        toDate,
        reason,
      });
      setMyRequests((prev) => [response.data.leaveRequest, ...prev]);
      setToast({
        message: "Leave request submitted successfully!",
        type: "success",
      });
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to submit request.",
        type: "error",
      });
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
          My Leave Requests
        </h1>
        <button
          onClick={() => setIsFormVisible((prev) => !prev)}
          className="flex items-center justify-center px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm sm:text-base transition-colors whitespace-nowrap"
        >
          <FiPlus className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
          {isFormVisible ? "Cancel" : "New Leave Request"}
        </button>
      </div>

      {isFormVisible && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8">
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label
                  htmlFor="fromDate"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  From Date
                </label>
                <DatePicker
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  selectsStart
                  startDate={fromDate}
                  endDate={toDate}
                  minDate={new Date()}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm"
                  placeholderText="Select start date"
                />
              </div>
              <div>
                <label
                  htmlFor="toDate"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  To Date
                </label>
                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  selectsEnd
                  startDate={fromDate}
                  endDate={toDate}
                  minDate={fromDate || new Date()}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm"
                  placeholderText="Select end date"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="reason"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  Reason
                </label>
                <textarea
                  id="reason"
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm"
                ></textarea>
              </div>
            </div>
            <div className="text-right mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 text-sm sm:text-base transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
          History
        </h2>
        {loading ? (
          <p className="text-sm sm:text-base text-gray-600 py-4">
            Loading history...
          </p>
        ) : error ? (
          <p className="text-sm sm:text-base text-red-500 py-4">{error}</p>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-3 sm:p-4 font-semibold text-xs sm:text-sm">
                      Dates
                    </th>
                    <th className="p-3 sm:p-4 font-semibold text-xs sm:text-sm">
                      Reason
                    </th>
                    <th className="p-3 sm:p-4 font-semibold text-xs sm:text-sm">
                      Status
                    </th>
                    <th className="p-3 sm:p-4 font-semibold text-xs sm:text-sm">
                      Admin Comment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center p-6 sm:p-8 text-sm sm:text-base text-gray-500"
                      >
                        No leave requests found.
                      </td>
                    </tr>
                  ) : (
                    myRequests.map((request) => (
                      <tr
                        key={request._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          {new Date(request.fromDate).toLocaleDateString()} -{" "}
                          {new Date(request.toDate).toLocaleDateString()}
                        </td>
                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600 max-w-xs truncate">
                          {request.reason}
                        </td>
                        <td className="p-3 sm:p-4">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500 italic max-w-xs truncate">
                          {request.adminComment || "N/A"}
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
    </div>
  );
};

export default MyLeave;
