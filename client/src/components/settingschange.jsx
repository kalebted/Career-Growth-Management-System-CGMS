import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Button, Typography, Snackbar, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText, Paper
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import { fetchCurrentUser, updateUserProfile, deleteAccount } from '../utils/api';
import { useAuth } from '../utils/authcontext';

const SettingsPage = () => {
  const { logout } = useAuth();

  const [form, setForm] = useState({
    name: '', username: '', currentPassword: '', newPassword: ''
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchCurrentUser();
        setForm((f) => ({ ...f, name: user.name || '', username: user.username || '' }));
      } catch (err) {
        setSnackbar({ open: true, message: 'Failed to load user data', severity: 'error' });
      }
    };
    loadUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateUserProfile(form);
      setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
      setForm((f) => ({ ...f, currentPassword: '', newPassword: '' }));
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      if (!deletePassword.trim()) {
        setDeleteError('Password is required');
        return;
      }

      await deleteAccount(deletePassword);
      logout();
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete account');
    }
  };

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 8,
          width: '100%',
          maxWidth: 600,
          borderRadius: 2,
          bgcolor: 'white'
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>Account Settings</Typography>

        <TextField
          fullWidth margin="normal"
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth margin="normal"
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
        />
        <TextField
          fullWidth margin="normal"
          label="Current Password"
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
        />
        <TextField
          fullWidth margin="normal"
          label="New Password"
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            color="success"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
          >
            Save Changes
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete Account
          </Button>

          <Button
            variant="outlined"
            color="warning"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DialogTitle>Confirm Account Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 1 }}>
              Please confirm your password to permanently delete your account.
            </DialogContentText>
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={deletePassword}
              onChange={(e) => {
                setDeletePassword(e.target.value);
                setDeleteError('');
              }}
              error={Boolean(deleteError)}
              helperText={deleteError}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button color="error" onClick={handleDelete}>Delete</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
