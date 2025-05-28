import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Button, InputAdornment, Divider, Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getAllJobs } from '../utils/api';

const SearchBox = ({ keyword, location, onKeywordChange, onLocationChange }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const jobs = await getAllJobs();
        const unique = [...new Set(jobs.map((j) => j.location).filter(Boolean))];
        setLocations(unique); // Reserved for autocomplete if needed
      } catch (err) {
        console.error('Failed to fetch locations:', err);
      }
    };
    fetchLocations();
  }, []);

  return (
    <Box data-testid="search-box" sx={{ width: '100%', maxWidth: 1000, mx: 'auto', mt: 4, ml: 33 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: '#fff'
        }}
      >
        <TextField
          inputProps={{ 'data-testid': 'keyword-input' }}
          variant="standard"
          placeholder="Job title or keyword"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#374151' }} />
              </InputAdornment>
            ),
            sx: { px: 2 }
          }}
          sx={{ flex: 1 }}
        />

        <Divider orientation="vertical" flexItem />

        <TextField
          inputProps={{ 'data-testid': 'location-input' }}
          variant="standard"
          placeholder="Location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon sx={{ color: '#374151' }} />
              </InputAdornment>
            ),
            sx: { px: 2 }
          }}
          sx={{ flex: 1 }}
        />

        <Button
          variant="contained"
          sx={{
            bgcolor: '#055F08',
            borderRadius: 0,
            height: '100%',
            px: 4,
            fontWeight: 'bold',
            fontSize: '0.95rem',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#034c06',
            }
          }}
        >
          Search
        </Button>
      </Box>

      <Typography variant="body2" sx={{ color: '#6B7280', mt: 2, ml: 1 }}>
        Popular: UI Designer, UX Researcher, Android, Admin
      </Typography>
    </Box>
  );
};

export default SearchBox;
