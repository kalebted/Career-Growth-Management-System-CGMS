import React from 'react';
import { Button } from '@mui/material';

const GoogleSignInButton = ({ text }) => (
  <Button
    variant="outlined"
    startIcon={<img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 20 }} />}
    fullWidth
    sx={{ mb: 2 }}
  >
    {text}
  </Button>
);

export default GoogleSignInButton;