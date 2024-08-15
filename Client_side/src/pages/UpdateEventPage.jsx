import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Container,
  Grid,
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  InputAdornment,
  Autocomplete,
  useTheme,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Cookies from "js-cookie";

const UpdateEventPage = () => {
  const theme = useTheme(); // Access the current theme
  const navigate = useNavigate(); //To redirect after save
  const { eventId } = useParams(); // Get the event ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [israelCities, setIsraelCities] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [eventDetails, setEventDetails] = useState({
    name: "",
    description: "",
    date: new Date(),
    duration: "",
    Cost: "",
    emptyTickets: "",
    location: [],
    city: "",
    category: "",
    image: "",
  });

  //Get request to put all the event details directly when you want to edit the event by the original details
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba&limit=2000');
        const data = await response.json();
        const cities = data.result.records.map(record => record['שם_ישוב']);
        const uniqueCities = [...new Set(cities)].sort();
        setIsraelCities(uniqueCities);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/events/getCategories');
        const data = await response.json();
        const categoryList = data.data.categories;
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCities();
    fetchCategories();

    axios
      .get(`http://localhost:3000/api/v1/events/event/${eventId}`)
      .then((response) => {
        setEventDetails({
          name: response.data.name,
          description: response.data.description,
          date: new Date(response.data.date),
          duration: response.data.duration,
          Cost: response.data.Cost,
          emptyTickets: response.data.emptyTickets,
          location: response.data.location,
          city: response.data.city,
          category: response.data.category,
          image: response.data.image,
        });
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [eventId]);

//When client click cancel , the deatils will ruturn to be the original details of the event
  const handleClear = async () => {
    axios
      .get(`http://localhost:3000/api/v1/events/event/${eventId}`)
      .then((response) => {
        setEventDetails({
          name: response.data.name,
          description: response.data.description,
          date: new Date(response.data.date),
          duration: response.data.duration,
          Cost: response.data.Cost,
          emptyTickets: response.data.emptyTickets,
          location: response.data.location,
          city: response.data.city,
          category: response.data.category,
          image: response.data.image,
        });
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEventDetails({
      ...eventDetails,
      [name]:
        name === "Cost" || name === "emptyTickets" || name === "duration"
          ? Math.max(0, parseInt(value, 10))
          : name === "location"
          ? value.split(",").map((x) => Number(x))
          : value,
    });
  };
  const handleRedirectSave = () => {
    navigate("/events-organizer");
    
  };

  //Put request to update the server after made a changes in the event
  const handleSave = async () => {
    try {
      const updateUrl = `http://localhost:3000/api/v1/events/event/${eventId}`;

      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodeURIComponent(Cookies.get("jwt"))}`,
        },
        body: JSON.stringify(eventDetails),
      });

      if (response.ok) {
        alert("האירוע עודכן בהצלחה!");
        handleRedirectSave();
      } else {
        const errorData = await response.json();
        alert(
          "שגיאה בעדכון האירוע: " + (errorData.message || response.statusText)
        );
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("שגיאה בעדכון האירוע: " + error.message);
    }
  };

  //Delete requst to delete the event from the server
  const handleDelete = async () => {
    const confirmDelete = window.confirm("האם אתה בטוח שברצונך למחוק את האירוע?");
    if (confirmDelete) {
      try {
        const deleteUrl = `http://localhost:3000/api/v1/events/event/${eventId}`;

        const response = await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${encodeURIComponent(Cookies.get("jwt"))}`,
          },
        });

        if (response.ok) {
          alert("האירוע נמחק בהצלחה!");
          navigate("/events-organizer");
        } else {
          const errorData = await response.json();
          alert(
            "שגיאה במחיקת האירוע: " + (errorData.message || response.statusText)
          );
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("שגיאה במחיקת האירוע: " + error.message);
      }
    }
  };

  const getLabelColor = () => {
    return theme.palette.mode === "dark" ? "white" : "black";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container component="main" maxWidth="md" sx={{ mt: 4, direction: "rtl" }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h5" align="center" sx={{ mb: 4 }}>
            עריכת אירוע
          </Typography>
          <Box component="form" noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField //Event name
                  required
                  fullWidth
                  id="name"
                  label="שם האירוע"
                  name="name"
                  value={eventDetails.name}
                  onChange={handleChange}
                  InputLabelProps={{
                    style: { color: getLabelColor() },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField // Event description
                  required
                  fullWidth
                  multiline
                  rows={4}
                  id="description"
                  label="תיאור האירוע"
                  name="description"
                  value={eventDetails.description}
                  onChange={handleChange}
                  InputLabelProps={{
                    style: { color: getLabelColor() },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker //Event date
                  label="תאריך"
                  value={eventDetails.date}
                  onChange={(newValue) => {
                    setEventDetails({ ...eventDetails, date: newValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      InputLabelProps={{
                        style: { color: getLabelColor() },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField // Event duration
                  required
                  fullWidth
                  id="duration"
                  label="משך האירוע"
                  name="duration"
                  type="number"
                  value={Number(eventDetails.duration)}
                  placeholder="משך הזמן בדקות"
                  onChange={handleChange}
                  InputLabelProps={{
                    style: { color: getLabelColor() },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField //Event cost
                  required
                  fullWidth
                  id="Cost"
                  label="עלות כרטיס"
                  name="Cost"
                  value={Number(eventDetails.Cost)}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₪</InputAdornment>
                    ),
                  }}
                  onChange={handleChange}
                  InputLabelProps={{
                    style: { color: getLabelColor() },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField //Event empty tickets
                  required
                  fullWidth
                  id="emptyTickets"
                  label="כרטיסים פנויים"
                  name="emptyTickets"
                  value={eventDetails.emptyTickets}
                  type="number"
                  onChange={handleChange}
                  InputLabelProps={{
                    style: { color: getLabelColor() },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField // Event location by coordinates
                  required
                  fullWidth
                  id="location"
                  label="מיקום בקואורדינטות"
                  name="location"
                  value={eventDetails.location.join(",")}
                  onChange={handleChange}
                  InputLabelProps={{
                    style: { color: getLabelColor() },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  id="city"
                  options={israelCities}
                  value={eventDetails.city}
                  onChange={(event, newValue) => {
                    handleChange({ target: { name: "city", value: newValue } });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      fullWidth
                      label="עיר"
                      name="city"
                      InputLabelProps={{
                        style: { color: getLabelColor() },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete 
                  freeSolo
                  options={categories} // Use fetched categories
                  value={eventDetails.category}
                  onChange={(event, newValue) => {
                    handleChange({ target: { name: "category", value: newValue } });
                  }}
                  renderInput={(params) => (
                    <TextField //Event category
                      {...params}
                      required
                      fullWidth
                      label="קטגוריה"
                      name="category"
                      onChange={handleChange}
                      InputLabelProps={{
                        style: { color: getLabelColor() },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField //Event picture
                  required
                  fullWidth
                  id="image"
                  label="כתובת תמונה"
                  name="image"
                  value={eventDetails.image}
                  onChange={handleChange}
                  InputLabelProps={{
                    style: { color: getLabelColor() },
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: "30%" }}
                  onClick={handleSave}
                >
                  שמור שינויים
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: "30%" }}
                  onClick={handleClear}
                >
                אפס שינויים
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ width: "30%" }}
                  onClick={handleDelete}
                >
                  מחק אירוע
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default UpdateEventPage;
