import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, Stack, Divider
} from '@mui/material';
import JobApplyPopup from './jobapply_popup';

const JobDescriptionPopup = ({ open, onClose, job }) => {
  const [showApplyPopup, setShowApplyPopup] = useState(false);

  if (!job) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{job.job_title}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="subtitle1">📍 Location: {job.location}</Typography>

            <Typography variant="body2">{job.job_description}</Typography>

            <Divider />

            <Typography variant="body2">🕒 Type: {job.work_type}</Typography>
            <Typography variant="body2">🏢 Mode: {job.work_mode}</Typography>
            <Typography variant="body2">📂 Category: {job.job_category}</Typography>
            <Typography variant="body2">
              📅 Deadline: {new Date(job.application_deadline).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <>
                <Typography variant="subtitle2">Requirements:</Typography>
                <ul>
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>
                      <Typography variant="body2">{req}</Typography>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Required Skills */}
            {job.required_skills?.length > 0 && (
              <>
                <Typography variant="subtitle2">Required Skills:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {job.required_skills.map((skillObj, idx) => (
                    <Button
                      key={idx}
                      size="small"
                      variant="outlined"
                      sx={{
                        textTransform: 'capitalize',
                        borderColor: '#4caf50',
                        color: '#2e7d32',
                        fontWeight: 500,
                      }}
                    >
                      {skillObj.skill?.skill_name || 'Skill'} ({skillObj.proficiency_level})
                    </Button>
                  ))}
                </Stack>
              </>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: '#055F08', '&:hover': { bgcolor: '#034c06' } }}
            onClick={() => {
              onClose();
              setTimeout(() => setShowApplyPopup(true), 300);
            }}
          >
            Apply Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Apply Popup */}
      <JobApplyPopup
        open={showApplyPopup}
        onClose={() => setShowApplyPopup(false)}
        jobId={job._id}
      />
    </>
  );
};

export default JobDescriptionPopup;
