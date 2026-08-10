// src/routes/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUser,
} from "../pages/authPage/slice/selector";

const PrivateRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  // const user = useSelector(selectUser);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
