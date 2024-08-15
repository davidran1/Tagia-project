import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import BlockIcon from "@mui/icons-material/Block";
import UnblockIcon from "@mui/icons-material/LockOpen";
import PropTypes from "prop-types";
import { useState } from "react";
import { years, majors } from "../../config";

function UserList({ users, onSave, onBlock }) {
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setEditedUser({ ...user });
  };

  const handleCancel = () => {
    setEditUserId(null);
    setEditedUser({});
  };

  const handleChange = (e, field) => {
    setEditedUser({ ...editedUser, [field]: e.target.value });
  };

  const handleSave = () => {
    onSave(editedUser);
    setEditUserId(null);
  };

  const handleBlockToggle = (userId) => {
    const newBlockedState = !editedUser.blocked;
    setEditedUser({ ...editedUser, blocked: newBlockedState });
    onBlock(userId);
  };

  return (
    <TableContainer dir="rtl" sx={{ padding: 4 }} component={Paper}>
      <Typography variant="h6" sx={{ padding: 2 }}>
        פרטי משתמש
      </Typography>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">שם</TableCell>
            <TableCell align="right">מייל</TableCell>
            <TableCell align="right">מגמה</TableCell>
            <TableCell align="right">שנת לימודים</TableCell>
            <TableCell align="right">סוג משתמש</TableCell>
            <TableCell align="right">חסימה</TableCell>
            <TableCell align="right">עריכה</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right" component="th" scope="row">
                {editUserId === user._id ? (
                  <TextField
                    value={editedUser.name}
                    onChange={(e) => handleChange(e, "name")}
                    size="small"
                  />
                ) : (
                  user.name
                )}
              </TableCell>
              <TableCell align="right">
                {editUserId === user._id ? (
                  <TextField
                    value={editedUser.email}
                    onChange={(e) => handleChange(e, "email")}
                    size="small"
                  />
                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell align="right">
                {editUserId === user._id ? (
                  <FormControl fullWidth size="small">
                    <Select
                      value={editedUser.major}
                      onChange={(e) => handleChange(e, "major")}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      {majors.map((major) => (
                        <MenuItem key={major} value={major}>
                          {major}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  user.major
                )}
              </TableCell>
              <TableCell align="right">
                {editUserId === user._id ? (
                  <FormControl fullWidth size="small">
                    <Select
                      value={editedUser.year}
                      onChange={(e) => handleChange(e, "year")}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  user.year
                )}
              </TableCell>
              <TableCell align="right">{user.role}</TableCell>
              <TableCell align="right">
                {user.role !== "Admin" &&
                  (editUserId === user._id ? (
                    <IconButton onClick={() => handleBlockToggle(user._id)}>
                      {editedUser.blocked ? (
                        <UnblockIcon color="success" />
                      ) : (
                        <BlockIcon color="error" />
                      )}
                    </IconButton>
                  ) : (
                    <IconButton disabled>
                      {user.blocked ? <UnblockIcon /> : <BlockIcon />}
                    </IconButton>
                  ))}
              </TableCell>
              <TableCell align="right">
                {user.role !== "Admin" &&
                  (editUserId === user._id ? (
                    <>
                      <IconButton onClick={handleSave}>
                        <SaveIcon color="secondary" />
                      </IconButton>
                      <IconButton onClick={handleCancel}>
                        <CancelIcon color="secondary" />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton onClick={() => handleEdit(user)}>
                      <EditIcon />
                    </IconButton>
                  ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      major: PropTypes.string,
      year: PropTypes.number,
      role: PropTypes.string.isRequired,
      blocked: PropTypes.bool,
    })
  ).isRequired,
  onSave: PropTypes.func.isRequired,
  onBlock: PropTypes.func.isRequired,
};

export default UserList;
