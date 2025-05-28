import { Box } from '@mui/material';
import AdminSidebar from '../components/common/admin_sidebar';
import AdminAppBarComponent from '../components/common/admin_appbar';
import AdminUsersPage from '../components/User Admin/adminuserscomponent';


const AdminUsers = () => (
  <Box sx={{ display: 'flex' }}>
    <AdminSidebar />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: '#fafafa',
        ml: '0px', 
        width: 'calc(100% - 240px)', 
        backgroundColor: 'white',
      }}
    >
      <AdminAppBarComponent />
      <Box sx={{ marginTop: '50px' }}></Box>
      <AdminUsersPage />
    </Box>
  </Box>
);

export default AdminUsers;