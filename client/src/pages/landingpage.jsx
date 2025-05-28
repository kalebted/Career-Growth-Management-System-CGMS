import React from 'react';
import { Box, Container } from '@mui/material';
import NavBar from '../components/Landing Page/navbar';
import Footer from '../components/Landing Page/footer';
import HeroSection from '../components/Landing Page/herosection';
import CompanyLogos from '../components/Landing Page/companylogos';
import CategorySection from '../components/Landing Page/catagorysection';
import FeaturedJobs from '../components/Landing Page/featuredjobs';
// import LatestJobs from '../components/latestjobs';
import '../styles/landing.css';

const LandingPage = () => {
  return (
    <Box className="dashboard-root">
      <Box className="header-wrapper">
        <NavBar />
        <HeroSection />
      </Box>
      <Box sx={{ backgroundColor: '#fff' }}>
        <Container maxWidth="lg" sx={{ backgroundColor: '#fff' }}>
          <CompanyLogos />
          <CategorySection />
          <FeaturedJobs />
          {/* <LatestJobs /> */}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default LandingPage; 