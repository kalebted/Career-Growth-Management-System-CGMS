import React from 'react';
import { Box, Typography } from '@mui/material';
import vodafone from '../../assets/vodafone.svg';
import intel from '../../assets/intel.svg';
import amd from '../../assets/amd.svg';
import tesla from '../../assets/tesla.svg';
import talkit from '../../assets/talkit.svg';

const logos = [
  { src: vodafone, alt: 'Vodafone' },
  { src: intel, alt: 'Intel' },
  { src: tesla, alt: 'Tesla' },
  { src: amd, alt: 'AMD' },
  { src: talkit, alt: 'Talkit' },
];

const CompanyLogos = () => {
  return (
    <Box
      sx={{
        padding: '2rem 2rem 3rem',
        backgroundColor: 'white',
        textAlign: 'left',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 500,
          marginBottom: '1rem',
          color: '#555',
          fontSize: '1.1rem',
          opacity: 0.8,
        }}
      >
        Companies you will find
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '8rem',
          flexWrap: 'wrap',
        }}
      >
        {logos.map((logo, index) => (
          <Box
            component="img"
            key={index}
            src={logo.src}
            alt={logo.alt}
            sx={{
              height: '25px',
              objectFit: 'contain',
              filter: 'grayscale(100%)',
              transition: 'filter 0.3s ease',
              '&:hover': {
                filter: 'grayscale(0%)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CompanyLogos;