import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const FormComponent = ({
  fields,
  buttonText,
  onSubmit,
  showForgotPassword,
  loading,
}) => {
  const [formValues, setFormValues] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.label]: "" }), {})
  );
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleValidation = () => {
    let tempErrors = {};
    let isValid = true;

    fields.forEach((field) => {
      if (!formValues[field.label]) {
        tempErrors[field.label] = `${field.label} is required`;
        isValid = false;
      }
      if (field.type === "email" && formValues[field.label]) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formValues[field.label])) {
          tempErrors[field.label] = "Invalid email address";
          isValid = false;
        }
      }
      if (field.type === "password" && formValues[field.label]) {
        const password = formValues[field.label];
        const passwordPattern =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(password)) {
          tempErrors[field.label] =
            "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character";
          isValid = false;
        }
      }
    });

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      onSubmit(formValues);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field, index) => (
        <div key={index} className="mb-4 relative">
          <label className="block text-sm mb-2 font-semibold text-gray-700">
            {field.label}
          </label>
          <input
            type={
              field.type === "password" && showPassword ? "text" : field.type
            }
            name={field.label}
            value={formValues[field.label]}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded outline-none"
          />
          {field.type === "password" && (
            <span
              className="absolute right-4 top-11 text-[#6C7175] cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          )}
          {errors[field.label] && (
            <p className="text-red-500 text-sm">{errors[field.label]}</p>
          )}
        </div>
      ))}
      {showForgotPassword && (
        <div className="text-right mb-4">
          <Link
            to="/reset-password"
            className="text-primary hover:underline font-semibold"
          >
            Forgot password?
          </Link>
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-primary text-white font-semibold mt-6 p-2 rounded hover:bg-blue-600 flex justify-center items-center"
        disabled={loading}
      >
        {loading ? <ClipLoader color="#ffffff" size={20} /> : buttonText}
      </button>
    </form>
  );
};

export default FormComponent;
