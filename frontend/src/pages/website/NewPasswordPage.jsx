// src/pages/website/NewPasswordPage.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../store/authStore";
import FormInput from "../../components/input/FormInput";
import Button from "../../components/ui/Button";
import { validationRules } from "../../utils/validations";
import { ResetPasswordBg, logo } from "../../../public";

const NewPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    suggestions: [],
  });

  const { resetPassword, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const newPasswordRef = useRef(null);

  // Get email and code from navigation state
  const { email, code } = location.state || {};

  useEffect(() => {
    // Clear any existing errors
    clearError();

    // If no email or code, redirect to reset password page
    if (!email || !code) {
      toast.error(
        "Invalid access. Please start the password reset process again."
      );
      navigate("/reset-password");
      return;
    }

    // Show entry toast and focus password input
    toast.info("Please create your new password");
    
    setTimeout(() => {
      if (newPasswordRef.current) {
        newPasswordRef.current.focus();
      }
    }, 100);
  }, [email, code, navigate, clearError]);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    const suggestions = [];

    if (password.length >= 8) score += 1;
    else suggestions.push("At least 8 characters");

    if (/[a-z]/.test(password)) score += 1;
    else suggestions.push("Lowercase letter");

    if (/[A-Z]/.test(password)) score += 1;
    else suggestions.push("Uppercase letter");

    if (/\d/.test(password)) score += 1;
    else suggestions.push("Number");

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else suggestions.push("Special character");

    return { score, suggestions };
  };

  const getStrengthColor = (score) => {
    if (score <= 2) return "bg-red-500";
    if (score <= 3) return "bg-yellow-500";
    if (score <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (score) => {
    if (score <= 2) return "Weak";
    if (score <= 3) return "Fair";
    if (score <= 4) return "Good";
    return "Strong";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check password strength for new password
    if (name === "newPassword") {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate new password
    const passwordError = validationRules.password(formData.newPassword);
    if (passwordError !== true) {
      newErrors.newPassword = passwordError;
    }

    // Validate confirm password
    const confirmPasswordError = validationRules.confirmPassword(
      formData.confirmPassword,
      formData.newPassword
    );
    if (confirmPasswordError !== true) {
      newErrors.confirmPassword = confirmPasswordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = Object.values(errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    // Warn about weak passwords
    if (passwordStrength.score < 3) {
      const proceed = window.confirm(
        "Your password is weak. Are you sure you want to continue?"
      );
      if (!proceed) return;
    }

    try {
      setIsProcessing(true);

      // Show processing toast
      const processingToast = toast.loading("Resetting your password...");

      await resetPassword(email, code, formData.newPassword);

      // Dismiss processing toast and show success
      toast.dismiss(processingToast);
      toast.success("Password reset successfully!");

      // Navigate to confirmation page
      setTimeout(() => {
        navigate("/reset-password/confirm", {
          state: { email },
        });
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Don't render if no email or code
  if (!email || !code) {
    return null;
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative">
      <div className="w-full lgss:flex overflow-hidden absolute top-0 left-0">
        <img
          src={ResetPasswordBg}
          className="lgss:h-1/2 h-screen object-cover"
          alt="New Password"
        />
      </div>

      <Link to="/" className="absolute top-9 text-white text-lg z-20">
        <img src={logo} alt="Logo" />
      </Link>

      <div className="relative z-10 w-full flex justify-center">
        <div
          className={`bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 transition-all duration-300 animate-slideIn ${
            isProcessing ? "opacity-75 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create New Password
            </h2>
            <p className="text-gray-600">
              Enter your new password below for{" "}
              <span className="text-primary font-semibold break-all">
                {email}
              </span>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FormInput
                name="newPassword"
                label="New Password"
                type={showPasswords.newPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                required
                disabled={loading || isProcessing}
                inputRef={newPasswordRef}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                disabled={loading || isProcessing}
              >
                {showPasswords.newPassword ? "🙈" : "👁️"}
              </button>
              
              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
                          passwordStrength.score
                        )}`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {getStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  {passwordStrength.suggestions.length > 0 && (
                    <div className="mt-1 text-xs text-gray-600">
                      Missing: {passwordStrength.suggestions.join(", ")}
                    </div>
                  )}
                </div>
              )}
              
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="relative">
              <FormInput
                name="confirmPassword"
                label="Confirm New Password"
                type={showPasswords.confirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                required
                disabled={loading || isProcessing}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                disabled={loading || isProcessing}
              >
                {showPasswords.confirmPassword ? "🙈" : "👁️"}
              </button>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2 text-sm">
                  {formData.newPassword === formData.confirmPassword ? (
                    <span className="text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Passwords match
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Passwords don't match
                    </span>
                  )}
                </div>
              )}
              
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading || isProcessing}
              disabled={
                loading ||
                isProcessing ||
                !formData.newPassword.trim() ||
                !formData.confirmPassword.trim()
              }
            >
              {isProcessing ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/reset-password"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              ← Back to Reset Password
            </Link>
          </div>

          {/* Password Tips */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Password Requirements:
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Contains uppercase and lowercase letters</li>
              <li>• Contains at least one number</li>
              <li>• Contains at least one special character</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPasswordPage;