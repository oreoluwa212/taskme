// src/pages/website/SignupVerifyEmailPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../store/authStore";
import VerificationCodeInput from "../../components/forms/VerificationCodeInput";
import Button from "../../components/ui/Button";
import { ResetPasswordBg, logo } from "../../../public";

const SignupVerifyEmailPage = ({ email }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [verifying, setVerifying] = useState(false);
  const { verifyEmail, resendVerificationCode, loading, clearError } =
    useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleCodeComplete = async (verificationCode) => {
    if (verifying) return;
    setVerifying(true);

    setCode(verificationCode);
    setError("");
    clearError();

    try {
      await verifyEmail(email, verificationCode);
      toast.success("Email verified successfully!");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid verification code");
      toast.error(error.response?.data?.message || "Invalid verification code");
      inputRef.current?.reset();
      setCode("");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    try {
      await resendVerificationCode(email);
      toast.success("Verification code resent!");
      inputRef.current?.reset();
      setCode("");

      setResendTimer(60);
      setCanResend(false);
      setError("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code");
    }
  };

  const handleManualSubmit = async () => {
    if (code.length !== 5) {
      setError("Please enter a 5-digit verification code");
      return;
    }

    await handleCodeComplete(code);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative">
      <img
        src={ResetPasswordBg}
        className="absolute w-full h-full object-cover"
        alt="Background"
      />

      <Link to="/" className="absolute top-9 text-white text-lg">
        <img src={logo} alt="Logo" />
      </Link>

      <div className="relative z-10 w-full flex justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600">
              We&apos;ve sent a verification code to
            </p>
            <p className="text-primary font-semibold">{email}</p>
          </div>

          <div className="mb-6">
            <VerificationCodeInput
              length={5}
              onComplete={handleCodeComplete}
              error={error}
              disabled={loading || verifying}
            />
          </div>

          {code.length === 5 && (
            <Button
              onClick={handleManualSubmit}
              className="w-full mb-4"
              loading={loading}
              disabled={loading}
            >
              Verify Email
            </Button>
          )}

          <div className="text-center">
            <p className="text-gray-600 mb-2">Didn&apos;t receive the code?</p>
            <button
              onClick={handleResendCode}
              disabled={!canResend || loading}
              className={`text-sm font-medium ${
                canResend && !loading
                  ? "text-primary hover:underline cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              {canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/signup"
              className="text-sm text-gray-600 hover:text-primary"
            >
              ← Back to Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupVerifyEmailPage;
