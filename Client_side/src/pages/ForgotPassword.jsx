import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [responseMessage, setResponseMessage] = useState(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("כתובת האימייל אינה תקינה.")
      .required("שדה אימייל הוא שדה חובה."),
  });

  const handleSubmit = (values) => {
    console.log(values);
    fetch("http://localhost:3000/api/v1/users/forgotPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setResponseMessage(
            "אנא בדוק את תיבת הדואר האלקטרוני שלך לקבלת הוראות נוספות."
          );
        } else {
          setResponseMessage(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setResponseMessage("An error occurred during password reset.");
      });
  };

  return (
    <>
      <Container component="main" sx={{ width: "30rem" }}>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main", color: "primary.text" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            שכחתי סיסמה
          </Typography>
          <Formik
            initialValues={{
              email: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form noValidate>
                <Field
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="אימייל"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  color="secondary"
                  sx={{ direction: "rtl", textAlign: "right" }}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                {responseMessage && (
                  <Typography color="red">{responseMessage}</Typography>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  שליחת קישור התחברות
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link
                      to="/login"
                      style={{
                        textDecoration: "none",
                        color: "secondary.main",
                      }}
                    >
                      <Typography variant="body2">חזור להתחברות</Typography>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      to="/signup"
                      style={{
                        textDecoration: "none",
                        color: "secondary.main",
                      }}
                    >
                      <Typography variant="body2">{"צור משתמש חדש"}</Typography>
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </>
  );
}
