// src/pages/ResetPasswordPage/index.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Paper, Typography, Link, Alert } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FormInput from "../../../components/Input/Input";
import SubmitButton from "../../../components/Button/SubmitButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordRequest } from "./index";
import {
  selectResetPasswordLoading,
  selectResetPasswordError,
  selectResetPasswordSuccess,
} from "./selector";

const validationSchema = Yup.object({
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number",
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const isLoading = useSelector(selectResetPasswordLoading);
  const error = useSelector(selectResetPasswordError);
  const success = useSelector(selectResetPasswordSuccess);

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (token) {
        dispatch(
          resetPasswordRequest({ token, newPassword: values.newPassword }),
        );
      }
    },
  });

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [success, navigate]);

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
          Reset Password
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 3 }}
        >
          Enter your new password below.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <FormInput
            name="newPassword"
            label="New Password"
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.newPassword}
            touched={formik.touched.newPassword}
            showPasswordToggle
            required
            fullWidth
            sx={{ mb: 2 }}
            disabled={success ? true : false}
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
            disabled={success ? true : false}
          />

          <SubmitButton
            fullWidth
            size="large"
            isLoading={isLoading}
            type="submit"
            disabled={!formik.isValid || !formik.dirty || isLoading || success}
            sx={{ mt: 2 }}
          >
            Reset Password
          </SubmitButton>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              <Link 
                component={RouterLink} 
                to="/login" 
                underline="hover" 
                sx={{ fontWeight: 600 }}
              >
                Back to Sign In
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPasswordPage;
