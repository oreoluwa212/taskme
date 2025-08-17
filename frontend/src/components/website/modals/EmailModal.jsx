import React, { useState } from "react";
import H1Text from "../headerText/H1Text";

const EmailModal = ({ onSubmit }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="bg-white p-8 rounded shadow-custom-xl w-[90%] lgss:w-[30%]">
      <div className="pt-3 pb-7 w-[75%] mx-auto">
      <H1Text
        h2Text={"Reset Password"}
        pText={
          "Enter your email address and we will send you a link to reset your password."
        }
        />
        </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm mb-2 font-semibold text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white mt-4 p-2 rounded font-semibold hover:bg-blue-600"
        >
          Submit email
        </button>
      </form>
    </div>
  );
};

export default EmailModal;
