export const applicationSubmitted = (name, jobTitle) => `
  <h3>Hello ${name},</h3>
  <p>Your application for <strong>${jobTitle}</strong> has been successfully submitted.</p>
  <p>We’ll notify you when your application status is updated.</p>
  <p>Thank you for using CGMS!</p>
`;

export const applicationPhaseUpdated = (name, jobTitle, phase) => `
  <h3>Hello ${name},</h3>
  <p>Your application for <strong>${jobTitle}</strong> has been updated to the phase: <strong>${phase}</strong>.</p>
  <p>Log in to your dashboard for more details.</p>
`;

export const notifyRecruiterOfApplication = (
  recruiterName,
  applicantName,
  jobTitle
) => `
  <h3>Hello ${recruiterName},</h3>
  <p><strong>${applicantName}</strong> has applied for your job: <strong>${jobTitle}</strong>.</p>
  <p>Log in to view their application.</p>
`;
