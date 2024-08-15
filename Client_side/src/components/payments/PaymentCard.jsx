import { styles } from "../../styles";
import { formatDate, formatTime } from "../../helperFunctions";
import { Typography } from "@mui/material";
import { usePayment } from "../../contexts/PaymentContext";

function PaymentCard() {
  const { event } = usePayment();
  const {
    cardPaymentTitle,
    cardPaymentTextContainer,
    cardPaymentContainer,
    cardPaymentImage,
    cardPaymentTime,
  } = styles;

  return (
    <div style={cardPaymentContainer}>
      <div style={cardPaymentTextContainer}>
        <h3 style={cardPaymentTitle}>{event.name}</h3>
        <Typography
          color="secondary.text"
          style={cardPaymentTime}
        >{`${formatDate(event.date)} ${formatTime(event.date)}, ${
          event.city
        }`}</Typography>
      </div>
      <img src={event.image} alt="okay" style={cardPaymentImage} />
    </div>
  );
}

export default PaymentCard;