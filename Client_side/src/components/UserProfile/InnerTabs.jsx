import { useState, useEffect } from "react";
import { Tabs, Tab, Box, CircularProgress } from "@mui/material";
import RegisteredEvents from "./RegisteredEvents";
import Cookies from "js-cookie";

const InnerTabs = () => {
  const [innerTabValue, setInnerTabValue] = useState(0);
  const [events, setEvents] = useState({
    favorites: [],
    upcoming: [],
    past: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/orders/getMyEvents`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEvents({
          favorites: [], //todo add update
          future: data.data.FutureEvents,
          past: data.data.PastEvents,
        });
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleInnerTabChange = (event, newValue) => {
    setInnerTabValue(newValue);
  };

  if (loading) {
    return (
      <Box p={4} sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Box sx={{ p: 2 }}>Error: {error}</Box>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={innerTabValue}
        onChange={handleInnerTabChange}
        aria-label="inner tabs"
      >
        <Tab label="אירועים אהובים" />
        <Tab label="אירועים עתידיים" />
        <Tab label="אירועים ישנים" />
      </Tabs>
      <RegisteredEvents
        events={
          innerTabValue === 0
            ? events.favorites
            : innerTabValue === 1
            ? events.future
            : events.past
        }
        innerTabValue={innerTabValue}
      />
    </Box>
  );
};

export default InnerTabs;
