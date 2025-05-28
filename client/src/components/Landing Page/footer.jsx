import React from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import logo from '../../assets/logo-grayscale-inverted.svg';

const Footer = () => {
  const socialLinks = [
    { Icon: Facebook, url: 'https://www.facebook.com/YourPage', label: 'Facebook' },
    { Icon: Instagram, url: 'https://www.instagram.com/YourProfile', label: 'Instagram' },
    { Icon: LinkedIn, url: 'https://www.linkedin.com/in/YourProfile', label: 'LinkedIn' },
    { Icon: Twitter, url: 'https://twitter.com/YourProfile', label: 'Twitter' },
  ];

  return (
    <Box
      sx={{
        padding: '3rem 2rem 2rem',
        backgroundColor: '#202430',
        color: 'white',
        textAlign: { xs: 'center', md: 'left' },
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* CGMS Section */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', maxWidth: '350px' }}>
            {/* Logo */}
            <Box
              component="img"
              src={logo}
              alt="CGMS Logo"
              sx={{
                height: '150px',
                width: '150px',
                borderRadius: '8px',
                flexShrink: 0,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                
                },
              }}
            />

            {/* Text Section: CGMS + Tagline */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Epilogue, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                  transition: 'color 0.3s ease',
                  
                }}
              >
                CGMS
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'Epilogue, sans-serif',
                  fontSize: '0.95rem',
                  color: '#d8e2f0',
                }}
              >
                Great platform for job seekers passionate about startups. Find your dream job easier.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Footer Bottom Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '3rem',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: '1rem', md: '0' },
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Epilogue, sans-serif',
            fontSize: '0.85rem',
            color: '#d8e2f0',
          }}
        >
          2025 © CGMS. All rights reserved.
        </Typography>

        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          {socialLinks.map(({ Icon, url, label }, index) => (
            <IconButton
              key={index}
              component="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              sx={{
                color: '#d8e2f0',
                transition: 'color 0.3s ease, transform 0.3s ease',
                '&:hover': {
                  color: '#4dabf7',
                  transform: 'scale(1.2)',
                },
              }}
            >
              <Icon />
            </IconButton>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
