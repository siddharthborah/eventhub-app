import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Snackbar,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Help as HelpIcon,
  ContentCopy as CopyIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import SharedHeader from './SharedHeader.js';

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(2),
  },
}));

const EventCard = styled(Card)(({ theme }) => ({
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    borderRadius: '16px',
    marginBottom: theme.spacing(2),
  },
}));

const EventImage = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '300px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '64px',
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const DetailIcon = styled(Box)(({ theme }) => ({
  color: '#667eea',
  fontSize: '24px',
  marginTop: '2px',
}));

const RSVPSection = styled(Box)(({ theme }) => ({
  margin: theme.spacing(5, 0),
  padding: 0,
  border: 'none',
  background: 'none',
}));

const RSVPContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(3),
  flexWrap: 'wrap',
  padding: theme.spacing(3, 0),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

const RSVPButton = styled(Button)(({ theme, variant, selected }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: '30px',
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  border: '2px solid',
  minWidth: '100px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.875rem',
    padding: theme.spacing(1, 2.5),
    minWidth: '90px',
  },
  ...(variant === 'yes' && {
    color: selected ? 'white' : '#059669',
    borderColor: '#059669',
    backgroundColor: selected ? '#059669' : 'white',
    '&:hover': {
      backgroundColor: '#059669',
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(5, 150, 105, 0.3)',
    },
  }),
  ...(variant === 'no' && {
    color: selected ? 'white' : '#dc2626',
    borderColor: '#dc2626',
    backgroundColor: selected ? '#dc2626' : 'white',
    '&:hover': {
      backgroundColor: '#dc2626',
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(220, 38, 38, 0.3)',
    },
  }),
  ...(variant === 'maybe' && {
    color: selected ? 'white' : '#d97706',
    borderColor: '#d97706',
    backgroundColor: selected ? '#d97706' : 'white',
    '&:hover': {
      backgroundColor: '#d97706',
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(217, 119, 6, 0.3)',
    },
  }),
}));

const CountsSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'flex',
  gap: theme.spacing(3),
  justifyContent: 'center',
  flexWrap: 'wrap',
  padding: theme.spacing(2.5, 0),
  borderTop: '1px solid #e2e8f0',
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
}));

const CountItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  padding: theme.spacing(1.5, 2.5),
  background: 'white',
  borderRadius: '24px',
  fontWeight: 600,
  fontSize: '0.95rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.875rem',
    padding: theme.spacing(1, 2),
  },
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
  },
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

