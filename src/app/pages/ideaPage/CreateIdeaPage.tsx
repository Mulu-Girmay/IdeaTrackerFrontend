import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import IdeaForm from "./IdeaForm";

const CreateIdeaPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/dashboard");
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard")}
          sx={{ mb: 2 }}
        >
          Back to My Ideas
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Create New Idea
        </Typography>
      </Box>

      <IdeaForm
        mode="create"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </Box>
  );
};

export default CreateIdeaPage;
