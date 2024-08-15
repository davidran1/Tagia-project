import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

export default function EditPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Validate the token
    fetch(`http://localhost:3000/api/v1/users/isValidToken/${token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status !== "success") {
          navigate("/bad-route");
        }
      })
      .catch((error) => {
        console.error("Error validating token:", error);
        navigate("/bad-route");
      });
  }, [token, navigate]);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "הסיסמה חייבת להכיל לפחות 8 תווים.")
      .required("שדה סיסמה הוא שדה חובה."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "הסיסמאות אינן תואמות.")
      .required("שדה אישור סיסמה הוא שדה חובה."),
  });

  const handleSubmit = (values) => {
    console.log(values);
    fetch(`http://localhost:3000/api/v1/users/resetPassword/${token}`, {
      method: "PATCH",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          navigate("/login");
        }
        if (data.status !== "success") {
          // Redirect to bad route if the token is invalid
          console.error("Error changing password:");
        }
      })
      .catch((error) => {
        console.error("Error validating token:", error);
        navigate("/bad-route");
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          איפוס סיסמה
        </Typography>
        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
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
                name="password"
                label="סיסמה חדשה"
                type="password"
                id="password"
                autoComplete="current-password"
                color="secondary"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="אשר סיסמה חדשה"
                type="password"
                id="confirmPassword"
                color="secondary"
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                איפוס סיסמה
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
