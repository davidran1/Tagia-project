import EventCards from "../components/EventCards";
import EventsPagination from "../components/EventsPagination";
import { useQuery } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CategoryFilter from "../components/SortFilter";
import { useCategories } from "../hooks/useCategories";
import { filters } from "../config";

const fetchEvents = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data.data);
    return data.data;
  } catch (error) {
    console.error("Fetching events failed:", error);
    return Promise.reject(error);
  }
};

function MainPage() {
  const { categories, isLoading: categoriesLoading } = useCategories();

  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  useEffect(() => {
    if (pathname === "/" && !search) {
      navigate(
        `/?sort=${filters.at(-1).value}&category=${categories[0].value}`,
        {
          replace: true,
        }
      );
    }
  }, [pathname, search, navigate, categories]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") || filters.at(-1).value;
  const page = searchParams.get("page") || 1;
  const order = searchParams.get("order") || "down";
  const category = searchParams.get("category") || categories[0].value;

  let url;
  const sortBy = sort || "Cost";
  if (sortBy === "location") {
    url = `http://localhost:3000/api/v1/events/?loc=${location.latitude},${location.longitude}&page=${page}`;
  } else {
    url = `http://localhost:3000/api/v1/events/?sort=${
      order === "up" ? "-" : ``
    }${sortBy}&page=${page}`;
  }
  if (category !== "הכל") url += `&category=${category}`;
  url += `&order=${order}`;

  const { data: events, status } = useQuery({
    queryKey: ["events", sortBy, page, order, category],
    queryFn: () => fetchEvents(url),
    onError: (error) => {
      console.error("Error fetching events:", error);
    },
  });

  if (categoriesLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <CategoryFilter filters={filters} />
      </Box>
      {status === "pending" ? (
        <Box p={4} sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : null}
      {status === "success" ? (
        <>
          <Box
            sx={{
              margin: {
                xs: "0 1rem",
                sm: "0 2rem",
                md: "0 4rem",
                lg: "0 6rem",
                xl: "0 9rem",
              },
            }}
          >
            {events.total === 0 ? (
              <p style={{ textAlign: "center" }}>לא נמצאו אירועים</p>
            ) : (
              <EventCards events={events.events} />
            )}
          </Box>
          {events.total > 0 && (
            <EventsPagination pages={Math.ceil(events.total / 6)} />
          )}
        </>
      ) : null}

      {status === "error" ? <p>Error fetching events</p> : null}
    </>
  );
}

export default MainPage;
