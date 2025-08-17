// src/pages/website/SignUpPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../store/authStore";
import InputField from "../../components/forms/InputField";
import Button from "../../components/ui/Button";
import { validationRules, validateForm } from "../../utils/validations";
import { loginSignImg, logo } from "../../../public";
import SignupVerifyEmailPage from "./SignupVerifyEmailPage";
import H1Text from "../../components/website/headerText/H1Text";

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const { signup, loading, error, clearError } = useAuthStore();

  const validationSchema = {
    firstName: [validationRules.required, validationRules.name],
    lastName: [validationRules.required, validationRules.name],
    email: [validationRules.required, validationRules.email],
    password: [validationRules.required, validationRules.password],
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
      await signup(formData);
      toast.success("Account created successfully! Please verify your email.");
      setStep(2);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during signup."
      );
    }
  };

  if (step === 2) {
    return <SignupVerifyEmailPage email={formData.email} />;
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row relative overflow-hidden">
      {/* Background Image - Mobile Only */}
      <div className="lg:hidden absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={loginSignImg}
          className="w-full h-full object-cover"
          alt="Signup Background"
        />
      </div>

      {/* Left side - Image (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 h-full overflow-hidden">
        <img
          src={loginSignImg}
          className="w-full h-full object-cover"
          alt="Sign Up"
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

        {/* Header */}
        <div className="mb-6 lg:mb-8 text-center">
          <H1Text
            h2Text="Create your free account"
            className="text-white lg:text-gray-900"
          />
        </div>

        {/* Form Container */}
        <div className="bg-white/95 lg:bg-white backdrop-blur-sm lg:backdrop-blur-none w-full max-w-md lg:max-w-lg xl:max-w-xl px-6 sm:px-8 lg:px-10 rounded-lg shadow-xl py-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name fields in a row on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                error={errors.firstName}
                placeholder="Enter your first name"
                required
              />

              <InputField
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                error={errors.lastName}
                placeholder="Enter your last name"
                required
              />
            </div>

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
              placeholder="Create a password"
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full py-3 text-base font-medium"
                loading={loading}
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
