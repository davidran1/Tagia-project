import React from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function PasswordInput({ field, form, label, endAdornment, ...props }) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <TextField
      {...field}
      {...props}
      type={showPassword ? "text" : "password"}
      label={label}
      variant="outlined"
      error={Boolean(form.errors[field.name] && form.touched[field.name])}
      helperText={form.touched[field.name] && form.errors[field.name]}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {endAdornment}
            <IconButton onClick={handleTogglePasswordVisibility}>
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

PasswordInput.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  endAdornment: PropTypes.node,
};

export default PasswordInput;
