import { styles } from "../../styles";
import React from "react";
import { usePayment } from "../../contexts/PaymentContext";

function PaymentSum() {
  const { ticketCount, event } = usePayment();
  const { sumContainer, sumText, sumSpan } = styles;
  const totalCost = ticketCount * event.Cost;

  return (
    <div style={sumContainer}>
      <p style={sumText}>
        :סה"כ
        <span style={sumSpan}>₪{totalCost}</span>
      </p>
    </div>
  );
}

export default PaymentSum;