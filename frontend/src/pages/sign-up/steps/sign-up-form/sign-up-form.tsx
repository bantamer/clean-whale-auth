import { Link } from "react-router-dom";
import "./sign-up-form.css";
import { useForm } from "../../../../components/form/hooks/use-from";
import { validateEmail } from "../../../../utils/validators/validate-email";
import { validatePassword } from "../../../../utils/validators/validate-password";
import { HttpMethods, makeRequest } from "../../../../utils/fetch/make-request";
import { AppRoutes } from "../../../../app-routes";
import Input from "../../../../components/input/input";
import { PasswordInput } from "../../../../components/password-input/password-input";
import { Button } from "../../../../components/button/button";
import { Form } from "../../../../components/form/form";
import { FC } from "react";
import { StepProps } from "../types";
import { SignUpFormSteps } from "../../sign-up";

export const SignUpForm: FC<StepProps> = ({ setStep }) => {
  const { values, errors, formError, handleChange, handleBlur, handleSubmit } =
    useForm({
      initialValues: {
        email: "",
        password: "",
      },
      validators: {
        email: validateEmail,
        password: validatePassword,
      },
      onSubmit: async ({ email, password }) => {
        await makeRequest("/auth/register", {
          method: HttpMethods.POST,
          body: { email, password },
        });

        setStep(SignUpFormSteps.Success);
      },
    });

  return (
    <Form onSubmit={handleSubmit} error={formError}>
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        value={values.email}
        onChange={handleChange("email")}
        onBlur={handleBlur("email")}
        autoComplete="email"
        required
        error={errors.email}
      />

      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value={values.password}
        onChange={handleChange("password")}
        onBlur={handleBlur("password")}
        autoComplete="current-password"
        required
        error={errors.password}
      />

      <Button
        type="submit"
        label="Signup"
        disabled={!!errors.email || !!errors.password}
      />

      <p className="auth-link-container">
        Already have account{" "}
        <Link className="link" to={AppRoutes.Login}>
          Login
        </Link>
      </p>
    </Form>
  );
};
