import { Box, Button, Typography } from "@mui/material";
import { useAllUsers } from "../../hooks/useAllUsers";
import UserList from "./UserList";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { resultsPerPageAdmin } from "../../config";

function AdminEditUsers() {
  const { users, updateUser, page, movePage, results, blockUser } =
    useAllUsers();

  return (
    <Box>
      {results !== 0 ? (
        <UserList
          users={users}
          onSave={(editedUser) => {
            updateUser(editedUser);
          }}
          onBlock={(id) => {
            blockUser(id);
          }}
        />
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography>אין משתתפים להציג</Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        {page > 1 ? (
          <Button variant="contained" onClick={() => movePage(-1)}>
            <ArrowBackIosIcon />
          </Button>
        ) : null}
        {results === resultsPerPageAdmin ? (
          <Button variant="contained" onClick={() => movePage(1)}>
            <ArrowForwardIosIcon />
          </Button>
        ) : null}
      </Box>
    </Box>
  );
}

export default AdminEditUsers;
