import { FC, useState } from "react";
import Input, { InputProps } from "../input/input";
import "./password-input.css";

const ShowPassIcon: FC<{
  showPassword: boolean;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
}> = ({ showPassword }) => {
  if (!showPassword) {
    return <img src="icons/eye-closed.svg" alt="Closed Eye Icon" />;
  }

  return <img src="icons/eye.svg" alt="Eye Icon" />;
};

type PasswordInputProps = InputProps;

export const PasswordInput: FC<PasswordInputProps> = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      id="password"
      name="password"
      type={showPassword ? "text" : "password"}
      {...props}
    >
      <div
        className="password-input-icon"
        onClick={() => {
          setShowPassword(!showPassword);
        }}
      >
        <ShowPassIcon showPassword={showPassword} />
      </div>
    </Input>
  );
};
