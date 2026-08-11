import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchUsersRequest,
  createUserRequest,
  updateUserRequest,
  deleteUserRequest,
  toggleUserStatusRequest,
  clearUserManagementMessages,
} from "./slice/userManagementSlice";
import {
  selectAllUsers,
  selectUserManagementLoading,
  selectUserManagementError,
  selectUserManagementSuccess,
} from "./slice/userManagementSelector";
import type { User } from "../../types/auth.types";

const UserManagement = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const isLoading = useSelector(selectUserManagementLoading);
  const error = useSelector(selectUserManagementError);
  const success = useSelector(selectUserManagementSuccess);

  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsersRequest({ page: 1, limit: 1000 }));
  }, [dispatch]);

  const getValidationSchema = () => {
    return Yup.object({
      name: Yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
      email: Yup.string().required("Email is required").email("Invalid email address"),
      password: dialogMode === "create" 
        ? Yup.string().required("Password is required").min(8, "Password must be at least 8 characters")
        : Yup.string().min(8, "Password must be at least 8 characters"),
      role: Yup.string().oneOf(["user", "admin"], "Invalid role"),
    });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "user" as "user" | "admin",
    },
    validationSchema: getValidationSchema(),
    enableReinitialize: true,
    onSubmit: (values) => {
      if (dialogMode === "create") {
        dispatch(
          createUserRequest({
            name: values.name,
            email: values.email,
            password: values.password,
            role: values.role,
          }),
        );
      } else if (selectedUser) {
        const updateData: any = {
          name: values.name,
          email: values.email,
          role: values.role,
        };
        if (values.password) {
          updateData.password = values.password;
        }
        dispatch(
          updateUserRequest({
            id: selectedUser._id,
            data: updateData,
          }),
        );
      }
      handleCloseDialog();
    },
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = (mode: "create" | "edit", user?: User) => {
    setDialogMode(mode);
    if (mode === "edit" && user) {
      formik.setValues({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
      setSelectedUser(user);
    } else {
      formik.resetForm();
      setSelectedUser(null);
    }
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    formik.resetForm();
    setSelectedUser(null);
  };

  const handleOpenDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleToggleUserStatus = (user: User) => {
    dispatch(toggleUserStatusRequest(user._id));
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      dispatch(deleteUserRequest(selectedUser._id));
    }
    handleCloseDeleteDialog();
  };

  const handleClearMessages = () => {
    dispatch(clearUserManagementMessages());
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            User Management
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 0.5 }}
            component="p"
          >
            Manage all users in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("create")}
          disabled={isLoading}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={handleClearMessages}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={handleClearMessages}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Paper>

      {isLoading && users.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={user.role === "admin" ? "error" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? "Active" : "Inactive"}
                        size="small"
                        color={user.isActive ? "success" : "default"}
                        icon={
                          user.isActive ? <CheckCircleIcon /> : <BlockIcon />
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, user)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedUser && handleOpenDialog("edit", selectedUser)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => selectedUser && handleToggleUserStatus(selectedUser)}>
          {selectedUser?.isActive ? (
            <>
              <BlockIcon fontSize="small" sx={{ mr: 1 }} />
              Deactivate
            </>
          ) : (
            <>
              <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
              Activate
            </>
          )}
        </MenuItem>
        <MenuItem
          onClick={() => selectedUser && handleOpenDeleteDialog(selectedUser)}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === "create" ? "Add New User" : "Edit User"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={dialogMode === "create" ? "Password" : "Password (leave blank to keep current)"}
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                label="Role"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => formik.handleSubmit()}
            disabled={!formik.isValid || formik.isSubmitting || isLoading}
          >
            {dialogMode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone!
          </Alert>
          <Typography>
            Are you sure you want to delete user <strong>{selectedUser?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteUser}
            disabled={isLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;