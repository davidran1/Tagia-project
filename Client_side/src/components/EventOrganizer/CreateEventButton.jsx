import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardActions, Button } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

function CreateEventButton({ label }) {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate('/edit-event');
  };

  return (
    <CardActions sx={{ justifyContent: "center", width: "30%" }}>
      <Button 
        variant="contained" 
        color="primary" 
        size="large" 
        fullWidth 
        onClick={handleCreateEvent} 
        sx={{ m: 2 }}
      >
        <AddOutlinedIcon fontSize="small" />
        {label}
      </Button>
    </CardActions>
  );
}

export default CreateEventButton;