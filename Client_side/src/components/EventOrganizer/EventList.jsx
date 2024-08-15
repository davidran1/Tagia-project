import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";  
import { Grid, Typography, Tab, Tabs, Box } from '@mui/material';
import EventsTable from './EventsTable';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Effect to fetch events when the component mounts or when the managerId changes
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/events/events-organizer', {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,  // Attach JWT for authorization
          },
          credentials: "include",
        });
        const {data} = await response.json();
        setEvents(data.events);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle tab change
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Render loading state
  if (loading) return <Typography>Loading...</Typography>;
  // Render error state
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        {/* Tabs for event types */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleChangeTab} aria-label="tabs">
            <Tab label="אירועים עתידיים" />
            <Tab label="אירועים ישנים" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
            <EventsTable events={events} eventType={"upcoming events"}/>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
            <EventsTable events={events} eventType={"old events"}/>
        </TabPanel>
      </Grid>
    </Grid>
  );

};

// TabPanel component to display content for each tab
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}  // Hide content if the tab is not selected
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
};
export default EventList;
