import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  MenuItem,
  TextField,
  Pagination,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  getMyIdeasRequest,
  deleteIdeaRequest,
  resetIdeaState,
} from "./slice/slice";
import {
  selectIdeas,
  selectIdeaLoading,
  selectIdeaError,
  selectIdeaSuccess,
  selectIdeaPagination,
} from "./slice/selector";
import { IdeaStatus, IdeaCategory } from "../../types/idea.types";
import type { Idea } from "../../types/idea.types";
import EditIdeaForm from "./EditIdeaForm";

const MyIdeasPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ideas = useSelector(selectIdeas);
  const isLoading = useSelector(selectIdeaLoading);
  const error = useSelector(selectIdeaError);
  const success = useSelector(selectIdeaSuccess);
  const pagination = useSelector(selectIdeaPagination);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    page: 1,
  });

  useEffect(() => {
    dispatch(
      getMyIdeasRequest({
        page: filters.page,
        limit: 9,
        ...(filters.status && { status: filters.status }),
        ...(filters.category && { category: filters.category }),
      })
    );
  }, [dispatch, filters]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(resetIdeaState());
      }, 3000);
    }
  }, [success, dispatch]);

  const handleDeleteClick = (idea: Idea) => {
    setSelectedIdea(idea);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedIdea) {
      dispatch(deleteIdeaRequest(selectedIdea._id));
      setDeleteDialogOpen(false);
      setSelectedIdea(null);
    }
  };

  const handleEditClick = (idea: Idea) => {
    setSelectedIdea(idea);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setSelectedIdea(null);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1,
    }));
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case IdeaStatus.PUBLISHED:
        return "success";
      case IdeaStatus.DRAFT:
        return "warning";
      case IdeaStatus.ARCHIVED:
        return "default";
      default:
        return "default";
    }
  };

  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          My Ideas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/dashboard/ideas/create")}
        >
          Create New Idea
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(resetIdeaState())}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => dispatch(resetIdeaState())}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          select
          label="Status"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          sx={{ minWidth: 150 }}
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          {Object.values(IdeaStatus).map((status) => (
            <MenuItem key={status} value={status}>
              {capitalizeFirst(status)}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Category"
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          sx={{ minWidth: 150 }}
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          {Object.values(IdeaCategory).map((category) => (
            <MenuItem key={category} value={category}>
              {capitalizeFirst(category)}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : ideas.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No ideas yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first idea to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/dashboard/ideas/create")}
          >
            Create Idea
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {ideas.map((idea: Idea) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idea._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                        {idea.title}
                      </Typography>
                      <Chip
                        label={capitalizeFirst(idea.status)}
                        color={getStatusColor(idea.status)}
                        size="small"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {idea.description || "No description provided"}
                    </Typography>

                    <Chip
                      label={capitalizeFirst(idea.category)}
                      size="small"
                      variant="outlined"
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 2 }}
                    >
                      Created: {new Date(idea.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditClick(idea)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(idea)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {pagination.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={filters.page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Idea</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedIdea?.title}"? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Idea</DialogTitle>
        <DialogContent>
          {selectedIdea && (
            <Box sx={{ pt: 1 }}>
              <EditIdeaForm
                ideaId={selectedIdea._id}
                initialData={{
                  title: selectedIdea.title,
                  description: selectedIdea.description,
                  status: selectedIdea.status,
                  category: selectedIdea.category,
                }}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditDialogOpen(false)}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MyIdeasPage;
