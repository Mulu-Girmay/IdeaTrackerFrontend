import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingFallbackProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingFallback = ({
  message = "Loading...",
  fullScreen = false,
}: LoadingFallbackProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...(fullScreen && {
          minHeight: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "background.default",
          zIndex: 9999,
        }),
        ...(!fullScreen && {
          py: 8,
          minHeight: "400px",
        }),
      }}
    >
      <CircularProgress size={48} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingFallback;
