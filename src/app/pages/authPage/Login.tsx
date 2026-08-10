import { Box, Paper, Typography, Link, Alert } from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import FormInput from "../../components/Input/Input";
import SubmitButton from "../../components/Button/SubmitButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "./slice/slice";
import type { LoginCredentials } from "../../types/auth.types";
import { selectIsLoading, selectError, selectIsAuthenticated, selectUser } from "./slice/selector";
import { useEffect } from "react";

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // Navigate to dashboard after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      // Get the redirect path from location state, or default to dashboard
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const loginData: LoginCredentials = {
        email: values.email,
        password: values.password,
      };
      dispatch(loginRequest(loginData));
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" gutterBottom align="center">
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <FormInput
            name="email"
            label="Email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
            required
            fullWidth
            sx={{ mb: 2 }}
          />

          <FormInput
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
            showPasswordToggle
            required
            fullWidth
            sx={{ mb: 2 }}
          />

          <SubmitButton
            fullWidth
            size="large"
            isLoading={isLoading}
            type="submit"
            disabled={!formik.isValid || !formik.dirty || isLoading}
            sx={{ mt: 2 }}
          >
            Sign In
          </SubmitButton>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Box sx={{ mt: 1, textAlign: "center" }}>
  <Link href="/forgot-password" underline="hover" sx={{ fontSize: "0.875rem" }}>
    Forgot password?
  </Link>
</Box>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link 
                component={RouterLink} 
                to="/register" 
                underline="hover" 
                sx={{ fontWeight: 600 }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
