import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { BookOpen, Users, Calendar, LogIn, Moon, Sun } from "lucide-react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import ScheduleEditor from "./pages/admin/ScheduleEditor";
import ManageTeachersPage from "./pages/admin/ManageTeachers";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageLeaves from "./pages/admin/ManageLeaves";
import MyLeave from "./pages/teacher/MyLeave";
import MyStudents from "./pages/teacher/MyStudents";
import AdminSubstitutions from "./pages/admin/Substitutions";
import TeacherSubstitutions from "./pages/teacher/Substitutions";
import Footer from "./components/ui/Footer";
import "./App.css";
import logo from "./logo.svg";
import Chatbot from "./components/Chatbot";
import { useTheme } from "./context/ThemeContext";

// Theme Toggle Component for Landing Page
const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
      ) : (
        <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
      )}
    </button>
  );
};

// Particle Background Component
function ParticleBackground() {
  const canvasRef = useRef(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        const particleColor = isDarkMode
          ? `rgba(129, 140, 248, ${particle.opacity})`
          : `rgba(99, 102, 241, ${particle.opacity})`;
        ctx.fillStyle = particleColor;
        ctx.fill();
      });

      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const lineColor = isDarkMode
              ? `rgba(129, 140, 248, ${0.1 * (1 - distance / 100)})`
              : `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`;
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        background: isDarkMode
          ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
          : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    />
  );
}

// Landing Page Component
function LandingPage() {
  return (
    <div className="min-h-screen dark:bg-gray-900">
      <ParticleBackground />

      {/* Navigation */}
      <nav className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="h-12 sm:h-14 md:h-16 flex items-center justify-center">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white dark:bg-gray-800 shadow hover:scale-110 hover:rotate-6 transition-transform duration-300 ease-in-out cursor-pointer"
              title="ClassSync"
            >
              <img
                src={logo}
                alt="ClassSync Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center pt-8 sm:pt-12 md:pt-16 lg:pt-24 xl:pt-32">
          {/* Hero Section */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight px-2">
              Smart College
              <span className="block text-indigo-600 dark:text-indigo-400">
                Management System
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
              Streamline teacher schedules, manage substitutions, and track
              leave applications with our comprehensive college management
              platform.
            </p>

            <div className="pt-4 sm:pt-6 md:pt-8">
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <span>Get Started</span>
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 px-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-lg dark:shadow-gray-900/50 hover:shadow-xl transition-shadow duration-200 border dark:border-gray-700">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <Calendar className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Schedule Management
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
                  Efficiently organize and manage teacher schedules with our
                  intuitive interface.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-lg dark:shadow-gray-900/50 hover:shadow-xl transition-shadow duration-200 border dark:border-gray-700">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <Users className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Teacher Management
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
                  Comprehensive teacher profiles and performance tracking in one
                  place.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-lg dark:shadow-gray-900/50 hover:shadow-xl transition-shadow duration-200 sm:col-span-2 lg:col-span-1 border dark:border-gray-700">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Leave & Substitutions
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
                  Seamless leave application and substitution management system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <>
      <Chatbot />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Landing page with professional design */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected teacher routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <DashboardLayout>
                <TeacherDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/my-schedule"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <DashboardLayout>
                <TeacherDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/apply-leave"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <DashboardLayout>
                <MyLeave />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/substitutions"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <DashboardLayout>
                <TeacherSubstitutions />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/my-students"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <DashboardLayout>
                <MyStudents />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teacher-schedule/:teacherId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <ScheduleEditor />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-teachers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <ManageTeachersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-students"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <ManageStudents />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-leaves"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <ManageLeaves />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/substitutions"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <AdminSubstitutions />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Chatbot />
    </>
  );
}

export default App;
