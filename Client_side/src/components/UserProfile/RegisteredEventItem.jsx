import PropTypes from "prop-types";
import { ListItem, Typography, Chip, Box } from "@mui/material";
import { formatDate, formatTime } from "../../helperFunctions";

function RegisteredEventItem({ event }) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: "grey.300",
        borderRadius: 3,
        marginBottom: 2,
      }}
    >
      <ListItem alignItems="flex-start" sx={{ flexDirection: "row-reverse" }}>
        <Box sx={{ textAlign: "right", width: "100%" }}>
          <Typography variant="h6" gutterBottom>
            {event.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {formatDate(event.date)} בשעה {formatTime(event.date)}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {event.city}
          </Typography>
          <Chip
            label={event.Cost === 0 ? "כניסה חופשית" : `₪${event.Cost}`}
            color={event.Cost === 0 ? "default" : "secondary"}
            size="small"
            style={{ marginTop: "0.5rem", float: "right" }}
          />
        </Box>
      </ListItem>
    </Box>
  );
}

RegisteredEventItem.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    Cost: PropTypes.number.isRequired,
  }).isRequired,
};

export default RegisteredEventItem;
