import AdminEditUsers from "../components/admin/AdminEditUsers";
import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import SignUpEventOrganizer from "../components/admin/SignUpEventOrganizer";
import AdminStatistics from "../components/admin/AdminStatistics";
import EventsListByOrganizer from "../components/admin/EventsListByOrganizer";
import SearchUsers from "../components/admin/SearchUsers";

function AdminPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        centered
        aria-label="admin tabs"
        sx={{ my: "1rem", direction: "rtl" }}
      >
        <Tab label="ניהול משתמשים" />
        <Tab label="יצירת מנהל אירוע" />
        <Tab label="סטטיסטיקות" />
        <Tab label="ניהול אירועים" />
        <Tab label="חיפוש משתמשים" />
      </Tabs>
      {tabIndex === 0 && <AdminEditUsers />}
      {tabIndex === 1 && <SignUpEventOrganizer />}
      {tabIndex === 2 && <AdminStatistics />}
      {tabIndex === 3 && <EventsListByOrganizer />}
      {tabIndex === 4 && <SearchUsers />}
    </Box>
  );
}

export default AdminPage;
