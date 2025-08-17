import React, { useState } from "react";
import { RiUploadCloud2Line } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function FormInput({
  name,
  placeholder,
  id,
  label,
  textarea,
  upload,
  icon,
  onIconClick,
  select,
  options,
  value,
  onChange,
  type,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  let InputComponent = textarea ? "textarea" : "input";
  let inputClassName = textarea
    ? "w-full bg-white border rounded-[8px] p-2 outline-none h-[150px]"
    : "w-full bg-white border h-12 rounded-[8px] px-3 outline-none";

  if (upload) {
    InputComponent = "input";
    inputClassName = "hidden";
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="flex w-full flex-col gap-2 relative">
      {label && (
        <label
          className="font-semibold text-[0.9rem] text-[#344054]"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      {upload ? (
        <div>
          <InputComponent type="file" className="hidden" name={name} id={id} />
          <label
            htmlFor={id}
            className="w-1/4 bg-[#FECDCA] bg-opacity-50 h-[100px] rounded-[8px] px-10 flex items-center justify-center cursor-pointer text-primary text-[1.6rem]"
          >
            <RiUploadCloud2Line />
          </label>
        </div>
      ) : select ? (
        <div className="relative">
          <select
            className="w-full bg-white border h-12 rounded-[8px] px-3 outline-none"
            name={name}
            id={id}
            value={value}
            onChange={onChange}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {icon && (
            <div
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
              onClick={onIconClick}
            >
              {icon}
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <InputComponent
            type={isPasswordVisible ? "text" : type || "text"}
            className={inputClassName}
            placeholder={placeholder}
            name={name}
            id={id}
            value={value}
            onChange={onChange}
          />
          {type === "password" && (
            <div
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>
          )}
          {icon && (
            <div
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
              onClick={onIconClick}
            >
              {icon}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FormInput;
