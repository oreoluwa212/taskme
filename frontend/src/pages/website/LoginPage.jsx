// src/pages/website/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../store/authStore";
import InputField from "../../components/forms/InputField";
import Button from "../../components/ui/Button";
import { validationRules, validateForm } from "../../utils/validations";
import { loginSignImg, logo } from "../../../public";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from state, or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const validationSchema = {
    email: [validationRules.required, validationRules.email],
    password: [validationRules.required],
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear store error
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm(formData, validationSchema);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await login(formData);

      // Ensure we have a successful login response
      if (response && response.user) {
        toast.success("Login successful!");
        // Navigate to the intended destination
        navigate(from, { replace: true });
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row relative overflow-hidden">
      {/* Background Image - Mobile Only */}
      <div className="lg:hidden absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={loginSignImg}
          className="w-full h-full object-cover"
          alt="Login Background"
        />
      </div>

      {/* Left side - Image (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 h-full overflow-hidden">
        <img
          src={loginSignImg}
          className="w-full h-full object-cover"
          alt="Login"
        />
      </div>

      {/* Right side - Form */}
      <div className="relative z-10 lg:z-auto w-full lg:w-1/2 h-screen flex flex-col items-center justify-center px-4 py-8 lg:px-8 lg:bg-white">
        {/* Logo */}
        <Link
          to="/"
          className="absolute top-4 right-4 lg:top-6 lg:right-6 z-20"
        >
          <img src={logo} alt="Logo" className="h-8 lg:h-10" />
        </Link>

        {/* Welcome Text */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 lg:mb-8 text-center text-white lg:text-gray-800 drop-shadow-lg lg:drop-shadow-none">
          Welcome back
        </h2>

        {/* Form Container */}
        <div className="bg-white/95 lg:bg-white backdrop-blur-sm lg:backdrop-blur-none w-full max-w-md lg:max-w-lg xl:max-w-xl px-6 sm:px-8 lg:px-10 rounded-lg shadow-xl py-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              placeholder="Enter your email"
              required
            />

            <InputField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={errors.password}
              placeholder="Enter your password"
              required
            />

            <div className="flex justify-end">
              <Link
                to="/reset-password"
                className="text-sm text-primary hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-base font-medium"
              loading={loading}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-semibold transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
