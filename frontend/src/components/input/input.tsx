import React, { PropsWithChildren } from "react";
import "./input.css";
import clsx from "clsx";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<PropsWithChildren<InputProps>> = ({
  label,
  error,
  className = "",
  children,
  ...props
}) => {
  return (
    <div className="form-group">
      <label htmlFor={props.id} className="form-label">
        {label}
      </label>

      <div className="form-input-container">
        <input
          {...props}
          className={clsx("form-input", { error }, className)}
        />
        {children}
      </div>

      {error && <div className="form-input-error-message">{error}</div>}
    </div>
  );
};

export default Input;
