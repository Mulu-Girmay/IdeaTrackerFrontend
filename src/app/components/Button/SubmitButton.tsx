import React, { useState, useEffect, useCallback } from "react";
import { styled, keyframes } from "@mui/material/styles";
import { Button, Box, Typography, Fade } from "@mui/material";
import { CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
import type { ButtonProps } from "@mui/material";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const checkmark = keyframes`
  0% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
`;

export interface SubmitButtonProps extends Omit<
  ButtonProps,
  "onClick" | "type"
> {
  isLoading?: boolean;
  loadingText?: string;
  successText?: string;
  successDuration?: number;
  error?: string | null;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  onClick?: () => void | Promise<void>;
  children?: React.ReactNode;
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) =>
    !["isLoading", "isSuccess", "isError"].includes(prop as string),
})<{
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
}>(({ theme, isLoading, isSuccess, isError }) => ({
  position: "relative",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  minWidth: "120px",
  minHeight: "48px",
  borderRadius: "8px",
  fontWeight: 600,
  textTransform: "none",

  ...(isLoading && {
    color: "transparent !important",
    pointerEvents: "none",
    "&::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "24px",
      height: "24px",
      marginTop: "-12px",
      marginLeft: "-12px",
      border: "3px solid rgba(255, 255, 255, 0.3)",
      borderTop: `3px solid ${theme.palette.common.white}`,
      borderRadius: "50%",
      animation: `${spin} 0.8s linear infinite`,
    },
  }),

  ...(isSuccess && {
    backgroundColor: theme.palette.success.main,
    borderColor: theme.palette.success.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
      borderColor: theme.palette.success.dark,
    },
    "& .MuiButton-startIcon": {
      animation: `${checkmark} 0.5s ease-out`,
    },
  }),

  ...(isError && {
    animation: `${shake} 0.5s ease-in-out`,
    borderColor: theme.palette.error.main,
  }),

  "&.Mui-disabled": {
    opacity: 0.7,
  },
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  color: theme.palette.error.main,
  fontSize: "0.75rem",
  minHeight: "20px",
}));

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading = false,
  loadingText = "Please wait...",
  successText = "Success!",
  successDuration = 2000,
  error = null,
  disabled = false,
  fullWidth = false,
  size = "medium",
  variant = "contained",
  color = "primary",
  startIcon,
  endIcon,
  onClick,
  children = "Submit",
  sx,
  ...rest
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isSubmitting) {
      if (showSuccess) {
        const timer = setTimeout(() => {
          setShowSuccess(false);
        }, successDuration);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, isSubmitting, showSuccess, successDuration]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  useEffect(() => {
    if (isLoading || isSubmitting) {
      setShowSuccess(false);
      setErrorMessage(null);
    }
  }, [isLoading, isSubmitting]);

  const handleClick = useCallback(async () => {
    if (isLoading || isSubmitting || disabled || !onClick) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onClick();
      setShowSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [isLoading, isSubmitting, disabled, onClick]);

  const isButtonLoading = isLoading || isSubmitting;
  const isButtonSuccess = showSuccess && !isButtonLoading;
  const isButtonError = !!errorMessage && !isButtonLoading;

  const getButtonText = () => {
    if (isButtonLoading) return loadingText;
    if (isButtonSuccess) return successText;
    return children;
  };

  const getButtonIcon = () => {
    if (isButtonSuccess) return <CheckCircle />;
    if (isButtonError) return <ErrorIcon />;
    return startIcon;
  };

  const getButtonColor = () => {
    if (isButtonSuccess) return "success";
    if (isButtonError) return "error";
    return color;
  };

  return (
    <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
      <StyledButton
        {...rest}
        type="submit"
        variant={variant}
        color={getButtonColor()}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled || isButtonLoading}
        isLoading={isButtonLoading}
        isSuccess={isButtonSuccess}
        isError={isButtonError}
        onClick={handleClick}
        startIcon={getButtonIcon()}
        endIcon={isButtonLoading ? undefined : endIcon}
        sx={{
          minWidth:
            size === "small" ? "80px" : size === "large" ? "160px" : "120px",
          ...sx,
        }}
      >
        {getButtonText()}
      </StyledButton>

      <Fade in={!!errorMessage && !isButtonLoading}>
        <ErrorContainer>
          <ErrorIcon sx={{ fontSize: "14px" }} />
          <Typography variant="caption" color="error">
            {errorMessage}
          </Typography>
        </ErrorContainer>
      </Fade>
    </Box>
  );
};

export default SubmitButton;
