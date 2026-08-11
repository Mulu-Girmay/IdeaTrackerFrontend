import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import "../App.css";

import LoadingFallback from "./components/LoadingFallBack";
import LazyPrivateRoute from "./components/LazyProtectedRoute";

import LoginPage from "./pages/authPage/Login";
import RegisterForm from "./pages/authPage/Register";

const ForgotPasswordPage = lazy(
  () => import("./pages/ForgotPasswordPage/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("./pages/ResetPage/slice/ResetPage"),
);
const DashboardLayout = lazy(
  () => import("./pages/UserDashboardPage/UserDashboard"),
);
const MyIdeasPage = lazy(() => import("./pages/ideaPage/MyIdeasPage"));
const CreateIdeaPage = lazy(() => import("./pages/ideaPage/CreateIdeaPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AdminDashboard = lazy(() => import("./pages/AdmiPage/AdminDashboard"));
const DashboardOverview = lazy(
  () => import("./pages/AdmiPage/DashboardOverview"),
);
const UserManagement = lazy(() => import("./pages/AdmiPage/UserManagement"));
const IdeaManagement = lazy(() => import("./pages/AdmiPage/IdeaManagement"));

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <LoadingFallback fullScreen message="Loading application..." />
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route
            path="/dashboard"
            element={
              <LazyPrivateRoute userOnly>
                <Suspense
                  fallback={
                    <LoadingFallback
                      message="Loading dashboard..."
                      fullScreen
                    />
                  }
                >
                  <DashboardLayout />
                </Suspense>
              </LazyPrivateRoute>
            }
          >
            <Route
              index
              element={
                <Suspense
                  fallback={<LoadingFallback message="Loading your ideas..." />}
                >
                  <MyIdeasPage />
                </Suspense>
              }
            />
            <Route
              path="ideas/create"
              element={
                <Suspense
                  fallback={
                    <LoadingFallback message="Loading create idea form..." />
                  }
                >
                  <CreateIdeaPage />
                </Suspense>
              }
            />
            <Route
              path="profile"
              element={
                <Suspense
                  fallback={<LoadingFallback message="Loading profile..." />}
                >
                  <ProfilePage />
                </Suspense>
              }
            />
          </Route>

          <Route
            path="/dashboard/admin"
            element={
              <LazyPrivateRoute adminOnly>
                <Suspense
                  fallback={
                    <LoadingFallback
                      message="Loading admin dashboard..."
                      fullScreen
                    />
                  }
                >
                  <AdminDashboard />
                </Suspense>
              </LazyPrivateRoute>
            }
          >
            <Route
              index
              element={
                <Suspense
                  fallback={<LoadingFallback message="Loading overview..." />}
                >
                  <DashboardOverview />
                </Suspense>
              }
            />
            <Route
              path="users"
              element={
                <Suspense
                  fallback={<LoadingFallback message="Loading users..." />}
                >
                  <UserManagement />
                </Suspense>
              }
            />
            <Route
              path="ideas"
              element={
                <Suspense
                  fallback={<LoadingFallback message="Loading ideas..." />}
                >
                  <IdeaManagement />
                </Suspense>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
