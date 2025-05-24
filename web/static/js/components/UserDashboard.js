import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: '#F8F9FA',
  padding: theme.spacing(4, 0),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(10px)',
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  marginBottom: theme.spacing(2),
  border: `4px solid ${theme.palette.primary.main}`,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  fontWeight: 500,
}));

const UserDashboard = ({ userData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <DashboardContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* User Profile Section */}
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <UserAvatar src={userData.picture} alt={userData.nickname} />
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
                  {userData.nickname}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mb: 3 }}
                >
                  {userData.email}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <IconButton color="primary">
                    <NotificationsIcon />
                  </IconButton>
                  <IconButton color="primary">
                    <SettingsIcon />
                  </IconButton>
                </Box>
                <ActionButton
                  variant="outlined"
                  color="primary"
                  href="/logout"
                  startIcon={<LogoutIcon />}
                  fullWidth
                >
                  Logout
                </ActionButton>
              </Box>
            </StyledPaper>
          </Grid>

          {/* Main Content Section */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Welcome Card */}
              <Grid item xs={12}>
                <StyledPaper>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
                    Welcome Back!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Here's what's happening with your account today.
                  </Typography>
                </StyledPaper>
              </Grid>

              {/* Stats Cards */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Profile Views
                    </Typography>
                    <Typography variant="h3" color="primary">
                      245
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Last Login
                    </Typography>
                    <Typography variant="h3" color="primary">
                      Today
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Activity */}
              <Grid item xs={12}>
                <StyledPaper>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {[1, 2, 3].map((item) => (
                      <Box
                        key={item}
                        sx={{
                          py: 2,
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          '&:last-child': {
                            borderBottom: 'none',
                          },
                        }}
                      >
                        <Typography variant="body1">
                          Activity item {item}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date().toLocaleDateString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </StyledPaper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </DashboardContainer>
  );
};

export default UserDashboard; 