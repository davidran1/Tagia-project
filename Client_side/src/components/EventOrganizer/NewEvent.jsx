import React, { useState } from 'react';
import { TextField, Button, Container, Box } from '@mui/material';

const NewEvent = ({ onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    cost: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform save operation
    onSave(formData);
    setFormData({ name: '', date: '', location: '', cost: '' });
  };

  return (
    <Container>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          required
          fullWidth
          id="name"
          label="Event Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          required
          fullWidth
          id="date"
          label="Event Date"
          name="date"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          value={formData.date}
          onChange={handleInputChange}
        />
        <TextField
          required
          fullWidth
          id="location"
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />
        <TextField
          required
          fullWidth
          id="cost"
          label="Cost"
          name="cost"
          value={formData.cost}
          onChange={handleInputChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Create Event
        </Button>
      </Box>
    </Container>
  );
};

export default NewEvent;
