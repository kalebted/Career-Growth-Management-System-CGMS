import React from 'react';
import { Box, Typography } from '@mui/material';
import scribble from '../../assets/sciblelines.svg';

const HeroSection = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '4rem 2rem',
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <Box sx={{ maxWidth: '50%' }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Arial', sans-serif",
            fontWeight: 900,
            fontSize: '3.5rem',
            lineHeight: 1.2,
            color: '#1a3c5e',
          }}
        >
          Discover <br />
          more than <br />
          <Box
            component="span"
            sx={{
              color: '#1e7c2e',
              position: 'relative',
              display: 'inline-block',
            }}
          >
            5000+ Jobs
            <Box
              sx={{
                position: 'absolute',
                bottom: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '400px',
                height: '40px',
                backgroundImage: `url(${scribble})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
              }}
            />
          </Box>
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mt: 2,
            color: '#666',
            fontSize: '1.1rem',
            lineHeight: 1.5,
            position: 'relative',
            top: '30px',
            right: '30px',
            paddingBottom: '35px',
          }}
        >
          Great platform for the job seeker that searching for <br />
          new career heights and passionate about startups.
        </Typography>
      </Box>
    </Box>
  );
};

export default HeroSection;
