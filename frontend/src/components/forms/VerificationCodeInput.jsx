// src/components/forms/VerificationCodeInput.jsx
import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const VerificationCodeInput = forwardRef(
  (
    {
      length = 5,
      onComplete,
      error,
      className = "",
      disabled = false,
      inputDisabled = false,
    },
    ref
  ) => {
    const [code, setCode] = useState(Array(length).fill(""));
    const inputRefs = useRef([]);

    // Expose reset to parent
    useImperativeHandle(ref, () => ({
      reset: () => {
        setCode(Array(length).fill(""));
        inputRefs.current[0]?.focus();
      },
    }));

    useEffect(() => {
      if (code.every((char) => char !== "")) {
        const timer = setTimeout(() => {
          onComplete(code.join(""));
        }, 200);

        return () => clearTimeout(timer);
      }
    }, [code, onComplete]);

    const handleChange = (e, index) => {
      if (disabled || inputDisabled) return;

      const val = e.target.value;
      if (!/^\d?$/.test(val)) return;

      const newCode = [...code];
      newCode[index] = val;
      setCode(newCode);

      if (val && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (e, index) => {
      if (disabled || inputDisabled) return;

      if (e.key === "Backspace") {
        if (code[index]) {
          const newCode = [...code];
          newCode[index] = "";
          setCode(newCode);
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e) => {
      if (disabled || inputDisabled) return;

      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);
      const newCode = Array(length).fill("");

      for (let i = 0; i < pasted.length; i++) {
        newCode[i] = pasted[i];
      }

      setCode(newCode);
      inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
    };

    return (
      <div className={`w-full ${className}`}>
        <div className="flex justify-center space-x-2">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={disabled}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)}
              className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-md focus:outline-none transition-all
                ${
                  error
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-primary"
                }
                ${disabled ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2"}
              `}
            />
          ))}
        </div>
        {error && (
          <p className="text-sm text-red-500 text-center mt-2">{error}</p>
        )}
      </div>
    );
  }
);

export default VerificationCodeInput;
