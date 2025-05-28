import React from 'react';
import { Box, Typography, Grid, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CampaignIcon from '@mui/icons-material/Campaign';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ComputerIcon from '@mui/icons-material/Computer';
import CodeIcon from '@mui/icons-material/Code';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const categories = [
  { icon: <DesignServicesIcon />, title: 'Design', jobs: 'Jobs Available' },
  { icon: <StorefrontIcon />, title: 'Sales', jobs: 'Jobs Available' },
  { icon: <CampaignIcon />, title: 'Marketing', jobs: 'Jobs Available' },
  { icon: <AccountBalanceIcon />, title: 'Finance', jobs: 'Jobs Available' },
  { icon: <ComputerIcon />, title: 'Technology', jobs: 'Jobs Available' },
  { icon: <CodeIcon />, title: 'Engineering', jobs: 'Jobs Available' },
  { icon: <BusinessCenterIcon />, title: 'Business', jobs: 'Jobs Available' },
  { icon: <GroupsIcon />, title: 'Human Resource', jobs: 'Jobs Available' },
];

const CategorySection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (title) => {
    navigate('/find_jobs', { state: { category: title } });
  };

  return (
    <Box sx={{ padding: '4rem 2rem' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: '#1a3c5e',
            textTransform: 'uppercase',
          }}
        >
          Explore by category
        </Typography>
        <Link
          href="/find_jobs"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#1e7c2e',
            fontWeight: 500,
            textDecoration: 'none',
            fontSize: '1rem',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Show all jobs
          <ArrowForwardIcon
            sx={{ fontSize: '1rem', marginLeft: '0.1rem', color: '#1e7c2e' }}
          />
        </Link>
      </Box>

      <Grid container spacing={5} sx={{ marginTop: '1rem' }}>
        {categories.map((cat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              className="category-card"
              onClick={() => handleCategoryClick(cat.title)}
              sx={{
                padding: '2.2rem',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                backgroundColor: 'white',
                minHeight: '150px',
                '&:hover': {
                  backgroundColor: '#1e7c2e',
                  border: 'none',
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                },
                '&:hover .category-icon, &:hover .category-title, &:hover .category-jobs, &:hover .arrow-icon': {
                  color: 'white',
                },
              }}
            >
              <Box
                className="category-icon"
                sx={{
                  fontSize: '2rem',
                  color: '#1e7c2e',
                  marginBottom: '1.5rem',
                  '& .MuiSvgIcon-root': {
                    fontSize: 'inherit',
                  },
                }}
              >
                {cat.icon}
              </Box>
              <Typography
                className="category-title"
                sx={{
                  fontWeight: 600,
                  fontSize: '1.25rem',
                  color: '#1a3c5e',
                  transition: 'color 0.3s ease',
                }}
              >
                {cat.title}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '0.75rem',
                }}
              >
                <Typography
                  className="category-jobs"
                  sx={{
                    fontSize: '1rem',
                    color: '#777',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {cat.jobs}
                </Typography>
                <ArrowForwardIcon
                  className="arrow-icon"
                  sx={{
                    fontSize: '1.2rem',
                    color: '#1a3c5e',
                    marginLeft: '0.75rem',
                    transition: 'color 0.3s ease',
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategorySection;
