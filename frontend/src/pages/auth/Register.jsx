import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import api from "../../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../logo.svg";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      const userRole = login(response.data.token);
      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/teacher/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please verify details and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl border-0 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center mb-6 sm:mb-8">
            <img
              src={logo}
              alt="App Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-xl shadow-lg"
            />
          </div>
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-2">
              Create an account
            </h1>
            <p className="text-gray-600 text-sm">Register with your details</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 sm:h-12 border border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 sm:h-12 border border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="Choose a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 sm:h-12 border border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1 ml-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-11 sm:h-12 border border-gray-200 rounded-lg sm:rounded-xl px-3 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-sm sm:text-base"
                disabled={isLoading}
              >
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 sm:h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg sm:rounded-xl font-medium mt-2 transition-all duration-200 hover:shadow-lg active:scale-98 text-sm sm:text-base"
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
            </span>
            <Link to="/login" className="text-sm text-indigo-600 font-medium">
              Sign in
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Note: College ID is not required, it will be created automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
