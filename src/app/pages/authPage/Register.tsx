import { Box, Paper, Typography, Link, Alert } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FormInput from "../../components/Input/Input";
import SubmitButton from "../../components/Button/SubmitButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerRequest } from "./slice/slice";
import { selectIsLoading, selectError } from "./slice/selector";
import type { RegisterData } from "../../types/auth.types";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name cannot exceed 30 characters"),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number",
    ),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const RegisterForm = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const registerData: RegisterData = {
        name: values.name,
        email: values.email,
        password: values.password,
      };
      dispatch(registerRequest(registerData));
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
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <FormInput
            name="name"
            label="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.name}
            touched={formik.touched.name}
            required
            fullWidth
            sx={{ mb: 2 }}
          />

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

          <FormInput
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
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
            Sign Up
          </SubmitButton>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                sx={{ fontWeight: 600 }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
