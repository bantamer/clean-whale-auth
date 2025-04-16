import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../app-routes";
import { useAuth } from "../../contexts/auth.context";

import { Modal } from "../../components/modal/modal";
import { SignUpForm } from "./steps/sign-up-form/sign-up-form";
import { Success } from "./steps/success/success";
import { StepProps } from "./steps/types";

export const enum SignUpFormSteps {
  Form = "form",
  Success = "success",
}

const steps: Record<SignUpFormSteps, FC<StepProps>> = {
  [SignUpFormSteps.Form]: SignUpForm,
  [SignUpFormSteps.Success]: Success,
};

const SignUp: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentStep, setStep] = useState<SignUpFormSteps>(
    SignUpFormSteps.Form
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate(AppRoutes.Welcome);
    }
  }, [isAuthenticated, navigate]);

  const Step = steps[currentStep];

  return (
    <Modal header="Sign Up">
      <Step setStep={setStep} />
    </Modal>
  );
};

export default SignUp;
