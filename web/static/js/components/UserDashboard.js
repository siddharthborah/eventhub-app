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
  Event as EventIcon,
} from '@mui/icons-material';

const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: theme.spacing(3, 0),
}));

const Header = styled(Box)(({ theme }) => ({
  background: 'white',
  borderRadius: '16px',
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)',
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  marginBottom: theme.spacing(2),
  border: '4px solid #667eea',
  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '12px',
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  fontWeight: 600,
  transition: 'all 0.3s ease',
}));

const PrimaryButton = styled(ActionButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
  },
}));

const SecondaryButton = styled(ActionButton)(({ theme }) => ({
  background: 'white',
  color: '#667eea',
  border: '2px solid #667eea',
  '&:hover': {
    background: '#667eea',
    color: 'white',
    transform: 'translateY(-2px)',
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)',
  },
}));

const UserDashboard = ({ userData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <DashboardContainer>
      <Container maxWidth="lg">
        {/* Header */}
        <Header>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#667eea',
              fontSize: '24px',
            }}
          >
            EventHub
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <IconButton sx={{ color: '#667eea' }}>
              <NotificationsIcon />
            </IconButton>
            <IconButton sx={{ color: '#667eea' }}>
              <SettingsIcon />
            </IconButton>
          </Box>
        </Header>

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
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>
                  {userData.nickname}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mb: 4 }}
                >
                  {userData.email}
                </Typography>
                
                <PrimaryButton
                  variant="contained"
                  href="/events"
                  startIcon={<EventIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  My Events
                </PrimaryButton>
                <SecondaryButton
                  variant="outlined"
                  href="/logout"
                  startIcon={<LogoutIcon />}
                  fullWidth
                >
                  Logout
                </SecondaryButton>
              </Box>
            </StyledPaper>
          </Grid>

          {/* Main Content Section */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Welcome Card */}
              <Grid item xs={12}>
                <StyledPaper>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>
                    Welcome Back, {userData.nickname}! 👋
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Ready to create amazing events? Here's your dashboard overview.
                  </Typography>
                  <PrimaryButton
                    variant="contained"
                    href="/create-event"
                    startIcon={<EventIcon />}
                  >
                    Create New Event
                  </PrimaryButton>
                </StyledPaper>
              </Grid>

              {/* Stats Cards */}
              <Grid item xs={12} sm={6}>
                <StatsCard>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h2" sx={{ fontSize: '3rem', mb: 1 }}>
                      🎉
                    </Typography>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                      Events
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Create and manage your events
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StatsCard>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h2" sx={{ fontSize: '3rem', mb: 1 }}>
                      🌐
                    </Typography>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                      Share
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Share events with friends
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>

              {/* Quick Actions */}
              <Grid item xs={12}>
                <StyledPaper>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
                    Quick Actions
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <SecondaryButton
                        fullWidth
                        href="/create-event"
                        startIcon={<EventIcon />}
                      >
                        Create Event
                      </SecondaryButton>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <SecondaryButton
                        fullWidth
                        href="/events"
                        startIcon={<EventIcon />}
                      >
                        View Events
                      </SecondaryButton>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <SecondaryButton
                        fullWidth
                        href="/events"
                        startIcon={<EventIcon />}
                      >
                        Browse Public
                      </SecondaryButton>
                    </Grid>
                  </Grid>
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