const EventDetailPage = ({ eventId, userInfo: propUserInfo }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRSVP, setUserRSVP] = useState(null);
  const [rsvpCounts, setRSVPCounts] = useState({ yes: 0, no: 0, maybe: 0 });
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [submittingRSVP, setSubmittingRSVP] = useState(false);

  useEffect(() => {
    // Use eventId from props or window
    const id = eventId || window.eventId;
    if (id) {
      fetchUserInfo();
      fetchEventData(id);
    }
  }, [eventId]);

  useEffect(() => {
    // Fetch user RSVP after we know if user is authenticated
    const id = eventId || window.eventId;
    if (isAuthenticated && id) {
      fetchUserRSVP(id);
    }

    // Fetch RSVP counts only if the event data is loaded and the current user is the owner
    if (event && userInfo && event.user_id === userInfo.user_id && id) {
      fetchRSVPCounts(id);
    } else {
      // For non-owners, or if data isn't ready, ensure counts are reset or not shown
      // (The rendering logic will handle not showing the section)
      setRSVPCounts({ yes: 0, no: 0, maybe: 0 }); 
    }
  }, [isAuthenticated, event, userInfo, eventId]);

  const fetchUserInfo = async () => {
    try {
      // Get user data from window.userData or props if available
      const userData = propUserInfo || window.userData;
      if (userData) {
        setIsAuthenticated(true);
        setUserInfo(userData);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    }
  };

  const fetchEventData = async (id) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        credentials: 'same-origin'
      });
      const data = await response.json();
      if (data.data) {
        setEvent(data.data);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRSVP = async (id) => {
    try {
      const response = await fetch(`/api/events/${id}/rsvp`, {
        credentials: 'same-origin'
      });
      const data = await response.json();
      if (data.rsvp) {
        setUserRSVP(data.rsvp.response);
      }
    } catch (error) {
      console.error('Error fetching RSVP:', error);
    }
  };

  const fetchRSVPCounts = async (id) => {
    try {
      const response = await fetch(`/api/events/${id}/rsvps`, {
        credentials: 'same-origin'
      });
      const data = await response.json();
      if (data.counts) {
        setRSVPCounts(data.counts);
      }
    } catch (error) {
      console.error('Error fetching RSVP counts:', error);
    }
  };

  const handleRSVP = async (response) => {
    const id = eventId || window.eventId;
    setSubmittingRSVP(true);
    try {
      const res = await fetch(`/api/events/${id}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ response }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setUserRSVP(response);
      setSnackbar({
        open: true,
        message: `✓ Your response has been saved: ${response.charAt(0).toUpperCase() + response.slice(1)}`,
        severity: 'success'
      });
      
      // Refresh counts
      fetchRSVPCounts(id);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setSubmittingRSVP(false);
    }
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeIcon = (eventType) => {
    switch (eventType) {
      case 'birthday': return '🎂';
      case 'anniversary': return '💑';
      case 'house_party': return '🏠';
      case 'wedding': return '💒';
      case 'graduation': return '🎓';
      case 'corporate': return '🏢';
      default: return '🎉';
    }
  };

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  const copyShareUrl = () => {
    const id = eventId || window.eventId;
    const url = `${window.location.protocol}//${window.location.host}/events/${id}`;
    navigator.clipboard.writeText(url);
    setSnackbar({
      open: true,
      message: 'Link copied to clipboard!',
      severity: 'success'
    });
    setShareDialogOpen(false);
  };

  if (loading) {
    return (
      <>
        {typeof SharedHeader !== 'undefined' && (
          <SharedHeader currentPage={`/events/${eventId || window.eventId}`} userInfo={userInfo} />
        )}
        <PageContainer>
          <Container maxWidth="md">
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
              <Typography variant="h6" color="white">Loading event...</Typography>
            </Box>
          </Container>
        </PageContainer>
      </>
    );
  }

  if (!event) {
    return (
      <>
        {typeof SharedHeader !== 'undefined' && (
          <SharedHeader currentPage={`/events/${eventId || window.eventId}`} userInfo={userInfo} />
        )}
        <PageContainer>
          <Container maxWidth="md">
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
              <Typography variant="h6" color="white">Event not found</Typography>
            </Box>
          </Container>
        </PageContainer>
      </>
    );
  }

  const isOwner = userInfo && event && event.user_id === userInfo.user_id;

  return (
    <>
      {typeof SharedHeader !== 'undefined' && (
        <SharedHeader currentPage={`/events/${eventId || window.eventId}`} userInfo={userInfo} />
      )}
      <PageContainer>
        <Container maxWidth="md">
          <EventCard>
            {event.image ? (
              <CardMedia
                component="img"
                height="300"
                image={event.image}
                alt={event.title}
              />
            ) : (
              <EventImage>
                <EventIcon sx={{ fontSize: '64px' }} />
              </EventImage>
            )}
            
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              {/* Event Header */}
              <Box mb={4}>
                <Typography 
                  variant={isMobile ? "h4" : "h3"} 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#2d3748',
                    fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
                  }}
                >
                  {event.title}
                </Typography>
                <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                  <Chip 
                    label={`${getEventTypeIcon(event.event_type)} ${event.event_type.replace('_', ' ')}`}
                    sx={{ 
                      backgroundColor: '#667eea', 
                      color: 'white',
                      textTransform: 'capitalize',
                      fontWeight: 500
                    }} 
                  />
                  <Chip 
                    label={event.status}
                    color={event.status === 'published' ? 'success' : 'warning'}
                    variant="outlined"
                    sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                  />
                  {!event.is_public && (
                    <Chip 
                      label="Private" 
                      variant="outlined"
                      sx={{ color: '#4a5568' }}
                    />
                  )}
                </Box>
              </Box>

              {/* Event Details */}
              <Grid container spacing={{ xs: 3, sm: 4 }} mb={4}>
                <Grid item xs={12} sm={6}>
                  <DetailItem>
                    <DetailIcon>
                      <ScheduleIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>
                        Date & Time
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {formatEventDate(event.event_date)}
                      </Typography>
                    </Box>
                  </DetailItem>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DetailItem>
                    <DetailIcon>
                      <LocationIcon />
                    </DetailIcon>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 1 }}>
                        About the Venue
                      </Typography>
                      {/* Embedded Map */}
                      <Box 
                        sx={{ 
                          my: 2, 
                          height: isMobile ? '200px' : '250px', 
                          width: '100%', 
                          borderRadius: '16px', 
                          overflow: 'hidden', 
                          border: '1px solid #e0e0e0' 
                        }}
                      >
                        <iframe
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps/embed/v1/place?key=${window.GOOGLE_MAPS_API_KEY || 'YOUR_FALLBACK_API_KEY'}&q=${encodeURIComponent(event.venue)}`}
                        ></iframe>
                      </Box>
                      {/* Clickable Venue Address */}
                      <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        component="a"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          textDecoration: 'none',
                          color: 'inherit',
                          '&:hover': {
                            textDecoration: 'underline',
                            color: theme.palette.primary.main,
                          }
                        }}
                      >
                        {event.venue}
                      </Typography>
                    </Box>
                  </DetailItem>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DetailItem>
                    <DetailIcon>
                      <PersonIcon />
                    </DetailIcon>
                    <Box>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#4a5568',
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        Organized by
                      </Typography>
                      <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        {event.user?.name || 'Unknown'}
                      </Typography>
                    </Box>
                  </DetailItem>
                </Grid>

                {event.max_attendees > 0 && (
                  <Grid item xs={12} sm={6}>
                    <DetailItem>
                      <DetailIcon>
                        <GroupIcon />
                      </DetailIcon>
                      <Box>
                        <Typography 
                          variant="h6" 
                          gutterBottom 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#4a5568',
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                          }}
                        >
                          Capacity
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          {event.max_attendees} attendees max
                        </Typography>
                      </Box>
                    </DetailItem>
                  </Grid>
                )}
              </Grid>

              {/* Event Description */}
              {event.description && (
                <Box mb={4} p={{ xs: 2, sm: 3 }} sx={{ backgroundColor: '#f8f9fa', borderRadius: '16px' }}>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#2d3748',
                      fontSize: { xs: '1.125rem', sm: '1.5rem' }
                    }}
                  >
                    About this event
                  </Typography>
                  <Typography 
                    color="text.secondary" 
                    sx={{ 
                      lineHeight: 1.7,
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    {event.description}
                  </Typography>
                </Box>
              )}

              {/* RSVP Section - Only show if authenticated and not owner */}
              {isAuthenticated && !isOwner && (
                <Box mb={4}>
                  <DetailItem>
                    <DetailIcon>
                      <EventIcon />
                    </DetailIcon>
                    <Box sx={{ width: '100%' }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#4a5568',
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        Your Response
                      </Typography>
                      <Box display="flex" gap={{ xs: 1, sm: 1.5 }} alignItems="center" flexWrap="wrap" mt={1}>
                        <RSVPButton
                          variant="yes"
                          selected={userRSVP === 'yes'}
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleRSVP('yes')}
                          disabled={submittingRSVP}
                        >
                          Yes
                        </RSVPButton>
                        <RSVPButton
                          variant="no"
                          selected={userRSVP === 'no'}
                          startIcon={<CancelIcon />}
                          onClick={() => handleRSVP('no')}
                          disabled={submittingRSVP}
                        >
                          No
                        </RSVPButton>
                        <RSVPButton
                          variant="maybe"
                          selected={userRSVP === 'maybe'}
                          startIcon={<HelpIcon />}
                          onClick={() => handleRSVP('maybe')}
                          disabled={submittingRSVP}
                        >
                          Maybe
                        </RSVPButton>
                      </Box>
                    </Box>
                  </DetailItem>
                </Box>
              )}

              {/* Login prompt for unauthenticated users */}
              {!isAuthenticated && (
                <Box mb={4}>
                  <DetailItem>
                    <DetailIcon>
                      <EventIcon />
                    </DetailIcon>
                    <Box sx={{ width: '100%' }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#4a5568',
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        RSVP
                      </Typography>
                      <Box p={2} sx={{ backgroundColor: '#f0f4ff', borderRadius: '12px' }}>
                        <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          Please log in to respond to this invitation
                        </Typography>
                        <PrimaryButton 
                          onClick={() => window.location.href = '/login'} 
                          size="small"
                          sx={{ mt: 1.5 }}
                        >
                          Login to RSVP
                        </PrimaryButton>
                      </Box>
                    </Box>
                  </DetailItem>
                </Box>
              )}

              {/* RSVP Counts - Only show if owner and counts are available */}
              {isOwner && (rsvpCounts.yes > 0 || rsvpCounts.no > 0 || rsvpCounts.maybe > 0) && (
                <Box mb={4}>
                  <DetailItem>
                    <DetailIcon>
                      <GroupIcon />
                    </DetailIcon>
                    <Box>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#4a5568',
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        Guest Responses
                      </Typography>
                      <Box display="flex" gap={{ xs: 1.5, sm: 2 }} flexWrap="wrap">
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <CheckCircleIcon sx={{ color: '#059669', fontSize: '1.25rem' }} />
                          <Typography sx={{ color: '#059669', fontWeight: 600 }}>
                            {rsvpCounts.yes || 0} Going
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <HelpIcon sx={{ color: '#d97706', fontSize: '1.25rem' }} />
                          <Typography sx={{ color: '#d97706', fontWeight: 600 }}>
                            {rsvpCounts.maybe || 0} Maybe
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <CancelIcon sx={{ color: '#dc2626', fontSize: '1.25rem' }} />
                          <Typography sx={{ color: '#dc2626', fontWeight: 600 }}>
                            {rsvpCounts.no || 0} Not Going
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </DetailItem>
                </Box>
              )}

              {/* Actions */}
              <Box display="flex" gap={2} flexWrap="wrap" mt={4}>
                <PrimaryButton startIcon={<ShareIcon />} onClick={handleShare}>
                  Share Event
                </PrimaryButton>
                
                {isOwner && (
                  <SecondaryButton 
                    startIcon={<EditIcon />} 
                    onClick={() => window.location.href = `/edit-event/${eventId || window.eventId}`}
                  >
                    Edit Event
                  </SecondaryButton>
                )}
              </Box>
            </CardContent>
          </EventCard>
        </Container>
      </PageContainer>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share this event</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Copy this link to share the event:
          </Typography>
          <TextField
            fullWidth
            value={`${window.location.protocol}//${window.location.host}/events/${eventId || window.eventId}`}
            InputProps={{
              readOnly: true,
              sx: { fontFamily: 'monospace', backgroundColor: '#f8f9fa' }
            }}
            margin="normal"
          />
          <PrimaryButton
            fullWidth
            startIcon={<CopyIcon />}
            onClick={copyShareUrl}
            sx={{ mt: 2 }}
          >
            Copy Link
          </PrimaryButton>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

// Make component available globally for the simple HTML page
window.EventDetailPage = EventDetailPage;

export default EventDetailPage; 