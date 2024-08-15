import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import Cookies from "js-cookie";

function SearchUsers() {
  const [searchParams, setSearchParams] = useState({
    name: "",
    email: "",
    major: "",
    year: "",
    role: "",
    blocked: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value.trim(),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const query = new URLSearchParams(
      Object.entries(searchParams).reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = value;
        }
        return acc;
      }, {})
    ).toString();

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/users/SearchSpecificUsers?${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.data.user);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      setUsers([]);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ margin: 2, direction: "rtl" }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {Object.keys(searchParams).map((param) => (
            <Grid item xs={12} sm={6} key={param}>
              <TextField
                fullWidth
                label={param}
                variant="outlined"
                name={param}
                value={searchParams[param]}
                onChange={handleInputChange}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Search
            </Button>
          </Grid>
        </Grid>
      </form>
      {loading ? (
        <Typography>
          <CircularProgress />
        </Typography>
      ) : users.length > 0 ? (
        users.map((user) => (
          <Card key={user._id} sx={{ marginTop: 2 }}>
            <CardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography>{user.email}</Typography>
              <Typography> {user.major}</Typography>
              <Typography>שנת לימוד: {user.year}</Typography>
              <Typography>סוג משתמש: {user.role}</Typography>
              <Typography>חסום: {user.blocked ? "כן" : "לא"}</Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>לא נמצאו משתמשים</Typography>
      )}
    </Box>
  );
}

export default SearchUsers;
