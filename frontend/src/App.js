import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Profile from "./components/Profile/Profile";
import LoginActivity from "./components/LoginActivity/LoginActivity";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import SuspiciousActivity from "./components/SuspiciousActivity/SuspiciousActivity";
import SecurityAlerts from "./components/SecurityAlerts/SecurityAlerts";
import SecurityAnalytics
    from "./components/SecurityAnalytics/SecurityAnalytics";
    import Reports from "./components/Reports/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
<Route path="/profile" element={<Profile />} />
<Route element={<DashboardLayout />}>

    <Route path="/dashboard" element={<Dashboard />} />

    <Route path="/login-activity" element={<LoginActivity />} />

    <Route
    path="/suspicious-activity"
    element={<SuspiciousActivity />}
/>

<Route
    path="/security-alerts"
    element={<SecurityAlerts />}
/>

<Route
    path="/security-analytics"
    element={<SecurityAnalytics />}
/>

<Route
    path="/reports"
    element={<Reports />}
/>

</Route>

</Routes>
    </BrowserRouter>
  );
}

export default App;