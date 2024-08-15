import React, { Fragment, useState  } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography"; 
import PaymentPayPalForm from './PaymentPayPalForm.jsx'


export default function PaymentFormDialog({event, userId}) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Check if the user is the event organizer
  const isOrganizer = userId === event.Organizer;
  
  return (
    <div style={{ padding: "1rem 1rem 0px" }}>
      <Fragment>
      {isOrganizer && (
          <Typography
          variant="body2"
          color="error"
          style={{ marginBottom: '1rem', direction: 'rtl', textAlign: 'right' }}
        >
          בעל/מארגן האירוע לא יכול לקנות כרטיס לאירוע שהוא ייצר.
        </Typography>
        )}
        <Button variant="contained" color="primary" onClick={handleClickOpen} disabled={isOrganizer}>
          המשך לתשלום
        </Button>
        <PaymentPayPalForm
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              handleClose();
            },
            style:{width: '600px', maxWidth: '90%' , backgroundColor: "#d3d3d3"}
          }}
          userId= {userId}
        >
        </PaymentPayPalForm>
      </Fragment>
    </div>
  );
}