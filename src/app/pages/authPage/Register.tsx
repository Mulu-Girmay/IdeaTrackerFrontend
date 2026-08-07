import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import FormInput from "../../components/Input/Input";
import SubmitButton from "../../components/Button/SubmitButton";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registration data:", formData);
  };

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

        <form onSubmit={handleSubmit}>
          <FormInput
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
          />

          <FormInput
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />

          <FormInput
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            showPasswordToggle
            fullWidth
          />

          <SubmitButton fullWidth size="large" sx={{ mt: 2 }}>
            Sign Up
          </SubmitButton>
          <p>
            Already have an account? <a href="/login">Sign In</a>
          </p>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
