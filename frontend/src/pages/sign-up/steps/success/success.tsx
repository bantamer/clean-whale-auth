import { FC } from "react";
import { StepProps } from "../types";
import { Button } from "../../../../components/button/button";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../../app-routes";
import "./success.css";

export const Success: FC<StepProps> = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(AppRoutes.Login);
  };

  return (
    <div className="success-step">
      <div className="success-icon"></div>
      <h2 className="success-title">You're signed up!</h2>
      <p className="success-description">
        Your account has been successfully created.
      </p>
      <Button type="button" label="Go to Login" onClick={handleButtonClick} />
    </div>
  );
};
