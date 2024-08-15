import { Container } from "@mui/material";

import UserDetails from "../components/UserProfile/UserDetails";

function UserProfilePage() {
  return (
    <>
      <Container sx={{ py: 8 }}>
        <UserDetails />
      </Container>
    </>
  );
}

export default UserProfilePage;
