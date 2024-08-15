import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { styles } from "../../styles";
import Cookies from "js-cookie";

const SignUpEventOrganizer = () => {
  const [msg, setMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("שדה שם מלא הוא שדה חובה."),
    email: Yup.string()
      .email("כתובת האימייל אינה תקינה.")
      .required("שדה אימייל הוא שדה חובה."),
    password: Yup.string()
      .min(8, "הסיסמה חייבת להכיל לפחות 8 תווים.")
      .required("שדה סיסמה הוא שדה חובה."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "הסיסמאות אינן תואמות.")
      .required("שדה אישור סיסמה הוא שדה חובה."),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    fetch("http://localhost:3000/api/v1/users/signup-EventOrganizer", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },

      body: JSON.stringify(values),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw err;
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          console.log("Sign-up successful:", data);
          setMsg("מנהל אירוע נוצר בהצלחה ");
        } else {
          setErrorMessage(data.message || "An error occurred during sign-up.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage(error.message || "An error occurred during sign-up.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Container component="main" sx={{ width: "30rem", direction: "rtl" }}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          צור מנהל אירוע
        </Typography>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    id="name"
                    label="שם מלא"
                    name="name"
                    autoComplete="name"
                    color="secondary"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    variant="standard"
                    sx={styles.inputField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    id="email"
                    label="אימייל"
                    name="email"
                    autoComplete="email"
                    color="secondary"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    variant="standard"
                    sx={styles.inputField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    name="password"
                    label="סיסמה"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="new-password"
                    color="secondary"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    sx={styles.inputField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    name="confirmPassword"
                    label="אישור סיסמה"
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    autoComplete="new-password"
                    color="secondary"
                    error={
                      touched.confirmPassword && Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    sx={styles.inputField}
                  />
                </Grid>
                {errorMessage && (
                  <Grid item xs={12}>
                    <Typography color="error" sx={{ mt: 2 }}>
                      {errorMessage}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    צור מנהל אירוע
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        <Typography>{msg}</Typography>
      </Box>
    </Container>
  );
};

export default SignUpEventOrganizer;
