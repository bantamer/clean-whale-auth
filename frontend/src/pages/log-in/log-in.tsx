import { validateEmail } from "../../utils/validators/validate-email";
import { validatePassword } from "../../utils/validators/validate-password";
import { makeRequest, HttpMethods } from "../../utils/fetch/make-request";
import { useAuth } from "../../contexts/auth.context";
import { AppRoutes } from "../../app-routes";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/input/input";
import { PasswordInput } from "../../components/password-input/password-input";
import { Button } from "../../components/button/button";
import { Form } from "../../components/form/form";
import { useForm } from "../../components/form/hooks/use-from";
import { Modal } from "../../components/modal/modal";

const LogIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

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
        const response = await makeRequest("/auth/login", {
          method: HttpMethods.POST,
          body: { email, password },
        });

        login(response.token);
        navigate(AppRoutes.Welcome);
      },
    });

  return (
    <Modal header="Log In">
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
          label="Login"
          disabled={!!errors.email || !!errors.password}
        />
        <p className="auth-link-container">
          Don't have account{" "}
          <Link className="link" to={AppRoutes.Signup}>
            Sign Up
          </Link>
        </p>
      </Form>
    </Modal>
  );
};

export default LogIn;
