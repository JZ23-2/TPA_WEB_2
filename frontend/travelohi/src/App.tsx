import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/register_login/login/LoginPage";
import RegisterPage from "./pages/register_login/register/RegisterPage";
import ForgotPasswordPage from "./pages/register_login/forgotpassword/ForgotPasswordPage";
import OtpPage from "./pages/register_login/otp/OtpPage";
import { useTheme } from "./context/ThemeContext";
import AuthenticationRoute from "./middlewares/AuthenticationRoute";
import AdminRoute from "./middlewares/AdminRoute";

function App() {
  const { getTheme } = useTheme();
  const currTheme = getTheme();
  return (
    <div className={`${currTheme} scrollable`}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register-page" element={<RegisterPage />} />
        <Route path="/otp-page" element={<OtpPage />} />
        <Route path="/forgot-password-page" element={<ForgotPasswordPage />} />
        <Route path="/*" element={<AuthenticationRoute />} />
        <Route path="/admin/*" element={<AdminRoute />} />
      </Routes>
    </div>
  );
}

export default App;
