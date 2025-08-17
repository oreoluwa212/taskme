import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import H1Text from "../headerText/H1Text";

const SignupEmailVerify = ({ email }) => {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 4) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  const handleVerify = async () => {
    try {
      const response = await fetch(
        "https://taskai-backend.onrender.com/v1/auth/verify",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: code.join(""),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Invalid OTP. Please try again.");
        toast.error(errorData.message || "Invalid OTP. Please try again.");
        return;
      }else{
      toast.success("Email verification successful!");
        navigate("/login");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (code.join("").length === 5) {
      handleVerify();
    }
  }, [code]);

  return (
    <div className="lgss:w-[35%] bg-white py-4 px-[5%] flex flex-col mx-auto rounded shadow-lg">
      <H1Text
        h2Text={"Confirm your email address"}
        pText={"Enter the code that was sent to your email"}
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex w-full justify-between gap-3 my-8">
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            maxLength={1}
            className="w-10 p-2 border border-gray-300 rounded outline-none text-center"
          />
        ))}
      </div>
    </div>
  );
};

export default SignupEmailVerify;
