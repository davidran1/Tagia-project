import { CardActions, Button } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PropTypes from "prop-types";

CancelButton.propTypes = {
  handleDiscardChanges: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

function CancelButton({ handleDiscardChanges, label }) {
  return (
    <CardActions sx={{ justifyContent: "center", width: "50%" }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        onClick={handleDiscardChanges}
        sx={{ m: 2 }}
      >
        <CloseOutlinedIcon fontSize="small" />
        {label}
      </Button>
    </CardActions>
  );
}

export default CancelButton;
