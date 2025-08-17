import React, { useState, useEffect } from "react";
import H1Text from "../headerText/H1Text";

const CodeVerificationModal = ({ onVerify }) => {
  const [code, setCode] = useState(["", "", "", "", ""]);

  useEffect(() => {
    if (code.join("").length === 5) {
      setTimeout(() => {
        onVerify();
      }, 1000);
    }
  }, [code, onVerify]);

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

  return (
    <div className="w-[90%] lgss:w-[35%] bg-white py-4 px-[5%] flex flex-col mx-auto rounded shadow-lg">
      <H1Text
        h2Text={"Confirm your email address"}
        pText={"Enter the code that was sent to your email"}
      />
      <div className="flex w-full justify-between gap-2 my-8">
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

export default CodeVerificationModal;
