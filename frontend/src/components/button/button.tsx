import { ButtonHTMLAttributes, FC } from "react";
import "./button.css";
import clsx from "clsx";

export const enum ButtonView {
  Primary = "primary",
  Secondary = "secondary",
}
interface ButtonProps {
  label: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: () => void;
  view?: ButtonView;
  disabled?: boolean;
}

export const Button: FC<ButtonProps> = ({
  type,
  label,
  onClick,
  view = ButtonView.Primary,
  disabled,
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={clsx("button", view)}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
