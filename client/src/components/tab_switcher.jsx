import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import MyProfileForm from './jobseekerprofile_form';
import CVManager from './cvManager';
import CVHistory from './cvHistory';
import ExperienceTab from './experiencetab';
import SkillsTab from './skillstab';
import CertificationsTab from './certeficationstab'; // ⬅️ New

const TabSwitcher = () => {
  const [tab, setTab] = useState(0);

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ mt: 8 }}>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 'bold',
            color: '#7C8493',
            fontSize: '1rem',
          },
          '& .Mui-selected': {
            color: '#28A745 !important',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#28A745',
          },
        }}
      >
        <Tab label="My Profile" />
        <Tab label="CVs" />
        <Tab label="Experience" />
        <Tab label="Skills" />
        <Tab label="Certifications" /> {/* ⬅️ New tab */}
      </Tabs>

      <Box mt={3}>
        {tab === 0 && <MyProfileForm />}
        {tab === 1 && (
          <Box p={2}>
            <CVManager />
            <CVHistory />
          </Box>
        )}
        {tab === 2 && <ExperienceTab />}
        {tab === 3 && <SkillsTab />}
        {tab === 4 && <CertificationsTab />} 
      </Box>
    </Box>
  );
};

export default TabSwitcher;
