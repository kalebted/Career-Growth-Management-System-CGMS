import React from 'react';
import { Typography } from '@mui/material';
import signupgirl from '../../../assets/signupgirl.png';
import barchart from '../../../assets/barchart.svg';

const LeftPanel = () => (
  <div className="left-panel">
    <Typography variant="h6" className="cgms-text">CGMS</Typography>
    <div className="stat-box">
  <img src={barchart} alt="Stat Icon" className="stat-box-icon" />
  <Typography variant="h6" fontWeight="bold">100K+</Typography>
<Typography variant="body2" color="textSecondary">People got hired</Typography>
</div>
    <img
      src={signupgirl}
      alt="Person with magnifying glass"
      className='signupgirl'
    />
  </div>
);

export default LeftPanel;