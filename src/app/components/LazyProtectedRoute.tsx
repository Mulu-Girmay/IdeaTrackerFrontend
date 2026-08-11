import { Suspense } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectUser,
} from "../pages/authPage/slice/selector";
import LoadingFallback from "./LoadingFallBack";

interface LazyProtectedRouteProps {
  children: React.ReactNode;
  fallbackMessage?: string;
  fallbackFullScreen?: boolean;
  redirectTo?: string;
  adminOnly?: boolean;
  userOnly?: boolean;
}

const LazyProtectedRoute = ({
  children,
  fallbackMessage = "Loading...",
  fallbackFullScreen = true,
  redirectTo = "/login",
  adminOnly = false,
  userOnly = false,
}: LazyProtectedRouteProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (isLoading) {
    return <LoadingFallback message="Authenticating..." fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (user) {
    if (adminOnly && user.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    if (userOnly && user.role === "admin") {
      return <Navigate to="/dashboard/admin" replace />;
    }
  }

  return (
    <Suspense
      fallback={
        <LoadingFallback
          message={fallbackMessage}
          fullScreen={fallbackFullScreen}
        />
      }
    >
      {children}
    </Suspense>
  );
};

export default LazyProtectedRoute;