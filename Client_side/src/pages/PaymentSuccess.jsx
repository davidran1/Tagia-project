import { Container, Box, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Header from "../components/Header";
import { PaymentProvider, usePayment } from "../contexts/PaymentContext";
import { styles } from "../styles";

function PaymentContent() {
  const { eventId } = useParams();
  const { event, setEvent } = usePayment();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const { PaymentSuccessDiv } = styles;

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
  }, [eventId, setEvent]);

  const ContainerStyle = (theme) => ({
    py: 4,
    backgroundColor: theme.palette.mode === "dark" ? "grey.800" : "grey.100",
    boxShadow: 3,
    borderRadius: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    
  });

  if (loading) {
    return (
      <>
        <Header />
        <Container>
          <Box my={4}>
            <Typography variant="h5">Loading...</Typography>
          </Box>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container>
          <Box my={4}>
            <Typography variant="h5">{error}</Typography>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <div style={PaymentSuccessDiv}>
        <Container sx={ContainerStyle(theme)}>
        <h1>התשלום לאירוע {event.name} בוצע בהצלחה</h1>
        <Button href="http://localhost:5173/" variant="contained">חזרה לדף הבית</Button>
        </Container>
      </div>
    </>
  );
}

function PaymentPage() {
  return (
    <PaymentProvider>
      <PaymentContent />
    </PaymentProvider>
  );
}

export default PaymentPage;