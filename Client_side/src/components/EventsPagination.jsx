import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import PropTypes from "prop-types";

function EventsPagination({ pages }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;

  const handleChange = (event, value) => {
    searchParams.set("page", value);
    navigate({ search: searchParams.toString() });
  };

  return (
    <>
      <Pagination
        count={pages}
        page={parseInt(page, 10)}
        sx={{ display: "flex", justifyContent: "center" }}
        size="large"
        color="secondary"
        onChange={handleChange}
      />
    </>
  );
}

export default EventsPagination;

EventsPagination.propTypes = {
  pages: PropTypes.number.isRequired,
};
