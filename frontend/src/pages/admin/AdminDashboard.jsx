import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import {
  FiUsers,
  FiClipboard,
  FiAlertTriangle,
  FiArrowRight,
  FiInfo,
} from "react-icons/fi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088fe",
  "#00c49f",
];

const TooltipIcon = ({ text }) => (
  <div className="relative group">
    <FiInfo className="h-4 w-4 text-gray-400 cursor-pointer" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-3 bg-white text-gray-600 text-xs rounded-lg shadow-xl border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
      {text}
      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-white"></div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const windowSize = useWindowSize();
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalSchedules: 0,
    pendingLeaves: 0,
    charts: {
      subjectsDistribution: {},
      weeklyLoad: {},
      leaveStatusDistribution: {},
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/dashboard/stats");
        setStats(response.data);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch admin statistics."
        );
        setStats({
          totalTeachers: 12,
          totalSchedules: 150,
          pendingLeaves: 3,
          charts: {
            subjectsDistribution: {
              Math: 10,
              Science: 8,
              English: 12,
              History: 5,
            },
            weeklyLoad: { Mon: 30, Tue: 25, Wed: 35, Thu: 28, Fri: 32 },
            leaveStatusDistribution: { Pending: 3, Approved: 10, Rejected: 1 },
          },
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const leaveStatusData = Object.entries(
    stats.charts.leaveStatusDistribution || {}
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 md:mb-8">
        Admin Dashboard
      </h1>

      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        {/* Card 1 */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">
              Total Teachers
            </CardTitle>
            <FiUsers className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">
              {stats.totalTeachers}
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Active teachers in the school
            </p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">
              Total Scheduled Periods
            </CardTitle>
            <FiClipboard className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">
              {stats.totalSchedules}
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Periods scheduled this week
            </p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">
              Pending Leaves
            </CardTitle>
            <FiAlertTriangle className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">
              {stats.pendingLeaves || 0}
            </div>
            <Link
              to="/admin/manage-leaves"
              className="text-xs text-muted-foreground dark:text-gray-400 hover:underline"
            >
              Review leave requests
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="mt-6 sm:mt-8 md:mt-10 grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Weekly Load */}
        <Card className="lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl dark:text-gray-200">
              Weekly Load
            </CardTitle>
            <TooltipIcon
              text={
                <>
                  <p className="font-bold mb-1">Weekly Load Distribution</p>
                  <p>
                    This graph shows the total number of periods scheduled for
                    each day.
                  </p>
                </>
              }
            />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <ResponsiveContainer
              width="100%"
              height={250}
              className="sm:h-[300px]"
            >
              <BarChart
                data={Object.entries(stats.charts.weeklyLoad || {}).map(
                  ([name, value]) => ({ name, value })
                )}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" style={{ fontSize: "12px" }} />
                <YAxis style={{ fontSize: "12px" }} />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Distribution */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl dark:text-gray-200">
              Subject Distribution
            </CardTitle>
            <TooltipIcon
              text={
                <>
                  <p className="font-bold mb-1">Subject Period Distribution</p>
                  <p>
                    This graph shows the total number of periods assigned to
                    each subject.
                  </p>
                </>
              }
            />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <ResponsiveContainer
              width="100%"
              height={250}
              className="sm:h-[300px]"
            >
              <BarChart
                data={Object.entries(
                  stats.charts.subjectsDistribution || {}
                ).map(([name, value]) => ({ name, value }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={60}
                  style={{ fontSize: "10px" }}
                />
                <YAxis style={{ fontSize: "12px" }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leave Status Pie */}
        <Card className="lg:col-span-3 xl:col-span-1 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl dark:text-gray-200">
              Leave Status
            </CardTitle>
            <TooltipIcon
              text={
                <>
                  <p className="font-bold mb-1">Leave Request Status</p>
                  <p>
                    This chart shows the breakdown of all leave requests by
                    their current status.
                  </p>
                </>
              }
            />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {leaveStatusData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height={250}
                className="sm:h-[300px]"
              >
                <PieChart>
                  <Pie
                    data={leaveStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={windowSize.width >= 640 ? 80 : 60}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label
                  >
                    {leaveStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-sm sm:text-base text-gray-500">
                <p>No leave data to display.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
