import { useState, useEffect } from "react";
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

const EditEventPage = () => {
  const theme = useTheme(); // Access the current theme
  const [israelCities, setIsraelCities] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories

  //  Set all fields to be empty
  const [eventDetails, setEventDetails] = useState({
    name: "",
    description: "",
    date: new Date(), 
    duration: 0,
    Cost: 0,
    emptyTickets: "",
    location: [],
    city: "",
    category: "",
    image: "",
  });

  //When client click on cancel all the fields will be empty
  const handleClear = () => {
    setEventDetails({
      name: "",
      description: "",
      date: new Date(),
      duration: 0,
      Cost: 0,
      emptyTickets: "",
      location: [],
      city: "",
      category: "",
      image: "",
    });
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba&limit=2000');
        const data = await response.json();
        const cities = data.result.records.map(record => record['שם_ישוב']);
        const uniqueCities = [...new Set(cities)].sort(); // Remove duplicates and sort
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
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEventDetails({
      ...eventDetails,
      [name]: name === 'Cost' || name === 'emptyTickets' || name === 'duration'
        ? Math.max(0, parseInt(value, 10))
        : name === 'location'
        ? value.split(',').map(x => Number(x))
        : name === 'city'
        ? value || ""
        : value,
    });
  };

  //Post method to insert the new Event to the server
  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/events/creat_events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
        body: JSON.stringify(eventDetails),
      });

      if (response.status === 201) {
        alert("האירוע נשמר בהצלחה!");
      } else {
        const errorData = await response.json();
        alert("שגיאה בשמירת האירוע: " + (errorData.message || response.statusText));
      }
    } catch (error) {
      console.error("Error saving event:", error);
      alert("שגיאה בשמירת האירוע: " + error.message);
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
            הוספת אירוע
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
                <TextField  // Event duration
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
                  value={eventDetails.location.join(',')}
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
                  options={categories}
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
                  sx={{ width: "48%" }}
                  onClick={handleSave}
                >
                  צור אירוע חדש
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: "48%" }}
                  onClick={handleClear}
                >
                  נקה הכל
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default EditEventPage;
