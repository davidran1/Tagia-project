import PropTypes from "prop-types";
import { CardActions, Button } from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

function SaveButton({ handleSave, label }) {
  return (
    <CardActions sx={{ justifyContent: "center", width: "50%" }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        onClick={handleSave}
        sx={{ m: 2 }}
      >
        <SaveOutlinedIcon fontSize="small" />
        {label}
      </Button>
    </CardActions>
  );
}

SaveButton.propTypes = {
  handleSave: PropTypes.func,
  label: PropTypes.string.isRequired,
};

export default SaveButton;
