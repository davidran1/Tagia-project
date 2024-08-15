import { useEffect, useState } from "react";
import { Tabs, Tab, Box, TextField } from "@mui/material";
import UserDataChart from "./UserDataChart";
import Cookies from "js-cookie";

function formatDate(date) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${month}.${day}.${year}`;
}

function AdminStatistics() {
  const [userData, setUserData] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  const [startDate, setStartDate] = useState(
    formatDate(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ); // Added
  const [endDate, setEndDate] = useState(formatDate(Date.now())); // Added
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/orders/getAllTicketsPerDay/${startDate}/${endDate}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setUserData(data.data.Dict);
        } else {
          throw new Error(data.message || "Failed to fetch ticket data");
        }
      } catch (error) {
        console.error("Error fetching ticket data:", error.message);
      }
    };

    const fetchSignUps = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/users/getSignUpsPerDay/${startDate}/${endDate}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setUserData(data.data.Dict);
        } else {
          throw new Error(data.message || "Failed to fetch signup data");
        }
      } catch (error) {
        console.error("Error fetching signup data:", error.message);
      }
    };

    if (tabIndex === 0) {
      fetchTickets();
    } else {
      fetchSignUps();
    }
  }, [tabIndex, startDate, endDate]); // Modified

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        label="Start Date"
        type="text"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        sx={{ margin: 1 }}
      />
      <TextField
        label="End Date"
        type="text"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        sx={{ margin: 1 }}
      />
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Ticket Sales" />
        <Tab label="Sign Ups" />
      </Tabs>
      <UserDataChart
        data={userData}
        chartTitle={
          tabIndex === 0 ? " כמות כרטיסים שנמכרו" : "כמות משתמשים שנרשמו"
        }
        datasetLabel={tabIndex === 0 ? "כרטיסים" : "משתמשים"}
      />
    </Box>
  );
}

export default AdminStatistics;
