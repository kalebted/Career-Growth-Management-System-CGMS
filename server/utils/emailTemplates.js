// utils/emailTemplates.js

export const applicationPhaseUpdated = (name, jobTitle, phase) => {
  let message = "";

  if (phase === "rejected") {
    message = `
      <p>We regret to inform you that your application for the position of <strong>${jobTitle}</strong> has been <strong>rejected</strong>.</p>
      <p>We appreciate your interest in joining our team and encourage you to apply for future openings that match your skills and experience.</p>
      <p>Thank you for your effort and time.</p>
    `;
  } else if (phase === "accepted") {
    message = `
      <p>We are pleased to inform you that your application for the position of <strong>${jobTitle}</strong> has been <strong>accepted</strong>!</p>
      <p>Congratulations on reaching this milestone. Our team will be in touch with you shortly regarding the next steps.</p>
    `;
  } else {
    message = `
      <p>Your application for the position of <strong>${jobTitle}</strong> has been moved to the <strong>${phase}</strong> stage.</p>
      <p>Please log in to your dashboard to view more details and stay updated.</p>
    `;
  }

  return `
    <h2>Hi ${name},</h2>
    ${message}
    <p>Thank you for using CGMS!</p>
  `;
};
