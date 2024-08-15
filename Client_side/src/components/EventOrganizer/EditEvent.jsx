import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Grid, Box } from '@mui/material';

const EditEvent = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    location: '',
    cost: 0,
    image: '',
    description: '',
    city: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/event/${eventId}`);
        const data = await response.json();
        setEventData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevEventData) => ({
      ...prevEventData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/event/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
      history.push('/event-manager');
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Container>
      <Typography variant="h4">Edit Event</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="name"
              label="Event Name"
              name="name"
              value={eventData.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="date"
              label="Event Date"
              name="date"
              type="datetime-local"
              value={eventData.date}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="location"
              label="Event Location"
              name="location"
              value={eventData.location}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="cost"
              label="Event Cost"
              name="cost"
              type="number"
              value={eventData.cost}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="image"
              label="Event Image URL"
              name="image"
              value={eventData.image}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="description"
              label="Event Description"
              name="description"
              multiline
              rows={4}
              value={eventData.description}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="city"
              label="Event City"
              name="city"
              value={eventData.city}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default EditEvent;
