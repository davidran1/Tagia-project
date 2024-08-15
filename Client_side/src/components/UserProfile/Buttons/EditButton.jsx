import PropTypes from "prop-types";
import { CardActions, Button } from "@mui/material";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

function EditButton({ setEditMode, label }) {
  return (
    <CardActions sx={{ justifyContent: "center", width: "50%" }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        onClick={() => setEditMode(true)}
        sx={{ m: 2 }}
      >
        <ModeEditOutlineOutlinedIcon fontSize="small" />
        {label}
      </Button>
    </CardActions>
  );
}

EditButton.propTypes = {
  setEditMode: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default EditButton;
