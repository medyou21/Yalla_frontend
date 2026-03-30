import React from "react";
import { useNavigate } from "react-router-dom";

// MUI
import {
  Box,
  TextField,
  Button,
  MenuItem,
  InputAdornment
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ filters, setFilters, onSearch }) => {
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value || "" });
  };

  const handleSearch = () => {
    const queryParams = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => {
        return value != null && String(value).trim() !== "";
      })
    );

    const lowerCaseParams = {};
    for (const key in queryParams) {
      lowerCaseParams[key] = String(queryParams[key]).toLowerCase();
    }

    if (onSearch) {
      onSearch(lowerCaseParams);
    } else {
      const query = new URLSearchParams(lowerCaseParams).toString();
      navigate(query ? `/search?${query}` : "/search");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {/* DEPART */}
      <TextField
        name="departure"
        placeholder="Départ"
        value={filters.departure || ""}
        onChange={handleChange}
        size="small"
        sx={{ minWidth: 150 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon />
            </InputAdornment>
          )
        }}
      />

      {/* ARRIVEE */}
      <TextField
        name="arrival"
        placeholder="Destination"
        value={filters.arrival || ""}
        onChange={handleChange}
        size="small"
        sx={{ minWidth: 150 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon />
            </InputAdornment>
          )
        }}
      />

      {/* DATE */}
      <TextField
        type="date"
        name="date"
        value={filters.date || ""}
        onChange={handleChange}
        size="small"
        InputLabelProps={{ shrink: true }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CalendarTodayIcon />
            </InputAdornment>
          )
        }}
      />

      {/* PASSAGERS */}
      <TextField
        select
        name="passengers"
        value={filters.passengers || "1"}
        onChange={handleChange}
        size="small"
        sx={{ minWidth: 140 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          )
        }}
      >
        <MenuItem value="1">1 passager</MenuItem>
        <MenuItem value="2">2 passagers</MenuItem>
        <MenuItem value="3">3 passagers</MenuItem>
        <MenuItem value="4">4 passagers</MenuItem>
      </TextField>

      {/* BUTTON */}
      <Button
        variant="contained"
        onClick={handleSearch}
        startIcon={<SearchIcon />}
        sx={{
          backgroundColor: "#2e9e53",
          px: 3,
          height: 40,
          "&:hover": { backgroundColor: "#248244" }
        }}
      >
        {filters.departure || filters.arrival || filters.date
          ? "Rechercher"
          : "Tous les trajets"}
      </Button>
    </Box>
  );
};

export default SearchBar;