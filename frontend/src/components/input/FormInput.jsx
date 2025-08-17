import React, { forwardRef } from "react";

const FormInput = forwardRef(
  (
    {
      name,
      label,
      type = "text",
      value,
      onChange,
      placeholder,
      required = false,
      multiline = false,
      rows = 3,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseInputStyles =
      "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label
          htmlFor={name}
          className="font-semibold text-[0.9rem] text-[#344054]"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {multiline ? (
          <textarea
            id={name}
            name={name}
            ref={ref}
            rows={rows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`${baseInputStyles} resize-none`}
            {...props}
          />
        ) : (
          <input
            id={name}
            name={name}
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={baseInputStyles}
            {...props}
          />
        )}
      </div>
    );
  }
);

export default FormInput;
