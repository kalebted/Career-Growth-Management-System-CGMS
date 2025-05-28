import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Avatar, Pagination, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { getAllUsersByRole, deleteUserById } from '../../utils/api';
import { useAuth } from '../../utils/authcontext';

const AdminUsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('job_seeker');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, userId: null });

  const usersPerPage = 12;
  const totalPages = Math.ceil(users.length / usersPerPage);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsersByRole(roleFilter);
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleFilter]);

  const handleDelete = async () => {
    try {
      await deleteUserById(deleteConfirm.userId);
      setUsers((prev) => prev.filter((user) => user._id !== deleteConfirm.userId));
    } catch (err) {
      console.error('Error deleting user:', err);
    } finally {
      setDeleteConfirm({ open: false, userId: null });
    }
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <Box sx={{ mt: 10, px: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Manage Users
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant={roleFilter === 'job_seeker' ? 'contained' : 'outlined'}
          color="success"
          onClick={() => setRoleFilter('job_seeker')}
        >
          Job Seekers
        </Button>
        <Button
          variant={roleFilter === 'recruiter' ? 'contained' : 'outlined'}
          color="success"
          onClick={() => setRoleFilter('recruiter')}
        >
          Recruiters
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedUsers.map((u) => (
              <Grid item xs={12} sm={6} md={4} key={u._id}>
                <Card sx={{ p: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#4CAF50' }}>{u.name?.[0]}</Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">{u.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{u.role}</Typography>
                        <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ mt: 2 }}
                      onClick={() => setDeleteConfirm({ open: true, userId: u._id })}
                    >
                      Delete User
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, value) => setCurrentPage(value)}
                color="primary"
              />
            </Box>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteConfirm.open}
            onClose={() => setDeleteConfirm({ open: false, userId: null })}
          >
            <DialogTitle>Delete User</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete this user? This action cannot be undone.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteConfirm({ open: false, userId: null })}>Cancel</Button>
              <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default AdminUsersPage;
