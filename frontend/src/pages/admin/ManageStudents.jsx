import React from "react";
import StudentList from "./components/StudentList";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ManageStudentsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center justify-center sm:justify-start px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm sm:text-base transition-colors self-start"
        >
          <FiArrowLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />{" "}
          <span className="whitespace-nowrap">Back to Dashboard</span>
        </button>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
          Manage Students
        </h1>
      </div>
      <StudentList />
    </div>
  );
};

export default ManageStudentsPage;
