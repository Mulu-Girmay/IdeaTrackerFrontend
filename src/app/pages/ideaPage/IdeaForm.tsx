import { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Alert,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import SubmitButton from "../../components/Button/SubmitButton";
import {
  createIdeaRequest,
  updateIdeaRequest,
  resetIdeaState,
} from "./slice/slice";
import {
  selectIdeaLoading,
  selectIdeaError,
  selectIdeaSuccess,
} from "./slice/selector";
import { IdeaStatus, IdeaCategory } from "../../types/idea.types";

interface IdeaFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    title: string;
    description: string;
    status: IdeaStatus;
    category: IdeaCategory;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: Yup.string().max(
    1000,
    "Description cannot exceed 1000 characters",
  ),
  status: Yup.string()
    .oneOf(Object.values(IdeaStatus), "Invalid status")
    .required("Status is required"),
  category: Yup.string()
    .oneOf(Object.values(IdeaCategory), "Invalid category")
    .required("Category is required"),
});

// Helper function to capitalize first letter
const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const IdeaForm = ({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: IdeaFormProps) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIdeaLoading);
  const error = useSelector(selectIdeaError);
  const success = useSelector(selectIdeaSuccess);

  const isEditMode = mode === "edit";

  const formik = useFormik({
    initialValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status || IdeaStatus.DRAFT,
      category: initialData?.category || IdeaCategory.OTHER,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("form SUbmitted");
    },
  });

  useEffect(() => {
    if (success) {
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
      dispatch(resetIdeaState());
    }
  }, [success, onSuccess, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetIdeaState());
    };
  }, [dispatch]);

  return (
    <Paper sx={{ p: 4, maxWidth: 600, width: "100%", mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        {isEditMode ? "Edit Idea" : "Create New Idea"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {isEditMode
            ? "Idea updated successfully!"
            : "Idea created successfully!"}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              fullWidth
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              disabled={isLoading}
              required
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              disabled={isLoading}
              placeholder="Describe your idea..."
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              select
              name="status"
              label="Status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
              disabled={isLoading}
              required
            >
              {Object.values(IdeaStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {capitalizeFirst(status)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              select
              name="category"
              label="Category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
              disabled={isLoading}
              required
            >
              {Object.values(IdeaCategory).map((category) => (
                <MenuItem key={category} value={category}>
                  {capitalizeFirst(category)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={12}>
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <SubmitButton
                fullWidth
                size="large"
                isLoading={isLoading}
                type="submit"
                disabled={!formik.isValid || isLoading}
              >
                {isEditMode ? "Update Idea" : "Create Idea"}
              </SubmitButton>

              {onCancel && (
                <SubmitButton
                  fullWidth
                  size="large"
                  variant="outlined"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </SubmitButton>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default IdeaForm;
