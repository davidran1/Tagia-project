import { Typography, List, Box } from "@mui/material";
import PropTypes from "prop-types";
import RegisteredEventItem from "./RegisteredEventItem";

function RegisteredEvents({ events, innerTabValue }) {
  console.log(innerTabValue);
  return (
    <Box sx={{ padding: 2 }}>
      <List>
        {events.length === 0 ? (
          innerTabValue === 0 ? (
            <Typography variant="h6" component="div" gutterBottom>
             בקרוב...
          </Typography>
          ): (
            <Typography variant="h6" component="div" gutterBottom>
            אין אירועים
          </Typography>
          )
          
        ) : (
          events.map((event) => (
            <RegisteredEventItem key={event._id} event={event} />
          ))
        )}
      </List>
    </Box>
  );
}

RegisteredEvents.propTypes = {
  events: PropTypes.array.isRequired,
};

export default RegisteredEvents;
