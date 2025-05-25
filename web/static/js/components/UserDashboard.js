import React, { useState, useEffect } from 'react';
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
  Chip,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Event as EventIcon,
  LocationOn as LocationOnIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Mail as MailIcon,
} from '@mui/icons-material';
import SharedHeader from './SharedHeader';

const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  paddingTop: theme.spacing(12), // Space for floating header
  paddingBottom: theme.spacing(4),
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

const EventCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  },
}));

const UserDashboard = ({ userData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [rsvpEvents, setRsvpEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRSVPEvents();
  }, []);

  const fetchRSVPEvents = async () => {
    try {
      const response = await fetch('/api/user/rsvps', {
        credentials: 'same-origin'
      });
      const data = await response.json();
      if (data.rsvps) {
        setRsvpEvents(data.rsvps);
      }
    } catch (error) {
      console.error('Error fetching RSVP events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRSVPResponseStyle = (response) => {
    switch (response) {
      case 'yes':
        return {
          color: '#059669',
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
          label: 'Going'
        };
      case 'no':
        return {
          color: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          icon: <span className="material-icons" style={{ fontSize: 16 }}>cancel</span>,
          label: 'Not Going'
        };
      case 'maybe':
        return {
          color: '#d97706',
          backgroundColor: 'rgba(217, 119, 6, 0.1)',
          icon: <span className="material-icons" style={{ fontSize: 16 }}>help</span>,
          label: 'Maybe'
        };
      default:
        return {
          color: '#6b7280',
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          icon: <span className="material-icons" style={{ fontSize: 16 }}>question_mark</span>,
          label: 'Unknown'
        };
    }
  };

  return (
    <>
      <SharedHeader currentPage="/user" userInfo={userData} />
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
                    <Typography variant="body1" color="text.secondary">
                      Ready to create amazing events? Here's your dashboard overview.
                    </Typography>
                  </StyledPaper>
                </Grid>

                {/* RSVP'd Events Section */}
                <Grid item xs={12}>
                  <StyledPaper>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
                      <MailIcon sx={{ mr: 1, color: '#667eea' }} />
                      Invited To
                    </Typography>
                    
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : rsvpEvents.length > 0 ? (
                      <Grid container spacing={2}>
                        {rsvpEvents.map((rsvp) => {
                          const responseStyle = getRSVPResponseStyle(rsvp.response);
                          return (
                          <Grid item xs={12} sm={6} md={4} key={rsvp.id}>
                            <EventCard onClick={() => window.location.href = `/events/${rsvp.event.id}`}>
                              <CardContent sx={{ pb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                  <Typography 
                                    variant="h6" 
                                    sx={{ 
                                      fontWeight: 600, 
                                      color: '#2d3748', 
                                      mb: 0,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      pr: 1,
                                      flex: 1
                                    }}
                                    title={rsvp.event.title}
                                  >
                                    {rsvp.event.title}
                                  </Typography>
                                  <Chip
                                    icon={responseStyle.icon}
                                    label={responseStyle.label}
                                    size="small"
                                    sx={{
                                      backgroundColor: responseStyle.backgroundColor,
                                      color: responseStyle.color,
                                      fontWeight: 600,
                                      fontSize: '0.75rem',
                                      flexShrink: 0
                                    }}
                                  />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: '#667eea', flexShrink: 0 }} />
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    {formatEventDate(rsvp.event.event_date)}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <LocationOnIcon sx={{ fontSize: 16, mr: 1, color: '#667eea', flexShrink: 0 }} />
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    title={rsvp.event.venue}
                                  >
                                    {rsvp.event.venue}
                                  </Typography>
                                </Box>
                                <Chip 
                                  label={rsvp.event.event_type} 
                                  size="small" 
                                  sx={{ 
                                    backgroundColor: '#667eea', 
                                    color: 'white',
                                    textTransform: 'capitalize'
                                  }} 
                                />
                              </CardContent>
                            </EventCard>
                          </Grid>
                        )})}
                      </Grid>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          📬 No invitations yet!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          You haven't RSVP'd to any events yet
                        </Typography>
                        <SecondaryButton href="/events">
                          Browse Events
                        </SecondaryButton>
                      </Box>
                    )}
                  </StyledPaper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </DashboardContainer>
    </>
  );
};

export default UserDashboard; 