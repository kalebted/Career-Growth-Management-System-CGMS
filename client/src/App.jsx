import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignUpPage from "./pages/signuppage";
import LoginPage from "./pages/loginPageTW";
import LandingPage from "./pages/landingpage";
import Dashboard from "./pages/dashboard";
import RecruiterDashboard from "./pages/recruiter_dashboard";
import RecruiterProfile from "./pages/recruiter_profile";
import PostJobs from "./pages/job_post_page";
import JobSeekerProfile from "./pages/job_seeker_profile";
import FindJobs from "./pages/find_jobs";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import Applications from "./pages/applications";
import JobsPosted from "./pages/myjobs";
import AiRecommendations from "./pages/airecommendations";
import Settings from "./pages/settings";
import RecruiterSettings from "./pages/recruiter_settings";
import HelpPage from "./pages/helppage";
import RecruiterHelpPage from "./pages/recrutier_help";
import SelectRolePage from "./pages/selectrole";
import AdminDashboard from "./pages/admindashboard";
import PrivateRoute from "./utils/privateroute";
import AdminUsers from "./pages/adminusers";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/select-role" element={<SelectRolePage />} />

        {/* Job Seeker Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['job_seeker']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/jobseeker_profile"
          element={
            <PrivateRoute allowedRoles={['job_seeker']}>
              <JobSeekerProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/find_jobs"
          element={
            <PrivateRoute allowedRoles={['job_seeker']}>
              <FindJobs />
            </PrivateRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <PrivateRoute allowedRoles={['job_seeker']}>
              <Applications />
            </PrivateRoute>
          }
        />
        <Route
          path="/ai_recommendations"
          element={
            <PrivateRoute allowedRoles={['job_seeker']}>
              <AiRecommendations />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute allowedRoles={['job_seeker']}>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/help"
          element={
            <PrivateRoute allowedRoles={['job_seeker']}>
              <HelpPage />
            </PrivateRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/recruiter_dashboard"
          element={
            <PrivateRoute allowedRoles={['recruiter']}>
              <RecruiterDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/recruiter_profile"
          element={
            <PrivateRoute allowedRoles={['recruiter']}>
              <RecruiterProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/post_jobs"
          element={
            <PrivateRoute allowedRoles={['recruiter']}>
              <PostJobs />
            </PrivateRoute>
          }
        />
        <Route
          path="/jop_posts"
          element={
            <PrivateRoute allowedRoles={['recruiter']}>
              <JobsPosted />
            </PrivateRoute>
          }
        />
        <Route
          path="/recruiter_settings"
          element={
            <PrivateRoute allowedRoles={['recruiter']}>
              <RecruiterSettings />
            </PrivateRoute>
          }
        />
        <Route
          path="/recruiter_help"
          element={
            <PrivateRoute allowedRoles={['recruiter']}>
              <RecruiterHelpPage />
            </PrivateRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin_dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
          
              <AdminDashboard />
           </PrivateRoute>
          }
        />
            <Route
          path="/admin_users"
          element={
            <PrivateRoute allowedRoles={['admin']}>
          
              <AdminUsers />
           </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
