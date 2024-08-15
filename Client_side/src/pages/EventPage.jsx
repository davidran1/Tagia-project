import { Container } from "@mui/material";

import EventDetails from "../components/EventDetails";

function EventPage() {
  return (
    <>
      <Container sx={{ py: 8 }}>
        <EventDetails />
      </Container>
    </>
  );
}

export default EventPage;
