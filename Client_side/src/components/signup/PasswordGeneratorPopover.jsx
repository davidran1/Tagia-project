import { useState } from "react";
import {
  IconButton,
  TextField,
  Popover,
  Button,
  Typography,
  Box,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import { generatePassword } from "../../helperFunctions";
import PropTypes from "prop-types";

const PasswordGeneratorPopover = ({ onPasswordGenerated }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
  };

  const handleInsertPassword = () => {
    onPasswordGenerated(generatedPassword);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "password-popover" : undefined;

  return (
    <div>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        sx={{ padding: 0 }}
      >
        <KeyIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box p={2} sx={{ minWidth: 200 }}>
          <Typography variant="h6" gutterBottom>
            Password Generator
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGeneratePassword}
            fullWidth
            sx={{ mb: 2 }}
          >
            Generate Password
          </Button>
          <TextField
            fullWidth
            variant="outlined"
            value={generatedPassword}
            InputProps={{
              readOnly: true,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleInsertPassword}
            fullWidth
            sx={{ mt: 2 }}
          >
            Insert Password
          </Button>
        </Box>
      </Popover>
    </div>
  );
};

export default PasswordGeneratorPopover;

PasswordGeneratorPopover.propTypes = {
  onPasswordGenerated: PropTypes.func.isRequired,
};
