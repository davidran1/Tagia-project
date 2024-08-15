import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Grid, Tabs, Tab } from '@mui/material';
// import EditEvent from '../components/EventOrganizer/EditEvent';
import EventList from '../components/EventOrganizer/EventList';
import ResetPassword from '../components/UserProfile/ResetPassword';
import Statistics from '../components/EventOrganizer/Statistics';

function EventOrganizerPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container sx={{ width: '100%', direction: 'rtl', display: 'flex', padding: '30px' }}>
      <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          orientation="vertical"
          variant="scrollable"
          aria-label="user details tabs"
          sx={{
            flexDirection: 'column',
            borderColor: 'divider',
            width: '200px',
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab label="ניהול אירועים" />
          <Tab label="סטטיסטיקות" />
          <Tab label="שינוי סיסמה" />
          
        </Tabs>

        <Box sx={{ width: tabValue === 0 ? '100%' : '50%' }}>
      
          {tabValue === 0 && (
            <>
              <Typography variant="h4" component="div">
              </Typography>
              <EventList />
            </>
          )}

          {tabValue === 1 && (
            <>
              <Typography variant="h4" component="div">
              </Typography>
              <Statistics />
            </>
          )}

          {tabValue === 2 && (
            <>
              <Typography variant="h4" component="div">
              </Typography>
              <ResetPassword />
            </>
          )}

        </Box>
      </Box>
    </Container>
  );
}

export default EventOrganizerPage;
