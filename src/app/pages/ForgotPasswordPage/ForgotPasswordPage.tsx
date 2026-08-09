// src/pages/ForgotPasswordPage/index.tsx
import { useState } from "react";
import { Box, Paper, Typography, Link, Alert } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FormInput from "../../components/Input/Input";
import SubmitButton from "../../components/Button/SubmitButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordRequest } from "./slice";
import { selectForgotPasswordLoading, selectForgotPasswordError, selectForgotPasswordSuccess } from "./slice/selector";

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
});

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectForgotPasswordLoading);
  const error = useSelector(selectForgotPasswordError);
  const success = useSelector(selectForgotPasswordSuccess);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(forgotPasswordRequest(values.email));
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
          Forgot Password
        </Typography>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Enter your email address and we'll send you a link to reset your password.
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
            Send Reset Link
          </SubmitButton>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Remember your password?{" "}
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

export default ForgotPasswordPage;