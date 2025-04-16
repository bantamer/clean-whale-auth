import { Routes, Route, Navigate } from "react-router-dom";
import LogIn from "./pages/log-in/log-in";
import SignUp from "./pages/sign-up/sign-up";
import Welcome from "./pages/welcome/welcome";
import { ProtectedRoute } from "./components/protected-route";
import { AppRoutes } from "./app-routes";
import { AuthProvider, useAuth } from "./contexts/auth.context";
import { useCallback, useEffect } from "react";
import { HttpMethods, makeRequest } from "./utils/fetch/make-request";

const AppRoutesComponent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path={AppRoutes.Root}
        element={
          <Navigate
            to={isAuthenticated ? AppRoutes.Welcome : AppRoutes.Login}
          />
        }
      />
      <Route path={AppRoutes.Signup} element={<SignUp />} />
      <Route path={AppRoutes.Login} element={<LogIn />} />
      <Route
        path={AppRoutes.Welcome}
        element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={AppRoutes.Root} />} />
    </Routes>
  );
};

const App = () => {
  const handlePing = useCallback(async () => {
    await makeRequest("/ping", { method: HttpMethods.GET });
  }, []);

  useEffect(() => {
    handlePing();
  }, [handlePing]);

  return (
    <AuthProvider>
      <AppRoutesComponent />
    </AuthProvider>
  );
};

export default App;
