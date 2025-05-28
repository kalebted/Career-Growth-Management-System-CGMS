// src/components/FiltersSidebar.jsx

import React from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  TextField,
  Button,
  Select,
  MenuItem
} from '@mui/material';

const FiltersSidebar = ({ filters = {}, setFilters, applyFilters, resetFilters }) => {
  const workTypes = ['full-time', 'part-time', 'contract', 'internship'];
  const workModes = ['remote', 'on-site', 'hybrid'];

  const handleCheckboxChange = (section, value) => {
    setFilters((prev) => ({
      ...prev,
      [section]: prev[section]?.includes(value)
        ? prev[section].filter((v) => v !== value)
        : [...(prev[section] || []), value]
    }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ width: 250, pr: 2 }} data-testid="filters-sidebar">
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Filters
      </Typography>

      {/* Work Type */}
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Work Type
      </Typography>
      <FormGroup>
        {workTypes.map((type) => (
          <FormControlLabel
            key={type}
            data-testid={`work-type-${type}`}
            control={
              <Checkbox
                checked={filters.work_type?.includes(type)}
                onChange={() => handleCheckboxChange('work_type', type)}
              />
            }
            label={type.charAt(0).toUpperCase() + type.slice(1)}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      {/* Work Mode */}
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Work Mode
      </Typography>
      <FormGroup>
        {workModes.map((mode) => (
          <FormControlLabel
            key={mode}
            data-testid={`work-mode-${mode}`}
            control={
              <Checkbox
                checked={filters.work_mode?.includes(mode)}
                onChange={() => handleCheckboxChange('work_mode', mode)}
              />
            }
            label={mode.charAt(0).toUpperCase() + mode.slice(1)}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      {/* Company Name */}
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Company Name
      </Typography>
      <TextField
        name="company_name"
        fullWidth
        size="small"
        placeholder="e.g. Google"
        value={filters.company_name || ''}
        onChange={handleTextChange}
      />

      <Divider sx={{ my: 2 }} />

      {/* Sorting */}
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Sort By
      </Typography>
      <Select
        name="sort"
        size="small"
        fullWidth
        value={filters.sort || ''}
        onChange={handleTextChange}
      >
        <MenuItem value="">Default</MenuItem>
        <MenuItem value="newest">Newest</MenuItem>
        <MenuItem value="oldest">Oldest</MenuItem>
      </Select>

      {/* Buttons */}
      <Button
        variant="contained"
        fullWidth
        onClick={applyFilters}
        data-testid="apply-filters-btn"
        sx={{
          bgcolor: '#055F08',
          mt: 3,
          fontWeight: 'bold',
          textTransform: 'none',
          '&:hover': { bgcolor: '#034c06' }
        }}
      >
        Apply Filters
      </Button>

      <Button
        variant="text"
        fullWidth
        onClick={resetFilters}
        data-testid="reset-filters-btn"
        sx={{ mt: 1, textTransform: 'none', color: '#6B7280' }}
      >
        Reset Filters
      </Button>
    </Box>
  );
};

export default FiltersSidebar;
