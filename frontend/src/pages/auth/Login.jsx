import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../logo.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const userRole = login(response.data.token);

      if (selectedRole && selectedRole !== userRole) {
        setError(
          "Selected role does not match your account. Please choose the correct role."
        );
        return;
      }

      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/teacher/dashboard");
      }
    } catch (err) {
      console.error(
        "Login failed:",
        err.response?.data?.message || err.message
      );
      setError(
        err.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl dark:shadow-gray-900/50 border-0 dark:border dark:border-gray-700 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center mb-6 sm:mb-8">
            <img
              src={logo}
              alt="App Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-xl shadow-lg"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl animate-shake">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email Field */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 sm:h-12 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg sm:rounded-xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
                Email
              </p>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 sm:h-12 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg sm:rounded-xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
                Password
              </p>
            </div>

            {/* Role Select (optional but recommended) */}
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1 ml-1">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full h-11 sm:h-12 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg sm:rounded-xl px-3 focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:outline-none text-sm sm:text-base"
                disabled={isLoading}
              >
                <option value="">Select role (optional)</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 sm:h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg sm:rounded-xl font-medium mt-6 transition-all duration-200 hover:shadow-lg active:scale-98 text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Don&apos;t have an account?{" "}
            </span>
            <a
              href="/register"
              className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Sign up
            </a>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            Role isn&apos;t asked here. It comes from your account and is inside
            the token after login.
          </p>
          {/* Additional Info for Demo */}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
        
        @media (max-width: 640px) {
          .hover\\:scale-105:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
