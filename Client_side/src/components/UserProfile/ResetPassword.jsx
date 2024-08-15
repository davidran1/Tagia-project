import { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  LinearProgress,
  InputAdornment,
  IconButton,
  Snackbar,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { passwordStrengthChecker } from "../../helperFunctions";
import PasswordGeneratorPopover from "../signup/PasswordGeneratorPopover";
import { styles } from "../../styles";
import Cookies from "js-cookie";

const ResetPassword = () => {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessageOpen, setSuccessMessageOpen] = useState(false); // State for managing the visibility of the success message

  const handleClickShowCurrentPassword = () =>
    setShowCurrentPassword(!showCurrentPassword);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required."),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long.")
      .required("New password is required."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match.")
      .required("Confirm new password is required."),
  });

  const handleSubmit = (values) => {
    fetch(`http://localhost:3000/api/v1/users/changeUserPassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      credentials: "include",
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setSuccessMessageOpen(true);
        setTimeout(() => setSuccessMessageOpen(false), 3000);
      })
      .catch((error) => {
        console.error("Error:", error.message);
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
    <Container component="main" maxWidth="xs" sx={{ direction: "rtl" }}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          שינוי סיסמה{" "}
        </Typography>
        <Formik
          initialValues={{
            currentPassword: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="currentPassword"
                    label="סיסמה נוכחית"
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    fullWidth
                    error={
                      touched.currentPassword && Boolean(errors.currentPassword)
                    }
                    helperText={
                      touched.currentPassword && errors.currentPassword
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle current password visibility"
                            onClick={handleClickShowCurrentPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showCurrentPassword ? (
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
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="password"
                    label="סיסמה חדשה "
                    type={showPassword ? "text" : "password"}
                    required
                    fullWidth
                    onChange={(e) => {
                      setFieldValue("password", e.target.value);
                      setPasswordStrength(
                        passwordStrengthChecker(e.target.value)
                      );
                    }}
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
                    name="confirmPassword"
                    label="אישור סיסמה חדשה"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    fullWidth
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
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    שנה סיסמה{" "}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        <Snackbar
          open={successMessageOpen}
          message="הסיסמה שונתה בהצלחה"
          autoHideDuration={3000}
          onClose={() => setSuccessMessageOpen(false)}
        />
      </Box>
    </Container>
  );
};

export default ResetPassword;
