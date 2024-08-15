import { styles } from "../../styles";
import React from "react";
import { Button } from "@mui/material";
import { usePayment } from "../../contexts/PaymentContext";

function PaymentQuantity() {
  const { ticketCount, setTicketCount } = usePayment();
  const { ticketsContainer, ticketsButton, ticketsPargaraph } = styles;

  const incrementTickets = () => {
    setTicketCount(ticketCount + 1);
  };

  const decrementTickets = () => {
    if (ticketCount > 1) {
      setTicketCount(ticketCount - 1);
    }
  };

  return (
    <div style={ticketsContainer}>
      <div style={ticketsButton}>
        <Button variant="contained" onClick={decrementTickets}>
          -
        </Button>
        <span style={{ minWidth: "32px", textAlign: "center" }}>
          {ticketCount}
        </span>
        <Button variant="contained" onClick={incrementTickets}>
          +
        </Button>
      </div>
      <div>
        <p style={ticketsPargaraph}>נא לבחור כמות כרטיסים</p>
      </div>
    </div>
  );
}

export default PaymentQuantity;