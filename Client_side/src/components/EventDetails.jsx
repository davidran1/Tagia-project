import { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import {
  Container,
  Typography,
  Button,
  Box,
  CardMedia,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { formatDate, formatTime, formatDuration } from "../helperFunctions";

function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/events/event/${eventId}`)
      .then((response) => {
        setEvent(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [eventId]);

  const handleRedirectPayment = () => {
    navigate(`/event/${eventId}/payment`);
  };

  if (loading) {
    return (
      <Container>
        <Box p={4} sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box my={4}>
          <Typography variant="h5">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" fixed sx={{ py: 4 }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          boxShadow: 3,
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: { xs: "100%", md: "40%" }, height: "auto" }}
          image={event.image}
          alt={event.name}
        />
        <Box
          dir="rtl"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2,
            textAlign: "right",
            flex: 1,
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h3" gutterBottom>
              {event.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {event.description}
            </Typography>
            <Typography variant="h6" gutterBottom>
              מקומות פנויים: {event.emptyTickets}
            </Typography>
            <Typography variant="h6" gutterBottom>
              תאריך: {formatDate(event.date)}
            </Typography>
            <Typography variant="h6" gutterBottom>
              שעה: {formatTime(event.date)}
            </Typography>
            <Typography variant="h6" gutterBottom>
              מיקום: {event.city}
            </Typography>

            <Typography variant="h6" gutterBottom>
              משך האירוע: {formatDuration(event.duration).hours} שעות,{" "}
              {formatDuration(event.duration).minutes} דקות{" "}
            </Typography>
            <Typography variant="h6" gutterBottom>
              מחיר: ₪{event.Cost}
            </Typography>
          </CardContent>

          <CardActions sx={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleRedirectPayment}
            >
              לרכישת כרטיסים לחץ כאן
            </Button>
          </CardActions>
        </Box>
      </Card>
    </Container>
  );
}

export default EventDetails;
