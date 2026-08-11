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
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar,
  Tabs,
  Tab,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Publish as PublishIcon,
  Drafts as DraftsIcon,
} from "@mui/icons-material";
import {
  fetchIdeasRequest,
  updateIdeaStatusRequest,
  deleteIdeaRequest,
  clearIdeaManagementMessages,
} from "./slice/ideaManagementSlice";
import {
  selectAllIdeas,
  selectIdeaManagementLoading,
  selectIdeaManagementError,
  selectIdeaManagementSuccess,
} from "./slice/ideaManagementSelector";
import type { Idea } from "./slice/ideaManagementSlice";

const IdeaManagement = () => {
  const dispatch = useDispatch();
  const ideas = useSelector(selectAllIdeas);
  const isLoading = useSelector(selectIdeaManagementLoading);
  const error = useSelector(selectIdeaManagementError);
  const success = useSelector(selectIdeaManagementSuccess);

  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "published" | "archived"
  >("all");

  useEffect(() => {
    if (statusFilter === "all") {
      dispatch(fetchIdeasRequest({ page: 1, limit: 100 }));
    } else {
      dispatch(
        fetchIdeasRequest({ page: 1, limit: 100, status: statusFilter }),
      );
    }
  }, [dispatch, statusFilter]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, idea: Idea) => {
    setAnchorEl(event.currentTarget);
    setSelectedIdea(idea);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewIdea = (idea: Idea) => {
    setSelectedIdea(idea);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedIdea(null);
  };

  const handleOpenDeleteDialog = (idea: Idea) => {
    setSelectedIdea(idea);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedIdea(null);
  };

  const handleChangeStatus = (
    idea: Idea,
    newStatus: "draft" | "published" | "archived",
  ) => {
    dispatch(updateIdeaStatusRequest({ id: idea._id, status: newStatus }));
    handleMenuClose();
  };

  const handleDeleteIdea = () => {
    if (selectedIdea) {
      dispatch(deleteIdeaRequest(selectedIdea._id));
    }
    handleCloseDeleteDialog();
  };

  const handleClearMessages = () => {
    dispatch(clearIdeaManagementMessages());
  };

  const filteredIdeas = ideas.filter((idea: any) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusCount = (status: string) => {
    if (status === "all") return ideas.length;
    return ideas.filter((idea: any) => idea.status === status).length;
  };

  const getAuthorInfo = (idea: Idea) => {
    if (typeof idea.owner === "object" && idea.owner !== null) {
      return {
        name: idea.owner.name,
        email: idea.owner.email,
      };
    }
    return {
      name: "Unknown",
      email: "",
    };
  };

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
            Idea Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage all ideas in the system
          </Typography>
        </Box>
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

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={statusFilter}
          onChange={(_, newValue) => setStatusFilter(newValue)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label={`All (${getStatusCount("all")})`} value="all" />
          <Tab
            label={`Published (${getStatusCount("published")})`}
            value="published"
          />
          <Tab label={`Draft (${getStatusCount("draft")})`} value="draft" />
          <Tab
            label={`Archived (${getStatusCount("archived")})`}
            value="archived"
          />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search ideas by title or description..."
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

      {isLoading && ideas.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIdeas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No ideas found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredIdeas.map((idea: any) => {
                  const author = getAuthorInfo(idea);
                  return (
                    <TableRow key={idea._id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {idea.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {idea.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            sx={{ width: 32, height: 32, fontSize: "0.875rem" }}
                          >
                            {author.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {author.name}
                            </Typography>
                            {author.email && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {author.email}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={idea.status}
                          size="small"
                          color={getStatusColor(idea.status) as any}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(idea.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, idea)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
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
        <MenuItem onClick={() => selectedIdea && handleViewIdea(selectedIdea)}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {selectedIdea?.status !== "published" && (
          <MenuItem
            onClick={() =>
              selectedIdea && handleChangeStatus(selectedIdea, "published")
            }
          >
            <PublishIcon fontSize="small" sx={{ mr: 1 }} />
            Publish
          </MenuItem>
        )}
        {selectedIdea?.status !== "draft" && (
          <MenuItem
            onClick={() =>
              selectedIdea && handleChangeStatus(selectedIdea, "draft")
            }
          >
            <DraftsIcon fontSize="small" sx={{ mr: 1 }} />
            Move to Draft
          </MenuItem>
        )}
        {selectedIdea?.status !== "archived" && (
          <MenuItem
            onClick={() =>
              selectedIdea && handleChangeStatus(selectedIdea, "archived")
            }
          >
            <ArchiveIcon fontSize="small" sx={{ mr: 1 }} />
            Archive
          </MenuItem>
        )}
        <MenuItem
          onClick={() => selectedIdea && handleOpenDeleteDialog(selectedIdea)}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* View Idea Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Idea Details</DialogTitle>
        <DialogContent>
          {selectedIdea && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedIdea.title}
              </Typography>
              <Chip
                label={selectedIdea.status}
                size="small"
                color={getStatusColor(selectedIdea.status) as any}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedIdea.description}
              </Typography>
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Author Information
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}
                >
                  <Avatar>
                    {getAuthorInfo(selectedIdea).name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {getAuthorInfo(selectedIdea).name}
                    </Typography>
                    {getAuthorInfo(selectedIdea).email && (
                      <Typography variant="caption" color="text.secondary">
                        {getAuthorInfo(selectedIdea).email}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {new Date(selectedIdea.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {new Date(selectedIdea.updatedAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
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
            Are you sure you want to delete the idea{" "}
            <strong>{selectedIdea?.title}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteIdea}
            disabled={isLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IdeaManagement;
