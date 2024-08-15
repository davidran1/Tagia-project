import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Container } from '@mui/material';
import axios from 'axios';

const EventAttendees = ({ eventId }) => {
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    // Fetch the attendees of the specific event
    axios.get(`/api/events/${eventId}/attendees`)
      .then(response => setAttendees(response.data))
      .catch(error => console.error('Error fetching attendees:', error));
  }, [eventId]);

  return (
    <Container>
      <List>
        {attendees.map(attendee => (
          <ListItem key={attendee._id}>
            <ListItemText
              primary={attendee.name}
              secondary={attendee.email}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default EventAttendees;
