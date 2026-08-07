// src/components/common/FormInput/index.tsx
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  TextField,
  InputAdornment,
  IconButton,
  FormHelperText,
  Box,
  Typography,
} from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Error as ErrorIcon,
  Info,
} from "@mui/icons-material";

export interface FormInputProps extends Omit<TextFieldProps, "error"> {
  name: string;
  label: string;
  error?: string;
  touched?: boolean;
  success?: boolean;
  showSuccessIcon?: boolean;
  helperText?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
  size?: "small" | "medium";
  fullWidth?: boolean;
  /** Minimize width to fit content (default: false) */
  minimizeWidth?: boolean;
  /** Custom width value (e.g., '200px', '50%') */
  customWidth?: string | number;
}

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) =>
    !["success", "hasError", "minimizeWidth", "customWidth"].includes(
      prop as string,
    ),
})<{
  success?: boolean;
  hasError?: boolean;
  minimizeWidth?: boolean;
  customWidth?: string | number;
}>(({ theme, success, hasError, minimizeWidth, customWidth }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    transition: "all 0.2s ease-in-out",
    backgroundColor: theme.palette.background.paper,

    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },

    "&.Mui-focused fieldset": {
      borderWidth: "2px",
    },

    ...(success && {
      "& fieldset": {
        borderColor: theme.palette.success.main,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.success.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.success.main,
      },
    }),

    ...(hasError && {
      "& fieldset": {
        borderColor: theme.palette.error.main,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.error.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.error.main,
      },
    }),
  },

  "& .MuiInputLabel-root": {
    ...(success && {
      color: theme.palette.success.main,
    }),
    ...(hasError && {
      color: theme.palette.error.main,
    }),
  },

  // Minimize width
  ...(minimizeWidth && {
    width: "auto",
    minWidth: "120px",
    "& .MuiOutlinedInput-root": {
      width: "auto",
    },
  }),

  // Custom width
  ...(customWidth && {
    width: customWidth,
  }),
}));

const HelperTextContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  fontSize: "0.75rem",
}));

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  error,
  touched,
  success = false,
  showSuccessIcon = true,
  helperText,
  required = false,
  showPasswordToggle = false,
  size = "medium",
  fullWidth = true,
  minimizeWidth = false,
  customWidth,
  type = "text",
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder,
  sx,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const showError = touched && Boolean(error);
  const showSuccess = success && !showError && touched;

  const getInputProps = () => {
    const props: any = {};

    if (showSuccess && showSuccessIcon) {
      props.endAdornment = (
        <InputAdornment position="end">
          <CheckCircle sx={{ color: "success.main", fontSize: "20px" }} />
        </InputAdornment>
      );
    } else if (showError) {
      props.endAdornment = (
        <InputAdornment position="end">
          <ErrorIcon sx={{ color: "error.main", fontSize: "20px" }} />
        </InputAdornment>
      );
    } else if (showPasswordToggle) {
      props.endAdornment = (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
            size="small"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      );
    }

    return props;
  };

  const getType = () => {
    if (showPasswordToggle) {
      return showPassword ? "text" : "password";
    }
    return type;
  };

  const getHelperText = () => {
    if (showError) return error;
    if (helperText) return helperText;
    return " ";
  };

  const inputProps = getInputProps();

  return (
    <Box
      sx={{
        width: fullWidth ? "100%" : "auto",
        ...(minimizeWidth && { display: "inline-block", width: "auto" }),
      }}
    >
      <StyledTextField
        {...rest}
        id={name}
        name={name}
        label={
          required ? (
            <span>
              {label}{" "}
              <Typography component="span" color="error">
                *
              </Typography>
            </span>
          ) : (
            label
          )
        }
        type={getType()}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        size={size}
        fullWidth={fullWidth && !minimizeWidth}
        error={showError}
        success={showSuccess}
        hasError={showError}
        minimizeWidth={minimizeWidth}
        customWidth={customWidth}
        {...(Object.keys(inputProps).length > 0 && { InputProps: inputProps })}
        sx={sx}
      />

      {(showError || helperText || showSuccess) && (
        <HelperTextContainer>
          {showSuccess && showSuccessIcon && (
            <CheckCircle sx={{ fontSize: "14px", color: "success.main" }} />
          )}
          {showError && (
            <ErrorIcon sx={{ fontSize: "14px", color: "error.main" }} />
          )}
          {!showError && helperText && (
            <Info sx={{ fontSize: "14px", color: "info.main" }} />
          )}
          <FormHelperText
            error={showError}
            sx={{
              margin: 0,
              color: showSuccess && !showError ? "success.main" : undefined,
            }}
          >
            {getHelperText()}
          </FormHelperText>
        </HelperTextContainer>
      )}
    </Box>
  );
};

export default FormInput;
