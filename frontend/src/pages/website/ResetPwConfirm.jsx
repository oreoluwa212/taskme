// src/pages/website/ResetPasswordConfirmPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { loginSignImg, logo } from "../../../public";
import H1Text from "../../components/website/headerText/H1Text";
import CustomBtn from "../../components/website/buttons/CustomBtn";

const ResetPasswordConfirmPage = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [autoRedirect, setAutoRedirect] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state
  const { email } = location.state || {};

  useEffect(() => {
    // If no email, redirect to reset password page
    if (!email) {
      toast.error(
        "Invalid access. Please start the password reset process again."
      );
      navigate("/reset-password");
      return;
    }

    // Show success toast
    toast.success("🎉 Password reset completed successfully!");

    // Auto-redirect countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (autoRedirect) {
            handleGoToLogin();
          }
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [email, navigate, autoRedirect]);

  const handleGoToLogin = () => {
    if (isRedirecting) return;

    setIsRedirecting(true);
    setAutoRedirect(false);

    const loadingToast = toast.loading("Redirecting to login...");

    // Add a slight delay for better UX
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success("You can now login with your new password!");
      navigate("/login");
    }, 1000);
  };

  const handleResetAnother = () => {
    setAutoRedirect(false);
    toast.info("Starting new password reset process...");

    setTimeout(() => {
      navigate("/reset-password");
    }, 500);
  };

  const handleCancelAutoRedirect = () => {
    setAutoRedirect(false);
    setCountdown(0);
    toast.info("Auto-redirect cancelled");
  };

  // Don't render if no email
  if (!email) {
    return null;
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="hidden w-full md:w-[50%] h-full lgss:flex overflow-hidden">
        <img
          src={loginSignImg}
          className="w-full h-full object-cover"
          alt="Password Reset Successful"
        />
      </div>
      <div className="w-full md:w-[50%] h-full flex flex-col items-center justify-center relative pt-8">
        <Link to="/" className="absolute top-4 right-4 text-white text-lg z-20">
          <img src={logo} alt="Logo" />
        </Link>

        <div
          className={`bg-white lgss:w-[60%] w-[80%] px-10 rounded shadow-custom-xl py-8 lgss:mt-4 mt-0 flex flex-col gap-8 transition-all duration-300 animate-slideIn ${
            isRedirecting ? "opacity-75 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <div className="text-center">
            {/* Success Icon with Animation */}
            <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <H1Text
              h2Text={"Password Reset Successful!"}
              pText={`Your password has been successfully reset for ${email}. You can now log into your account with your new password.`}
            />

            {/* Auto-redirect notification */}
            {autoRedirect && countdown > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  Automatically redirecting to login in {countdown} seconds...
                </p>
                <button
                  onClick={handleCancelAutoRedirect}
                  className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                >
                  Cancel auto-redirect
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <CustomBtn
              click={handleGoToLogin}
              className="bg-primary w-full text-white py-3 px-4 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
              btnText={isRedirecting ? "Redirecting..." : "Go to Login"}
              disabled={isRedirecting}
            />

            <div className="text-center space-y-3">
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Need to reset another password?
                </p>
                <button
                  onClick={handleResetAnother}
                  className="text-sm text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
                  disabled={isRedirecting}
                >
                  Reset another password
                </button>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <Link
                  to="/"
                  className="text-sm text-gray-500 hover:text-primary transition-colors"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              🔒 Security Tips:
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Use a strong, unique password</li>
              <li>• Don't share your password with anyone</li>
              <li>• Consider using a password manager</li>
              <li>• Enable two-factor authentication if available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirmPage;
