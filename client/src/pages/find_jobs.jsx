// src/pages/FindJobs.jsx

import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Common/sidebar';
import AppBarComponent from '../components/Common/appbarcomp';
import FiltersSidebar from '../components/filtersidebar';
import JobSearchResults from '../components/jobsearchresults';
import SearchBox from '../components/searchbox';
import RecruiterAppBarComponent from '../components/common/recruiter_appbarcomp';
import RecruiterSidebar from '../components/common/recruiter_sidebar';

const FindJobs = () => {
  const location = useLocation();
  const [filters, setFilters] = useState({
    work_type: [],
    work_mode: [],
    company_name: '',
    sort: '',
    keyword: '',
    location: '',
  });

  // Handle prefilled keyword from category
  useEffect(() => {
    if (location.state?.category) {
      setFilters((prev) => ({
        ...prev,
        keyword: location.state.category,
      }));
    }
  }, [location.state]);

  const applyFilters = () => {
    console.log('Filters applied:', filters);
  };

  const resetFilters = () => {
    setFilters({
      work_type: [],
      work_mode: [],
      company_name: '',
      sort: '',
      keyword: '',
      location: '',
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, bgcolor: 'white', width: 'calc(100% - 240px)' }}>
        <AppBarComponent />

        <Box sx={{ p: 4, mt: 5 }} data-testid="search-box">
          <SearchBox
            keyword={filters.keyword}
            location={filters.location}
            onKeywordChange={(value) =>
              setFilters((f) => ({ ...f, keyword: value }))
            }
            onLocationChange={(value) =>
              setFilters((f) => ({ ...f, location: value }))
            }
          />

          <Box sx={{ display: 'flex', mt: 4 }}  data-testid="job-results">
            <FiltersSidebar
              filters={filters}
              setFilters={setFilters}
              applyFilters={applyFilters}
              resetFilters={resetFilters}
            />
            <JobSearchResults activeFilters={filters} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FindJobs;
