import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "../App.css";
import LoginPage from "./pages/authPage/Login";
import RegisterForm from "./pages/authPage/Register";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPage/slice/ResetPage";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./pages/UserDashboard";
import MyIdeasPage from "./pages/ideaPage/MyIdeasPage";
import CreateIdeaPage from "./pages/ideaPage/CreateIdeaPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<MyIdeasPage />} />
          <Route path="ideas/create" element={<CreateIdeaPage />} />
          <Route path="profile" element={<div>Profile Page - Coming Soon</div>} />
          <Route path="settings" element={<div>Settings Page - Coming Soon</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
