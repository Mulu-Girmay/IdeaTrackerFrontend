import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Tab,
  Tabs,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  updateProfileRequest,
  changePasswordRequest,
  clearAuthMessages,
} from "../authPage/slice/slice";
import {
  selectUser,
  selectIsLoading,
  selectError,
  selectSuccess,
} from "../authPage/slice/selector";

const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null) {
    return Object.values(error).join(", ");
  }
  return "";
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const profileValidationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name cannot exceed 30 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
});

const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string()
    .required("Current password is required")
    .min(8, "Password must be at least 8 characters"),
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

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);

  const [tabValue, setTabValue] = useState(0);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profileFormik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
    enableReinitialize: true,
    validationSchema: profileValidationSchema,
    onSubmit: (values) => {
      dispatch(
        updateProfileRequest({
          name: values.name,
          email: values.email,
        }),
      );
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordValidationSchema,
    onSubmit: (values) => {
      dispatch(
        changePasswordRequest({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      );
    },
  });

  useEffect(() => {
    return () => {
      dispatch(clearAuthMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      if (success.includes("Password")) {
        passwordFormik.resetForm();
      }
      if (success.includes("Profile")) {
        setIsEditingProfile(false);
      }
      setTimeout(() => {
        dispatch(clearAuthMessages());
      }, 3000);
    }
  }, [success, dispatch]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    dispatch(clearAuthMessages());
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    profileFormik.resetForm();
    dispatch(clearAuthMessages());
  };

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Profile Settings
      </Typography>

      <Paper sx={{ maxWidth: 800 }}>
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 3,
            bgcolor: "background.default",
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: "2rem",
              bgcolor: "primary.main",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Role: {user.role.toUpperCase()}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
          >
            <Tab label="Profile Information" />
            <Tab label="Change Password" />
          </Tabs>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ m: 3, mb: 0 }}
            onClose={() => dispatch(clearAuthMessages())}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ m: 3, mb: 0 }}
            onClose={() => dispatch(clearAuthMessages())}
          >
            {success}
          </Alert>
        )}

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ px: 3, pb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Personal Information
              </Typography>
              {!isEditingProfile && (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditingProfile(true)}
                  variant="outlined"
                >
                  Edit Profile
                </Button>
              )}
            </Box>

            <form onSubmit={profileFormik.handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={profileFormik.values.name}
                onChange={profileFormik.handleChange}
                onBlur={profileFormik.handleBlur}
                error={
                  profileFormik.touched.name &&
                  Boolean(profileFormik.errors.name)
                }
                helperText={
                  profileFormik.touched.name &&
                  getErrorMessage(profileFormik.errors.name)
                }
                disabled={!isEditingProfile || isLoading}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profileFormik.values.email}
                onChange={profileFormik.handleChange}
                onBlur={profileFormik.handleBlur}
                error={
                  profileFormik.touched.email &&
                  Boolean(profileFormik.errors.email)
                }
                helperText={
                  profileFormik.touched.email &&
                  getErrorMessage(profileFormik.errors.email)
                }
                disabled={!isEditingProfile || isLoading}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Account Status"
                value={user.isActive ? "Active" : "Inactive"}
                disabled
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Member Since"
                value={new Date(user.createdAt).toLocaleDateString()}
                disabled
                sx={{ mb: 3 }}
              />

              {isEditingProfile && (
                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
                  <Button
                    startIcon={<CancelIcon />}
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={
                      !profileFormik.isValid ||
                      !profileFormik.dirty ||
                      isLoading
                    }
                  >
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </Box>
              )}
            </form>
          </Box>
        </TabPanel>

        {/* Change Password Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: 3, pb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Change Password
            </Typography>

            <form onSubmit={passwordFormik.handleSubmit}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordFormik.values.currentPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                error={
                  passwordFormik.touched.currentPassword &&
                  Boolean(passwordFormik.errors.currentPassword)
                }
                helperText={
                  passwordFormik.touched.currentPassword &&
                  getErrorMessage(passwordFormik.errors.currentPassword)
                }
                disabled={isLoading}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          edge="end"
                        >
                          {showCurrentPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordFormik.values.newPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                error={
                  passwordFormik.touched.newPassword &&
                  Boolean(passwordFormik.errors.newPassword)
                }
                helperText={
                  passwordFormik.touched.newPassword &&
                  getErrorMessage(passwordFormik.errors.newPassword)
                }
                disabled={isLoading}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordFormik.values.confirmPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                error={
                  passwordFormik.touched.confirmPassword &&
                  Boolean(passwordFormik.errors.confirmPassword)
                }
                helperText={
                  passwordFormik.touched.confirmPassword &&
                  getErrorMessage(passwordFormik.errors.confirmPassword)
                }
                disabled={isLoading}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    !passwordFormik.isValid ||
                    !passwordFormik.dirty ||
                    isLoading
                  }
                >
                  {isLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </Box>
            </form>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
