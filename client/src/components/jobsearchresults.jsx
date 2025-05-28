import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Pagination,
  CircularProgress,
  Typography
} from '@mui/material';
import { getAllJobs } from '../utils/api';
import JobCard from './jobcard';

const JobSearchResults = ({ activeFilters = {} }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [page, setPage] = useState(1);
  const jobsPerPage = 6;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      applyFilters();
    }
  }, [activeFilters, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getAllJobs();
      setJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      console.error('❌ Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const {
      work_type = [],
      work_mode = [],
      company_name = '',
      keyword = '',
      location = '',
      sort = ''
    } = activeFilters;

    let result = [...jobs];

    // Work Type Filter
    if (work_type.length > 0) {
      result = result.filter((job) =>
        work_type.includes(job.work_type?.toLowerCase())
      );
    }

    // Work Mode Filter
    if (work_mode.length > 0) {
      result = result.filter((job) =>
        work_mode.includes(job.work_mode?.toLowerCase())
      );
    }

    // Company Name Filter
    if (company_name) {
      result = result.filter((job) =>
        job.recruiter?.name?.toLowerCase().includes(company_name.toLowerCase())
      );
    }

    // Location Filter
    if (location) {
      result = result.filter((job) =>
        job.location?.toLowerCase() === location.toLowerCase()
      );
    }

    // Keyword Filter (job title)
    if (keyword) {
      result = result.filter((job) =>
        job.job_title?.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // Sorting
    if (sort === 'newest') {
      result.sort((a, b) => new Date(b.posting_date) - new Date(a.posting_date));
    } else if (sort === 'oldest') {
      result.sort((a, b) => new Date(a.posting_date) - new Date(b.posting_date));
    }

    setPage(1); // Reset to first page
    setFilteredJobs(result);
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const paginatedJobs = filteredJobs.slice((page - 1) * jobsPerPage, page * jobsPerPage);

  return (
    <Box sx={{ p: 3, flexGrow: 1 }}>
      {loading ? (
        <Box textAlign="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredJobs.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ mt: 5, color: '#777' }}>
              No jobs found matching your filters.
            </Typography>
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedJobs.map((job) => (
                  <Grid item xs={12} sm={6} md={4} key={job._id}>
                    <JobCard job={job} />
                  </Grid>
                ))}
              </Grid>

              {filteredJobs.length > jobsPerPage && (
                <Box mt={4} display="flex" justifyContent="center">
                  <Pagination
                    count={Math.ceil(filteredJobs.length / jobsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default JobSearchResults;
