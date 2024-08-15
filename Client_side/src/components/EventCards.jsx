import { Container, Grid } from "@mui/material";
import { styles } from "../styles";
import EventCard from "./EventCard";
import PropTypes from "prop-types";

EventCards.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.arrayOf(PropTypes.number).isRequired,
      date: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      Cost: PropTypes.number.isRequired,
      emptyTickets: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      image: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      __v: PropTypes.number.isRequired,
      city: PropTypes.string.isRequired,
    })
  ).isRequired,
};

function EventCards({ events }) {
  return (
    <>
      <Container sx={styles.cardGrid} maxWidth={false}>
        <Grid container spacing={4} p={2} justifyContent="center">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default EventCards;
