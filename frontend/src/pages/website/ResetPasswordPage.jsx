// src/pages/website/ResetPasswordPage.jsx

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../store/authStore";
import Button from "../../components/ui/Button";
import { validationRules } from "../../utils/validations";
import { ResetPasswordBg, logo } from "../../../public";
import InputField from "../../components/forms/InputField";
import VerificationCodeInput from "../../components/forms/VerificationCodeInput";

const ResetPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: email, 2: code verification
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [inputKey, setInputKey] = useState(0);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [resendingCode, setResendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const verificationCodeRef = useRef(null);
  const { forgotPassword, clearError } = useAuthStore();
  const navigate = useNavigate();
  const emailInputRef = useRef(null);

  // Clear store error on mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (step === 1 && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [step]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    const emailError = validationRules.email(formData.email);
    if (emailError !== true) {
      setErrors({ email: emailError });
      toast.error("Please enter a valid email address");
      return;
    }

    setSendingEmail(true);
    setIsTransitioning(true);

    try {
      const loadingToast = toast.loading("Sending reset code...");

      await forgotPassword(formData.email);

      toast.dismiss(loadingToast);
      toast.success("Password reset code sent to your email!");

      setTimeout(() => {
        setVerifying(false);
        setInputKey((prev) => prev + 1);
        setStep(2);
        setIsTransitioning(false);
        startResendCooldown();
      }, 100);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send reset code"
      );
      setIsTransitioning(false);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || resendingCode) return;

    setResendingCode(true);

    try {
      const loadingToast = toast.loading("Resending code...");
      await forgotPassword(formData.email);
      toast.dismiss(loadingToast);
      toast.success("New reset code sent!");
      startResendCooldown();

      // Reset the verification code input
      if (verificationCodeRef.current) {
        verificationCodeRef.current.reset();
      }

      // Clear any previous errors
      setErrors((prev) => ({ ...prev, code: "" }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to resend code");
    } finally {
      setResendingCode(false);
    }
  };

  const handleCodeVerification = async (code) => {
    if (verifying || code.length !== 5) return;

    setVerifying(true);
    setErrors((prev) => ({ ...prev, code: "" }));
    clearError();

    const loadingToast = toast.loading("Verifying code...");

    try {
      await useAuthStore
        .getState()
        .resetPassword(formData.email, code, "Dummy123!@#");

      toast.dismiss(loadingToast);
      toast.success("Code verified! Redirecting...");

      setTimeout(() => {
        navigate("/new-password", {
          state: { email: formData.email, code },
        });
      }, 500);
    } catch (error) {
      toast.dismiss(loadingToast);
      const errMsg =
        error?.response?.data?.message || "Invalid or expired code";
      setErrors((prev) => ({ ...prev, code: errMsg }));

      // Reset verification code input
      if (verificationCodeRef.current) {
        verificationCodeRef.current.reset();
      }

      toast.error(errMsg);
    } finally {
      setVerifying(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setErrors({});
    setResendCooldown(0);
    setVerifying(false);
    setInputKey((prev) => prev + 1);

    setTimeout(() => {
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    }, 100);
  };

  /** UI Steps */

  const EmailStep = () => (
    <div
      className={`bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 transition-all duration-300 ${
        isTransitioning ? "opacity-50 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Reset Your Password
        </h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you a code to reset your
          password
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <InputField
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          required
          disabled={sendingEmail || isTransitioning}
          autoFocus
          inputRef={emailInputRef}
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          loading={sendingEmail || isTransitioning}
          disabled={sendingEmail || isTransitioning || !formData.email.trim()}
        >
          {isTransitioning ? "Sending..." : "Send Reset Code"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm text-gray-600 hover:text-primary transition-colors"
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );

  const CodeVerificationStep = () => (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 animate-slideIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Enter Verification Code
        </h2>
        <p className="text-gray-600">We've sent a reset code to</p>
        <p className="text-primary font-semibold break-all">{formData.email}</p>
      </div>

      <div className="mb-6">
        <VerificationCodeInput
          key={inputKey}
          ref={verificationCodeRef}
          length={5}
          onComplete={handleCodeVerification}
          error={errors.code}
          disabled={verifying}
        />
      </div>

      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600">Didn't receive the code?</p>
        <button
          onClick={handleResendCode}
          disabled={resendCooldown > 0 || resendingCode}
          className="text-sm text-primary hover:text-primary-dark disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : resendingCode
            ? "Resending..."
            : "Resend code"}
        </button>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleBackToEmail}
            className="text-sm text-gray-600 hover:text-primary transition-colors"
            type="button"
          >
            ← Use different email
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative">
      <div className="w-full lgss:flex overflow-hidden absolute top-0 left-0">
        <img
          src={ResetPasswordBg}
          className="lgss:h-1/2 h-screen object-cover"
          alt="Reset Password"
        />
      </div>

      <Link to="/" className="absolute top-9 text-white text-lg z-20">
        <img src={logo} alt="Logo" />
      </Link>

      <div className="relative z-10 w-full flex justify-center">
        {step === 1 && <EmailStep />}
        {step === 2 && <CodeVerificationStep />}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
