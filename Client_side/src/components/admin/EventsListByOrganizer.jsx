import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function EventsListByOrganizer() {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/users/getAllUsers?page=${page}&role=EventOrganizer`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUsers(data.data.users);
          setTotalPages(data.results);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Typography variant="h6" sx={{ direction: "rtl", margin: 2 }}>
          רשימת מנהלי אירוע
        </Typography>
        <Table
          sx={{ minWidth: 650, direction: "rtl" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="right" sx={{ paddingRight: 1, paddingLeft: 0 }}>
                שם
              </TableCell>
              <TableCell align="left" sx={{ paddingRight: 0, paddingLeft: 1 }}>
                צפה באירועים
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  align="right"
                  component="th"
                  scope="row"
                  sx={{ paddingRight: 1, paddingLeft: 0 }}
                >
                  {user.name}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ paddingRight: 0, paddingLeft: 1 }}
                >
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/${user.name}`)}
                  >
                    צפה באירועי המנהל
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        {page > 1 && (
          <Button
            variant="contained"
            onClick={() => handlePageChange(page - 1)}
          >
            <ArrowBackIosIcon />
          </Button>
        )}
        {page < totalPages && (
          <Button
            variant="contained"
            onClick={() => handlePageChange(page + 1)}
          >
            <ArrowForwardIosIcon />
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default EventsListByOrganizer;
