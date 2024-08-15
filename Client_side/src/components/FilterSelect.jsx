import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { styles } from "../styles";
import PropTypes from "prop-types";
import { useNavigate, useSearchParams } from "react-router-dom";

FilterSelect.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default function FilterSelect({ filters }) {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || filters[0].value;
  const [filter, setFilter] = useState(category);
  const navigate = useNavigate();

  useEffect(() => {
    setFilter(category);
  }, [category, searchParams]);

  const handleChange = (event) => {
    console.log(event);
    const newValue = event.target.value;
    setFilter(newValue);
    navigate(
      `/?category=${newValue}&sort=${
        searchParams.get("sort") || "Cost"
      }&order=${searchParams.get("order") || "down"}`
    );
  };

  return (
    <FormControl sx={styles.Header.formControl} size="small">
      <InputLabel id="select-label" sx={styles.Header.inputLabel}>
        סנן
      </InputLabel>
      <Select
        labelId="select-label"
        value={filter}
        onChange={handleChange}
        sx={styles.Header.select}
      >
        {filters.map((option) => (
          <MenuItem key={option.value} value={option.value} component="li">
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
