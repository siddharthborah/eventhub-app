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
  Menu,
  MenuItem,
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
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  PhotoAlbum as PhotoAlbumIcon,
} from '@mui/icons-material';
import SharedHeader from './SharedHeader.js';

const eventTypeImages = {
  birthday: '/static/img/event-types/birthday.jpg',
  anniversary: '/static/img/event-types/anniversary.jpg',
  wedding: '/static/img/event-types/wedding.jpg',
  house_party: '/static/img/event-types/house_party.jpg',
  graduation: '/static/img/event-types/graduation.jpg',
  corporate: '/static/img/event-types/corporate.jpg',
  conference: '/static/img/event-types/conference.jpg',
  workshop: '/static/img/event-types/workshop.jpg',
  social: '/static/img/event-types/social.jpg',
  other: '/static/img/event-types/other.jpg', // A default fallback
};

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
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2.5),
}));

const DetailIcon = styled(Box)(({ theme }) => ({
  color: '#667eea',
  fontSize: '18px',
  marginTop: 0,
  display: 'flex',
  alignItems: 'center',
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
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

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
    const id = eventId || window.eventId;
    const url = `${window.location.protocol}//${window.location.host}/events/${id}`;
    // Format date/time for sharing
    const start = new Date(event.event_date);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2 hours
    const formatShareDate = (start, end) => {
      const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
      const dateStr = start.toLocaleDateString('en-US', options);
      const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      return `On ${dateStr}, ${startTime} – ${endTime}`;
    };
    const shareText = `${event.title}\n${formatShareDate(start, end)}\nAt ${event.venue}\nView details and RSVP\n${url}`;
    if (navigator.share) {
      navigator.share({
        title: event.title || 'Event',
        text: shareText,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setSnackbar({ open: true, message: 'Event details copied to clipboard!', severity: 'success' });
    }
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDelete = () => {
    handleMenuClose();
    alert('Delete option clicked!'); // Replace with real delete logic later
  };

  const handlePlaceholder = () => {
    handleMenuClose();
    alert('Placeholder option clicked!');
  };

  // Add to Google Calendar handler
  const handleAddToGoogleCalendar = () => {
    handleMenuClose();
    if (!event) return;
    const pad = (n) => n.toString().padStart(2, '0');
    const formatDate = (date) => {
      return date.getUTCFullYear().toString() +
        pad(date.getUTCMonth() + 1) +
        pad(date.getUTCDate()) + 'T' +
        pad(date.getUTCHours()) +
        pad(date.getUTCMinutes()) +
        pad(date.getUTCSeconds()) + 'Z';
    };
    const start = new Date(event.event_date);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2 hours
    const eventUrl = `${window.location.protocol}//${window.location.host}/events/${eventId || window.eventId}`;
    const details = `${event.description || ''}\n\nEvent link: ${eventUrl}`;
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDate(start)}/${formatDate(end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event.venue || '')}`;
    window.open(calendarUrl, '_blank');
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

  let imageUrlToDisplay = event.image; // Custom image URL
  if (!imageUrlToDisplay && event.event_type) {
    imageUrlToDisplay = eventTypeImages[event.event_type] || eventTypeImages.other;
  }

  return (
    <>
      {typeof SharedHeader !== 'undefined' && (
        <SharedHeader currentPage={`/events/${eventId || window.eventId}`} userInfo={userInfo} />
      )}
      <PageContainer>
        <Container maxWidth="md">
          <EventCard>
            {imageUrlToDisplay ? (
              <CardMedia
                component="img"
                height="300"
                image={imageUrlToDisplay}
                alt={event.title}
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.onerror = null; // prevent infinite loop
                  e.target.src = eventTypeImages.other; // or a more generic placeholder
                }}
              />
            ) : (
              <EventImage>
                <EventIcon sx={{ fontSize: '64px' }} />
              </EventImage>
            )}
            
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              {/* Event Header */}
              <Box
                mb={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexDirection="row"
                gap={{ xs: 1, sm: 2 }}
              >
                <Typography 
                  variant={isMobile ? "h4" : "h3"}
                  component="h1" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#2d3748',
                    fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                    flexGrow: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textAlign: 'left',
                  }}
                >
                  {event.title}
                </Typography>
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="flex-end" 
                  gap={0} 
                  sx={{ 
                    '& .MuiIconButton-root': { 
                      padding: '4px',
                      margin: '0 2px'
                    } 
                  }}
                >
                  <IconButton 
                    aria-label="Share Event" 
                    onClick={handleShare} 
                    size="small"
                  >
                    <ShareIcon sx={{ color: 'text.secondary' }} />
                  </IconButton>
                  {isOwner && (
                    <IconButton 
                      aria-label="More options" 
                      onClick={handleMenuOpen} 
                      size="small"
                    >
                      <MoreVertIcon sx={{ color: 'text.secondary' }} />
                    </IconButton>
                  )}
                  <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem onClick={() => { handleMenuClose(); window.location.href = `/edit-event/${eventId || window.eventId}`; }}>
                      <EditIcon sx={{ mr: 1, color: 'text.secondary' }} /> Edit
                    </MenuItem>
                    <MenuItem onClick={handleAddToGoogleCalendar}>
                      <EventIcon sx={{ mr: 1, color: 'primary.main' }} /> Add to Google Calendar
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                      <DeleteIcon sx={{ mr: 1, color: 'error.main' }} /> Delete
                    </MenuItem>
                    <MenuItem onClick={handlePlaceholder}>
                      <HelpIcon sx={{ mr: 1, color: 'text.secondary' }} /> Placeholder Option
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
              <Box display="flex" gap={1} alignItems="center" flexWrap="wrap" mb={3}>
                <Chip 
                  label={`${getEventTypeIcon(event.event_type)} ${event.event_type.replace('_', ' ')}`}
                  sx={{ 
                    backgroundColor: '#667eea', 
                    color: 'white',
                    textTransform: 'capitalize',
                    fontWeight: 500
                  }} 
                />
                {event.status === 'draft' && (
                  <Chip 
                    label="Draft"
                    color="warning"
                    variant="outlined"
                    sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                  />
                )}
                {!event.is_public && (
                  <Chip 
                    label="Private" 
                    variant="outlined"
                    sx={{ color: '#4a5568' }}
                  />
                )}
              </Box>

              {/* Event Details */}
              <Grid container spacing={4}>
                {/* LEFT COLUMN - Date/Time, Organizer, Description, RSVP */}
                <Grid item xs={12} sm={6}>
                  {/* Date/Time Section */}
                  <DetailItem>
                    <DetailIcon>
                      <ScheduleIcon />
                    </DetailIcon>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                      {formatEventDate(event.event_date)}
                    </Typography>
                  </DetailItem>

                  {/* Organizer Section */}
                  <DetailItem>
                    <DetailIcon>
                      <PersonIcon />
                    </DetailIcon>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                      {event.user?.name || 'Unknown'}
                    </Typography>
                  </DetailItem>

                  {/* Max Attendees Section (if applicable) */}
                  {event.max_attendees > 0 && (
                    <DetailItem>
                      <DetailIcon>
                        <GroupIcon />
                      </DetailIcon>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                        {event.max_attendees} attendees max
                      </Typography>
                    </DetailItem>
                  )}

                  {/* Description Section */}
                  {event.description && (
                    <DetailItem>
                      <DetailIcon>
                        <EventIcon />
                      </DetailIcon>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                        {event.description}
                      </Typography>
                    </DetailItem>
                  )}

                  {/* Google Photos Album Section */}
                  {isAuthenticated && event.google_photos_enabled && (
                    <DetailItem>
                      <DetailIcon>
                        <PhotoAlbumIcon />
                      </DetailIcon>
                      {event.google_photos_album_url ? (
                        <Typography 
                          variant="body2" 
                          component="a"
                          color="text.secondary"
                          href={event.google_photos_album_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            fontSize: '1rem',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                            }
                          }}
                        >
                          Google Photo Album
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                          📸 Google Photos album will be available soon
                        </Typography>
                      )}
                    </DetailItem>
                  )}

                  {/* RSVP Section - Only show if authenticated and not owner */}
                  {isAuthenticated && !isOwner && (
                    <Box>
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
                    <Box>
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
                    <Box>
                      <DetailItem>
                        <DetailIcon>
                          <GroupIcon />
                        </DetailIcon>
                        <Box display="flex" gap={{ xs: 1.5, sm: 2 }} flexWrap="wrap">
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <CheckCircleIcon sx={{ color: '#059669', fontSize: '1.25rem' }} />
                            <Typography sx={{ color: '#059669', fontWeight: 600 }}>
                              {rsvpCounts.yes || 0}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <HelpIcon sx={{ color: '#d97706', fontSize: '1.25rem' }} />
                            <Typography sx={{ color: '#d97706', fontWeight: 600 }}>
                              {rsvpCounts.maybe || 0}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <CancelIcon sx={{ color: '#dc2626', fontSize: '1.25rem' }} />
                            <Typography sx={{ color: '#dc2626', fontWeight: 600 }}>
                              {rsvpCounts.no || 0}
                            </Typography>
                          </Box>
                        </Box>
                      </DetailItem>
                    </Box>
                  )}
                </Grid>

                {/* RIGHT COLUMN - Venue and Map */}
                <Grid item xs={12} sm={6}>
                  {/* Venue Section */}
                  <DetailItem>
                    <DetailIcon>
                      <LocationIcon />
                    </DetailIcon>
                    <Typography 
                      variant="body2" 
                      component="a"
                      color="text.secondary"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontSize: '1rem',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: theme.palette.primary.main,
                        }
                      }}
                    >
                      {event.venue}
                    </Typography>
                  </DetailItem>
                  
                  {/* Embedded Map */}
                  <Box 
                    sx={{ 
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
                </Grid>
              </Grid>
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
            onClick={handleShare}
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