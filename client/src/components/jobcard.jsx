import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Box, Chip, Avatar
} from '@mui/material';
import { getCompanyById } from '../utils/api';
import JobDescriptionPopup from '../components/jobdescriptionpopup'; // ✅ NEW

const JobCard = ({ job }) => {
  const [logoUrl, setLogoUrl] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false); // ✅ open job details

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        let companyId = job.recruiter?.recruiterDetails?.company;

        if (!companyId && job.company) {
          companyId = job.company;
        }

        if (companyId) {
          const company = await getCompanyById(
            typeof companyId === 'object' ? companyId._id : companyId
          );
          if (company?.logo) {
            setLogoUrl(company.logo);
          }
        }
      } catch (err) {
        console.error('❌ Failed to fetch company logo', err);
      }
    };

    fetchLogo();
  }, [job]);

  return (
    <>
      <Card
        sx={{
          height: '100%',
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          transition: '0.3s',
          '&:hover': { boxShadow: 6, cursor: 'pointer' },
        }}
        onClick={() => setDetailsOpen(true)} // ✅ Show details instead of apply popup
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            {logoUrl ? (
              <Avatar
                src={`http://localhost:3001${logoUrl}`}
                sx={{ width: 40, height: 40, borderRadius: 1 }}
                variant="rounded"
              />
            ) : (
              <Box sx={{ width: 40, height: 40, bgcolor: '#e0f2f1', borderRadius: 1 }} />
            )}

            {job.work_type && (
              <Chip
                label={job.work_type}
                size="small"
                sx={{
                  bgcolor: '#e0f7fa',
                  color: '#00796b',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                }}
              />
            )}
          </Box>

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {job.job_title || "Untitled Job"}
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2}>
            {job.recruiter?.name || 'Company'} • {job.location || 'Unknown Location'}
          </Typography>

          {job.required_skills?.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {job.required_skills.slice(0, 2).map((s, index) => (
                <Chip
                  key={index}
                  label={s.skill?.skill_name || 'Skill'}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: index % 2 === 0 ? '#fdd835' : '#4caf50',
                    color: index % 2 === 0 ? '#f57f17' : '#2e7d32',
                    textTransform: 'capitalize',
                  }}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* ✅ Job Details Popup (handles Apply internally) */}
      <JobDescriptionPopup
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        job={job}
      />
    </>
  );
};

export default JobCard;
