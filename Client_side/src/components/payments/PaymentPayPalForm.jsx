import React, { useState, useEffect} from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { DialogContent, DialogTitle, Dialog } from "@mui/material";
import { usePayment } from "../../contexts/PaymentContext";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Message({ content }) {
  return <p>{content}</p>;
}

const PaymentPayPalForm = ({ open, onClose, PaperProps, userId }) => {
  const { eventId } = useParams();
  const { ticketCount, event } = usePayment();
  const [message, setMessage] = useState("");
  const amountValue = (event.Cost * ticketCount).toFixed(2);
  const navigateTo = useNavigate();
  

  //Options for paypal service API
  const initialOptions = {
    "client-id":
      "ATekOTr_5NGjTGo1ogrGmOs2KmcVvXetpSJJXzvHaX5OGgKxezIxk0ZaR7pQ2amnTDYubXaxMMXx4Avg",
    currency: "ILS",
    intent: "capture",
  };

  const token = Cookies.get("jwt");
  /* Prints for tests:
    console.log("test");
    console.log(token);
    console.log(userId);
  */
  return (
    <Dialog open={open} onClose={onClose} PaperProps={PaperProps}>
      <DialogTitle style={{ direction: "rtl", color: "black" }}>
        חיוב ותשלום
      </DialogTitle>
      <DialogContent>
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons

          //Method to create order on the server side to validate it before approving the order to paypal API.
            createOrder={async () => {
              try {
                const response = await fetch(
                  `http://localhost:3000/api/v1/orders`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      cart: [
                        {
                          id: eventId,
                          quantity: ticketCount,
                          amount: {
                            value: amountValue,
                            currency_code: "ILS",
                          },
                          userId: userId, 
                        },
                      ],
                    }),
                  }
                );
                
                //Get the order data from server side and check for errors
                const orderData = await response.json();

                if (orderData.id) {
                  return orderData.id;
                } else {
                  const errorDetail = orderData?.details?.[0];
                  const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                    : JSON.stringify(orderData);

                  throw new Error(errorMessage);
                }
              } catch (error) {
                console.error(error);
                setMessage(`Could not initiate PayPal Checkout...${error}`);
              }
            }}

            //Approving the order on the server side with paypal API service.
            onApprove={async (data, actions) => {
              try {
                const response = await fetch(
                  `http://localhost:3000/api/v1/orders/${data.orderID}/capture`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                const orderData = await response.json();

                const errorDetail = orderData?.details?.[0];

                if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                  return actions.restart();
                } else if (errorDetail) {
                  throw new Error(
                    `${errorDetail.description} (${orderData.debug_id})`
                  );
                } else {
                  const transaction =
                    orderData.purchase_units[0].payments.captures[0];
                  setMessage(
                    `Transaction succeeded`
                  );
                  /* //Print the results for tests:
                    console.log(
                    "Capture result",
                    orderData,
                    JSON.stringify(orderData, null, 2)
                  );*/

                  //Calling the reserve method to send the number of tickets, user id and total amount and save it in the DB.
                  const reserveResponse = await fetch(
                    `http://localhost:3000/api/v1/events/event/${eventId}/reserve`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        ticketsAmount: ticketCount,
                        userID: userId,
                        totalPrice: amountValue,
                      }),
                    }
                  );
                  const reserveData = await reserveResponse.json();
                  console.log("Reservation response:", reserveData);
                  navigateTo(`/event/${eventId}/payment/success`); 
                }
              } catch (error) {
                console.error(error);
                setMessage(
                  `Sorry, your transaction could not be processed...${error}`
                );
              }
            }}
          />
        </PayPalScriptProvider>
        <Message content={message} />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPayPalForm;