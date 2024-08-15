import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
DynamicTruncate.propTypes = {
  text: PropTypes.string.isRequired,
  lines: PropTypes.number.isRequired,
};

function DynamicTruncate({ text, lines }) {
  return (
    <Typography
      noWrap
      sx={{
        display: "-webkit-box",
        overflow: "hidden",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: lines,
        textOverflow: "ellipsis",
        whiteSpace: "pre-wrap",
      }}
    >
      {text}
    </Typography>
  );
}

export default DynamicTruncate;
