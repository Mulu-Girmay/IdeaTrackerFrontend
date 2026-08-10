// src/pages/IdeaListPage/index.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  Fab,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import IdeaCard from "../../components/Idea/IdeaCard";
import {
  getMyIdeasRequest,
  deleteIdeaRequest,
  resetIdeaState,
} from "../../pages/ideaPage/slice/slice";
import {
  selectIdeas,
  selectIdeaLoading,
  selectIdeaError,
  selectIdeaPagination,
  selectIdeaSuccess,
} from "../DashboardPage/slice/idea.selector";
import { IdeaStatus, IdeaCategory } from "../../types/idea.types";

const IdeaListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ideas = useSelector(selectIdeas);
  const isLoading = useSelector(selectIdeaLoading);
  const error = useSelector(selectIdeaError);
  const success = useSelector(selectIdeaSuccess);
  const pagination = useSelector(selectIdeaPagination);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 9,
    status: "",
    category: "",
    search: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(getMyIdeasRequest(filters));
  }, [
    dispatch,
    filters.page,
    filters.limit,
    filters.status,
    filters.category,
    filters.search,
  ]);

  useEffect(() => {
    if (success) {
      dispatch(resetIdeaState());
    }
  }, [success, dispatch]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setFilters((prev) => ({ ...prev, page: value }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 9,
      status: "",
      category: "",
      search: "",
    });
  };

  const handleCreateIdea = () => {
    navigate("/dashboard/ideas/create");
  };

  const handleViewIdea = (id: string) => {
    navigate(`/dashboard/ideas/${id}`);
  };

  const handleEditIdea = (id: string) => {
    navigate(`/dashboard/ideas/edit/${id}`);
  };

  const handleDeleteIdea = (id: string) => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      dispatch(deleteIdeaRequest(id));
    }
  };

  const hasActiveFilters = filters.status || filters.category || filters.search;

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              My Ideas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and organize your ideas
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateIdea}
            sx={{ borderRadius: 2 }}
          >
            Create Idea
          </Button>
        </Box>

        {/* Search and Filters */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Search ideas..."
              size="small"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              sx={{ flex: 1, minWidth: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: filters.search && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => handleFilterChange("search", "")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              size="small"
            >
              Filters{" "}
              {hasActiveFilters && (
                <Chip
                  label="Active"
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}
            </Button>

            {hasActiveFilters && (
              <Button size="small" onClick={handleClearFilters}>
                Clear All
              </Button>
            )}
          </Box>

          {showFilters && (
            <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  {Object.values(IdeaStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {Object.values(IdeaCategory).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </Paper>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Ideas Grid */}
        {!isLoading && ideas.length > 0 && (
          <>
            <Grid container spacing={3}>
              {ideas.map((idea) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idea._id}>
                  <IdeaCard
                    idea={idea}
                    onView={handleViewIdea}
                    onEdit={handleEditIdea}
                    onDelete={handleDeleteIdea}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && ideas.length === 0 && (
          <Paper
            sx={{
              p: 8,
              textAlign: "center",
              backgroundColor: "transparent",
              border: "2px dashed",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No ideas yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start by creating your first idea
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateIdea}
            >
              Create Your First Idea
            </Button>
          </Paper>
        )}

        {/* Results Info */}
        {!isLoading && ideas.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {ideas.length} of {pagination.total} ideas
            </Typography>
          </Box>
        )}

        {/* FAB for Create Idea on Mobile */}
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleCreateIdea}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            display: { xs: "flex", md: "none" },
          }}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  );
};

export default IdeaListPage;
