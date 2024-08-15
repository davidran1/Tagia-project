import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Typography from "@mui/material/Typography";


import CreateEventButton from './CreateEventButton';
import { formatDate, formatTime } from '../../helperFunctions';

function EventsTable({ events, eventType }) {
  const navigate = useNavigate();

  // Filter and sort events based on the event type
  let filteredEvents = [];
  switch (eventType){
    case 'old events':
      filteredEvents = events.filter((event) => new Date(event.date) < new Date()).sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'upcoming events':
      filteredEvents = events.filter((event) => new Date(event.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    default:
      // Default case, show all events
      filteredEvents = events;
      break;
  }

  // Columns configuration for the DataGrid
  const columns = [
    { field: 'name', headerName: 'שם האירוע', width: 250, sortable: true, resizable: false, headerAlign: 'center', align: 'center' },
    { field: 'category', headerName: 'קטגוריה', width: 80, sortable: true, resizable: false, headerAlign: 'center', align: 'right' },
    { field: 'date', headerName: 'תאריך', width: 160, sortable: true, resizable: false, headerAlign: 'center', align: 'center',
      valueFormatter: (params) => params ? formatDate(params) : 'N/A' 
    },
    { field: 'time', headerName: 'שעה', width: 120, sortable: true, resizable: false, headerAlign: 'center', align: 'center',
      valueFormatter: (params) => params ? formatTime(params) : 'N/A' 
    },
    { field: 'city', headerName: 'עיר', width: 150, sortable: true, resizable: false, headerAlign: 'center', align: 'center' },
    // Optional participants button (commented out, can be enabled if needed)
    // {field: 'participants', headerName: '', width: 120, sortable: true, resizable: false, headerAlign: 'center', align: 'center',
    //   renderCell: (params) => (
    //     <Button variant="outlined" color="primary">
    //     משתתפים
    //     </Button>
    //   )},
  ];
  
  if (eventType == 'upcoming events') {
    columns.push(
      {field: 'edit', headerName: '', width: 100, sortable: false, resizable: false, headerAlign: 'center', align: 'center',
        renderCell: (params) => (
          <Button variant="outlined" color="primary" onClick={() => handleRedirectEdit(params.row.id)}>
            עריכה
          </Button>
        )},
    );
  };

  // Map events to rows for DataGrid
  const rows = filteredEvents.map((event) => ({
    id: event._id,
    name: event.name,
    category: event.category,
    date: event.date,
    time: event.date,
    city: event.city,
  }));

  // Handle the edit event button click
  const handleRedirectEdit = (eventId) => {
    navigate(`/update-event/${eventId}`);
  };

  return (
    <div>
      {/* Show the Create Event button only for 'upcoming events' */}
      {eventType === 'upcoming events' ? (
        <CreateEventButton label="יצירת אירוע חדש" />
      ) : (
        null
      )}

      <Box>
        {events.length>0?
          <div style={{ height: 460, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 25]}
              sortingOrder={['asc', 'desc']}
              localeText={{
                noRowsLabel: 'אין נתונים להצגה',
              }}
              hideFooter
              headerHeight={50}
              sx={{ border: 1, borderColor: 'grey.300', borderRadius: 3 }}
            />
          </div>
          :
          <Typography>No events found.</Typography>
        }
        
      </Box>
    </div>
  );
}

export default EventsTable;
