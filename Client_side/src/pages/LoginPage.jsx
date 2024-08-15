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
  ButtonBase,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useUserContext } from "../hooks/useUserContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { styles } from "../styles";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const navigate = useNavigate();
  const location = useLocation();

  const [responseMessage, setResponseMessage] = useState(null);
  const { setUserDetails } = useUserContext();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("כתובת האימייל אינה תקינה.")
      .required("שדה אימייל הוא שדה חובה."),
    password: Yup.string()
      .min(8, "הסיסמה חייבת להכיל לפחות 8 תווים.")
      .required("שדה סיסמה הוא שדה חובה."),
  });

  const handleSubmit = (values) => {
    fetch("http://localhost:3000/api/v1/users/signin", {
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
          const token = data.token;

          setUserDetails({ ...data.data.user, token });
          const from = location.state?.from?.pathname || "/";
          navigate(from, { replace: true });
        } else {
          setResponseMessage(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setResponseMessage("An error occurred during sign-in.");
      });
  };

  return (
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
          התחברות
        </Typography>
        <Formik
          initialValues={{
            email: "",
            password: "",
            remember: false,
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
                variant="standard"
                sx={styles.inputField}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                name="password"
                label="סיסמה"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                color="secondary"
                variant="standard"
                sx={styles.inputField}
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                התחברות
              </Button>
            </Form>
          )}
        </Formik>
        <Grid container>
          <Grid item xs>
            <ButtonBase component={Link} to="/forgot-password">
              <Typography color="secondary">? שכחת סיסמה</Typography>
            </ButtonBase>
          </Grid>
          <Grid item>
            <ButtonBase component={Link} to="/signup">
              <Typography color="secondary">{"צור משתמש"}</Typography>
            </ButtonBase>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
