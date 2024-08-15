import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import MainPage from "./pages/MainPage";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import { useThemeContext } from "./hooks/useThemeContext";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import EventPage from "./pages/EventPage";
import SignUp from "./pages/SignUp";
import UserProfilePage from "./pages/UserProfilePage";
import PaymentPage from "./pages/PaymentPage";
import { UserContextProvider } from "./contexts/UserContext";
import MainLayout from "./layouts/MainLayout";
import RequireAuth from "./layouts/RequireAuth";
import ForgotPassword from "./pages/ForgotPassword";
import EditEventPage from "./pages/EditEventPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import EditPassword from "./pages/EditPassword";
import EventOrganizerPage from "./pages/EventOrganizerPage";
import UpdateEventPage from "./pages/UpdateEventPage";
import EventDetails from "./components/EventDetails";
import AdminPage from "./pages/AdminPage";
import { AllUsersProvider } from "./contexts/AllUsersContext";
import { CategoriesContextProvider } from "./contexts/CategoriesContext";

// Temporary Placeholder Component
function Placeholder({ text }) {
  return <div>{text}</div>;
}

function App() {
  return (
    <ThemeContextProvider>
      <CategoriesContextProvider>
        <UserContextProvider>
          <ThemedApp />
        </UserContextProvider>
      </CategoriesContextProvider>
    </ThemeContextProvider>
  );
}

function ThemedApp() {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<MainPage />} />
          <Route path="/event/:eventId" element={<EventPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/no-access" element={<Placeholder text="No Access" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/event-details/:eventId" element={<EventDetails />} />
          <Route path="/edit-password/:token" element={<EditPassword />} />

          {/* Protected Routes */}
          <Route
            element={<RequireAuth allowedRoles={["User", "EventOrganizer"]} />}
          >
            <Route path="/event/:eventId/payment" element={<PaymentPage />} />
            <Route
              path="/event/:eventId/payment/success"
              element={<PaymentSuccess />}
            />
          </Route>

          <Route
            element={<RequireAuth allowedRoles={["User", "EventOrganizer"]} />}
          >
            <Route path="/user-profile" element={<UserProfilePage />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
            <Route
              path="/admin-panel"
              element={
                <AllUsersProvider>
                  <AdminPage />
                </AllUsersProvider>
              }
            />
          </Route>

          <Route element={<RequireAuth allowedRoles={["EventOrganizer"]} />}>
            <Route
              path="/my-events"
              element={<Placeholder text="My Events" />}
            />
            <Route
              path="/create-event"
              element={<Placeholder text="Create Event" />}
            />
            <Route path="/events-organizer" element={<EventOrganizerPage />} />
            <Route
              path="/update-event/:eventId"
              element={<UpdateEventPage />}
            />
            <Route path="/edit-event" element={<EditEventPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Placeholder text="Bad route" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
