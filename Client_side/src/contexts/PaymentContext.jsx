import React, { createContext, useContext, useState } from "react";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);

  return (
    <PaymentContext.Provider
      value={{ event, setEvent, ticketCount, setTicketCount }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);