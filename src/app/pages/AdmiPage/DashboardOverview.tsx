import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  People as UsersIcon,
  Lightbulb as IdeasIcon,
  PersonAdd as ActiveUsersIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  getDashboardStatsRequest,
  refreshDashboardRequest,
  clearDashboardError,
} from "./slice/slice";
import {
  selectDashboardStats,
  selectDashboardLoading,
  selectDashboardError,
  selectTotalUsers,
  selectActiveUsers,
  selectTotalIdeas,
  selectPublishedIdeas,
} from "./slice/selector";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

const StatIconWrapper = styled(Box)<{ color?: string }>(({ theme, color }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 56,
  height: 56,
  borderRadius: "12px",
  backgroundColor: color ? `${color}15` : theme.palette.primary.main + "15",
  color: color || theme.palette.primary.main,
}));

const DashboardOverview = () => {
  const dispatch = useDispatch();

  const stats = useSelector(selectDashboardStats);
  const isLoading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);
  const totalUsers = useSelector(selectTotalUsers);
  const activeUsers = useSelector(selectActiveUsers);
  const totalIdeas = useSelector(selectTotalIdeas);
  const publishedIdeas = useSelector(selectPublishedIdeas);

  useEffect(() => {
    dispatch(getDashboardStatsRequest());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(refreshDashboardRequest());
  };

  const statsCards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: <UsersIcon sx={{ fontSize: 32 }} />,
      color: "#1976d2",
      subtitle: `${activeUsers} active users`,
      trend: "+12%",
    },
    {
      title: "Total Ideas",
      value: totalIdeas,
      icon: <IdeasIcon sx={{ fontSize: 32 }} />,
      color: "#ed6c02",
      subtitle: `${publishedIdeas} published`,
      trend: "+8%",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: <ActiveUsersIcon sx={{ fontSize: 32 }} />,
      color: "#2e7d32",
      subtitle: `${totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0}% of total`,
      trend: "+5%",
    },
    {
      title: "Ideas per User",
      value: totalUsers > 0 ? (totalIdeas / totalUsers).toFixed(1) : 0,
      icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
      color: "#9c27b0",
      subtitle: "Average engagement",
      trend: "+15%",
    },
  ];

  if (isLoading && !stats) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

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
            Dashboard Overview
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Welcome to the admin dashboard
          </Typography>
        </Box>
        <Tooltip title="Refresh data">
          <IconButton onClick={handleRefresh} disabled={isLoading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearDashboardError())}>
          {error}
        </Alert>
      )}

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid key={index} xs={12} sm={6} md={3}>
            <StyledCard>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      sx={{ mb: 1 }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <TrendingUpIcon
                        sx={{ fontSize: 16, color: "success.main" }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: "success.main", fontWeight: 600 }}
                      >
                        {stat.trend}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        vs last month
                      </Typography>
                    </Box>
                  </Box>
                  <StatIconWrapper color={stat.color}>
                    {stat.icon}
                  </StatIconWrapper>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* User Statistics */}
        <Grid xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              User Statistics
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid xs={6}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "primary.main",
                    color: "white",
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats?.adminCount || 0}
                  </Typography>
                  <Typography variant="caption">Admin Users</Typography>
                </Box>
              </Grid>
              <Grid xs={6}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "secondary.main",
                    color: "white",
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats?.userCount || 0}
                  </Typography>
                  <Typography variant="caption">Regular Users</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Idea Statistics */}
        <Grid xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Idea Statistics
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid xs={6}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "warning.main",
                    color: "white",
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats?.draftIdeas || 0}
                  </Typography>
                  <Typography variant="caption">Draft Ideas</Typography>
                </Box>
              </Grid>
              <Grid xs={6}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "error.main",
                    color: "white",
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats?.archivedIdeas || 0}
                  </Typography>
                  <Typography variant="caption">Archived Ideas</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
