import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  LinearProgress,
  InputAdornment,
  IconButton,
  ButtonBase,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { passwordStrengthChecker } from "../helperFunctions";
import PasswordGeneratorPopover from "../components/signup/PasswordGeneratorPopover";
import { styles } from "../styles";
import { majors } from "../config";
import { years } from "../config";

const SignUp = () => {
  const navigate = useNavigate();

  const [passwordStrength, setPasswordStrength] = useState(0);
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
    major: Yup.string().required("שדה מגמה הוא שדה חובה."),
    year: Yup.number().required("שדה שנה הוא שדה חובה."),
    allowExtraEmails: Yup.boolean(),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setErrorMessage(""); // Clear any previous error messages
    fetch("http://localhost:3000/api/v1/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
          navigate("/login");
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

  const getPasswordStrengthColor = (password) => {
    if (!password) {
      return "grey";
    }
    const strength = passwordStrengthChecker(password);
    switch (strength) {
      case 0:
        return "red";
      case 1:
        return "orange";
      case 2:
        return "yellow";
      case 3:
        return "lightgreen";
      case 4:
        return "green";
      default:
        return "grey";
    }
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
        <Avatar sx={{ m: 1, bgcolor: "primary.main", color: "primary.text" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          הרשמה
        </Typography>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            major: "",
            year: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form noValidate onChange={() => setErrorMessage("")}>
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
                    value={values.password}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    onChange={(e) => {
                      setFieldValue("password", e.target.value);
                      setPasswordStrength(
                        passwordStrengthChecker(e.target.value)
                      );
                    }}
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
                          <PasswordGeneratorPopover
                            onPasswordGenerated={(newPassword) => {
                              setFieldValue("password", newPassword);
                              setPasswordStrength(
                                passwordStrengthChecker(newPassword)
                              );
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    sx={styles.inputField}
                  />
                </Grid>
                {values.password && (
                  <Grid item xs={12}>
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress
                        variant="determinate"
                        value={(passwordStrength + 1) * 20}
                        sx={{
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: getPasswordStrengthColor(
                              values.password
                            ),
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                )}
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

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required color="secondary">
                    <InputLabel id="major-label">מגמה</InputLabel>
                    <Field
                      as={Select}
                      labelId="major-label"
                      id="major"
                      name="major"
                      label="מגמה"
                      error={touched.major && Boolean(errors.major)}
                      defaultValue=""
                    >
                      {majors.map((major) => (
                        <MenuItem key={major} value={major}>
                          {major}
                        </MenuItem>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="major"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required color="secondary">
                    <InputLabel id="year-label">שנה</InputLabel>
                    <Field
                      as={Select}
                      labelId="year-label"
                      id="year"
                      name="year"
                      label="שנה"
                      error={touched.year && Boolean(errors.year)}
                      defaultValue=""
                    >
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="year"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              {errorMessage && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {errorMessage}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                הרשמה
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <ButtonBase component={RouterLink} to="/login">
                    <Typography color="secondary">
                      כבר יש לך חשבון? התחבר
                    </Typography>
                  </ButtonBase>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default SignUp;
