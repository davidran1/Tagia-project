import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { styles } from "../styles";
import DynamicTruncate from "./DynamicTruncate";
import PropTypes from "prop-types";
import { formatDate, formatTime } from "../helperFunctions";
import { Link } from "react-router-dom";

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    location: PropTypes.arrayOf(PropTypes.number).isRequired,
    duration: PropTypes.number,
    distance: PropTypes.number,
    Cost: PropTypes.number,
    emptyTickets: PropTypes.number,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    __v: PropTypes.number,
    city: PropTypes.string.isRequired,
  }).isRequired,
};

function EventCard({ event }) {
  return (
    <>
      <Grid item key={event._id.$oid} xs={12} sm={6} md={4}>
        <Card sx={{ ...styles.card, display: "flex", flexDirection: "column" }}>
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to={`/event/${event._id}`}
          >
            <CardMedia
              sx={styles.cardMedia}
              image={event.image}
              title={event.name}
            />
            <CardContent sx={{ ...styles.cardContent, flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="div">
                {event.name}
              </Typography>
              <DynamicTruncate text={event.description} lines={2} />
              <Typography variant="body2" color="secondary.text">
                {formatDate(event.date)} בשעה {formatTime(event.date)}
              </Typography>
              {event.distance && (
                <>
                  <Typography variant="body2" color="secondary.text">
                    {parseInt(event.distance)} ק&quot;מ ממך
                  </Typography>
                </>
              )}
            </CardContent>
          </Link>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 2, height: "5rem" }}
          >
            <Chip
              label={event.city}
              color="secondary"
              sx={{
                borderRadius: 1,
                height: "100%",
                backgroundColor: "secondary.main",
                width: "auto",
              }}
            />
            <Chip
              label={event.Cost === 0 ? "כניסה חופשית" : `₪${event.Cost}`}
              sx={{
                borderRadius: 1,
                height: "100%",
                width: "auto",
              }}
            />
          </Grid>
        </Card>
      </Grid>
    </>
  );
}

export default EventCard;
