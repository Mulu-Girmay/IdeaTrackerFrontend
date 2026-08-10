import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tooltip,
  Avatar,
  alpha,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  Publish as PublishIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import type { Idea, IdeaStatus } from "../../types/idea.types";

export interface IdeaCardProps {
  idea: Idea;
  onView?: (idea: Idea) => void;
  onEdit?: (idea: Idea) => void;
  onDelete?: (idea: Idea) => void;
  onStatusChange?: (idea: Idea, status: IdeaStatus) => void;
  showActions?: boolean;
  compact?: boolean;
  elevation?: number;
}

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "compact",
})<{ compact?: boolean }>(({ theme, compact }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  borderRadius: "12px",
  position: "relative",
  overflow: "visible",
  cursor: "pointer",

  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
    "& .action-menu": {
      opacity: 1,
    },
  },

  ...(compact && {
    borderRadius: "8px",
    "& .MuiCardContent-root": {
      padding: theme.spacing(1.5),
    },
    "& .MuiCardActions-root": {
      padding: theme.spacing(1, 1.5),
    },
  }),
}));

const StatusBadge = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "statusColor",
})<{ statusColor?: string }>(({ theme, statusColor }) => ({
  position: "absolute",
  top: -10,
  right: 16,
  fontWeight: 600,
  fontSize: "0.7rem",
  backgroundColor: statusColor || theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: "16px",
  boxShadow: theme.shadows[2],
  padding: theme.spacing(0, 1),
  textTransform: "capitalize",
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: 500,
  fontSize: "0.7rem",
  borderRadius: "6px",
}));

const OwnerInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
  paddingTop: theme.spacing(1),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
}));

const statusConfig = {
  draft: {
    label: "Draft",
    color: "#9e9e9e",
    icon: null,
  },
  published: {
    label: "Published",
    color: "#4caf50",
    icon: <PublishIcon sx={{ fontSize: 14, mr: 0.5 }} />,
  },
  archived: {
    label: "Archived",
    color: "#ff9800",
    icon: <ArchiveIcon sx={{ fontSize: 14, mr: 0.5 }} />,
  },
};

const categoryColors = {
  technology: "#2196f3",
  business: "#ff9800",
  design: "#e91e63",
  marketing: "#9c27b0",
  other: "#757575",
};

const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  showActions = true,
  compact = false,
  elevation = 2,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    handleMenuClose();
    onView?.(idea);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit?.(idea);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    onDelete?.(idea);
  };

  const handleStatusChange = (status: IdeaStatus) => {
    handleMenuClose();
    onStatusChange?.(idea, status);
  };

  const handleCardClick = () => {
    onView?.(idea);
  };

  const renderStatus = () => {
    const config =
      statusConfig[idea.status as keyof typeof statusConfig] ||
      statusConfig.draft;
    return (
      <StatusBadge
        label={config.label}
        statusColor={config.color}
        size="small"
      />
    );
  };

  const renderCategory = () => {
    const color =
      categoryColors[idea.category as keyof typeof categoryColors] ||
      categoryColors.other;
    return (
      <CategoryChip
        label={idea.category.charAt(0).toUpperCase() + idea.category.slice(1)}
        size="small"
        sx={{ backgroundColor: `${color}20`, color: color }}
      />
    );
  };

  const renderOwner = () => {
    const owner = typeof idea.owner === "object" ? idea.owner : null;
    return (
      <OwnerInfo>
        <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
          {owner?.name?.charAt(0) || <PersonIcon sx={{ fontSize: 14 }} />}
        </Avatar>
        <Typography variant="caption" color="text.secondary">
          {owner?.name || "Unknown User"}
        </Typography>
        <Box
          sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <AccessTimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            {new Date(idea.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </OwnerInfo>
    );
  };

  const renderMenu = () => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem onClick={handleView}>
        <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
        View Details
      </MenuItem>
      <MenuItem onClick={handleEdit}>
        <EditIcon fontSize="small" sx={{ mr: 1 }} />
        Edit
      </MenuItem>

      {idea.status !== "published" && (
        <MenuItem onClick={() => handleStatusChange("published")}>
          <PublishIcon fontSize="small" sx={{ mr: 1, color: "success.main" }} />
          Publish
        </MenuItem>
      )}
      {idea.status !== "archived" && (
        <MenuItem onClick={() => handleStatusChange("archived")}>
          <ArchiveIcon fontSize="small" sx={{ mr: 1, color: "warning.main" }} />
          Archive
        </MenuItem>
      )}
      {idea.status === "archived" && (
        <MenuItem onClick={() => handleStatusChange("draft")}>
          <UnarchiveIcon fontSize="small" sx={{ mr: 1 }} />
          Unarchive
        </MenuItem>
      )}

      <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
        Delete
      </MenuItem>
    </Menu>
  );

  const renderDeleteDialog = () => (
    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
      <DialogTitle>Delete Idea</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete "{idea.title}"? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleDeleteConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <StyledCard
        compact={compact}
        elevation={elevation}
        onClick={handleCardClick}
      >
        {renderStatus()}

        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
          {/* Title */}
          <Typography
            variant={compact ? "subtitle1" : "h6"}
            gutterBottom
            sx={{
              fontWeight: 600,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              pr: 4,
            }}
          >
            {idea.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: compact ? 2 : 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 2,
              minHeight: compact ? "2.5rem" : "3.75rem",
            }}
          >
            {idea.description || "No description provided"}
          </Typography>

          {/* Categories & Metadata */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "center",
            }}
          >
            {renderCategory()}
            <Chip
              label={idea.status}
              size="small"
              variant="outlined"
              sx={{
                textTransform: "capitalize",
                borderRadius: "6px",
                fontSize: "0.7rem",
                height: 24,
              }}
            />
          </Box>

          {renderOwner()}
        </CardContent>

        {showActions && (
          <CardActions sx={{ pt: 0, pb: 1, px: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Tooltip title="More actions">
                <IconButton
                  className="action-menu"
                  onClick={handleMenuOpen}
                  sx={{
                    opacity: { xs: 1, sm: 0 },
                    transition: "opacity 0.2s",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                  size="small"
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </CardActions>
        )}
      </StyledCard>

      {renderMenu()}
      {renderDeleteDialog()}
    </>
  );
};

export default IdeaCard;
