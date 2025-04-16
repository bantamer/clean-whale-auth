import { useNavigate } from "react-router-dom";
import "./welcome.css";
import { Button, ButtonView } from "../../components/button/button";
import { useAuth } from "../../contexts/auth.context";
import { AppRoutes } from "../../app-routes";
import { decodeJwt } from "../../utils/jwt";
import { HttpMethods, makeRequest } from "../../utils/fetch/make-request";

const Welcome = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const decodeToken = decodeJwt(token);

  const handleLogout = async () => {
    await makeRequest("/auth/logout", {
      method: HttpMethods.DELETE,
      credentials: "include",
    });
    logout();
    navigate(AppRoutes.Login);
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Hello, {decodeToken.email}</h1>
        <Button
          onClick={handleLogout}
          view={ButtonView.Secondary}
          label="Logout"
        />
      </div>
    </div>
  );
};

export default Welcome;
