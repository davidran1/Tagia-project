export const styles = {
  Header: {
    formControl: {
      m: 1,
      minWidth: 120,
    },
    inputLabel: {
      color: "primary.text",
      "&.Mui-focused": {
        color: "primary.text",
      },
    },
    select: {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "secondary.dark",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "secondary.dark",
      },
      "& .MuiSelect-select": {
        backgroundColor: "secondary.main",
        color: "common.white",
      },
    },
  },
  cardGrid: {
    padding: "20px 0",
    margin: "0 auto",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    direction: "rtl",
    justifyContent: "space-between",
    "&:hover": {
      cursor: "pointer",
    },
  },
  cardMedia: { paddingTop: "56.25%" },
  cardContent: { flexGrow: 1 },
  PaymentPageDiv: {
    height: "calc(100vh - 80px)",
    position: "absolute",
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cardPaymentContainer: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: "500px",
    width: "100%",
    minHeight: "150px",
    maxHeight: "150px",
    gap: "12px",
    float: "right",
  },
  cardPaymentTextContainer: {
    display: "flex",
    flexDirection: "column",
    width: "60%",
    direction: "rtl",
    justifyContent: "flex-start",
    gap: "6px",
  },
  cardPaymentTitle: {
    margin: 0,
    fontSize: "24px",
    fontFamily: "Rubik",
  },
  cardPaymentTime: {
    margin: 0,
    fontSize: "18px",
    fontFamily: "Rubik",
  },
  cardPaymentImage: {
    width: "40%",
    objectFit: "cover",
    height: "auto",
  },
  ticketsContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    display: "flex",
    width: "100%",
    padding: "0 1rem",
  },
  ticketsButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "16px",
  },
  ticketsPargaraph: {
    direction: "rtl",
    font: "Ruibk",
    fontSize: "26px",
  },
  sumContainer: {
    borderTop: "1px solid grey",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "flex-start",
    padding: "1rem 1rem 0",
    gap: "1rem",
  },
  sumText: {
    margin: "0",
    width: "fit-content",
    display: "flex",
    flexDirection: "row-reverse",
  },
  sumSpan: {
    minWidth: "64px",
    textAlign: "center",
  },
  PaymentFormCVVAndDate: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap",
  },
  PaymentFormDialogContentContainer: {
    alignItems: "flex-end",
    flexDirection: "column",
    display: "flex",
  },
  inputField: {
    direction: "rtl",
    textAlign: "right",
    "& .MuiInputLabel-root": {
      right: 30,
      left: "auto",
    },
    "& .MuiOutlinedInput-root": {
      "& input": {
        backgroundColor: "transparent !important",
      },
      "&.Mui-focused fieldset": {
        borderColor: "secondary.dark",
      },
      "&:hover fieldset": {
        borderColor: "secondary.dark",
      },
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 30px #121212 inset !important", // bg color of textfield
      WebkitTextFillColor: "#fff !important", //related to text field
    },
    "& input:hover, & input:active, & input:focus": {
      backgroundColor: "transparent !important",
    },
  },
  PaymentSuccessDiv: {
    direction: "rtl",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    minHeight: "80vh",
  },
};
