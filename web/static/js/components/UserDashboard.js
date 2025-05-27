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
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  CardMedia,
  Select,
  FormControl,
  InputLabel,
  Fab,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
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
  Add as AddIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Share as ShareIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import SharedHeader from './SharedHeader';

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
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  },
}));

const HeaderContent = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0.75, 3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 2),
  },
}));

const DashboardContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255,255,255,0.95)',
  borderRadius: 24,
  boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
  padding: theme.spacing(4, 3),
  maxWidth: 900,
  margin: '40px auto',
}));

const UserDashboard = ({ userData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [rsvpEvents, setRsvpEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myEventsLoading, setMyEventsLoading] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const openMenu = Boolean(anchorEl);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', message: '', eventId: null, action: '' });
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [viewMode, setViewMode] = useState('upcoming'); // 'hosting' or 'attending' or 'upcoming' or 'past' or 'drafts'

  useEffect(() => {
    fetchRSVPEvents();
    fetchMyEvents();
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

  const fetchMyEvents = async () => {
    try {
      const response = await fetch('/api/user/events', {
        credentials: 'same-origin'
      });
      const data = await response.json();
      if (data.events) {
        setMyEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching my events:', error);
    } finally {
      setMyEventsLoading(false);
    }
  };

  const handleMenuOpen = (event, eventData) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventData);
  };

  const handleMenuClose = (event) => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  const handleEditEvent = (event) => {
    event.stopPropagation();
    if (selectedEvent) {
      window.location.href = `/edit-event/${selectedEvent.id}`;
    }
    handleMenuClose();
  };
  
  const openConfirmationDialog = (event, actionType) => {
    event.stopPropagation();
    if (!selectedEvent) return;

    let title, message, action;
    if (actionType === 'delete_event') {
        title = 'Delete Event?';
        message = `Are you sure you want to permanently delete the event "${selectedEvent.title}"? This action cannot be undone.`;
        action = 'delete';
    }

    setDialogContent({ title, message, eventId: selectedEvent.id, action });
    setDialogOpen(true);
    handleMenuClose();
};

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogConfirm = async () => {
    if (!dialogContent.eventId || !selectedEvent) return;

    let endpoint = `/api/events/${dialogContent.eventId}`;
    let method = 'DELETE';
    let successMessage = 'Event deleted successfully.';

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete event');
      }
      setSnackbar({ open: true, message: successMessage, severity: 'success' });
      fetchMyEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: 'error' });
    } finally {
      handleDialogClose();
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'published':
        return {
          color: '#059669',
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          label: 'Published'
        };
      case 'cancelled':
        return {
          color: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          label: 'Cancelled'
        };
      default:
        return {
          color: '#6b7280',
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          label: status
        };
    }
  };
  
  const countEventsThisWeek = (events) => {
    if (!events || events.length === 0) return 0;

    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    
    // Calculate Sunday of the current week
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDayOfWeek);
    sunday.setHours(0, 0, 0, 0);

    // Calculate Saturday of the current week
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);

    return events.filter(event => {
      const eventDate = new Date(event.event_date);
      return eventDate >= sunday && eventDate <= saturday;
    }).length;
  };

  const handleCardClick = (eventId, e) => {
    if (e && e.target && e.target.closest('.MuiButtonBase-root[aria-label="settings"] ')) {
        return;
    }
    window.location.href = `/events/${eventId}`;
  };

  const now = new Date();
  const upcomingHosted = myEvents.filter(event => {
    const eventDate = new Date(event.event_date);
    return eventDate >= now;
  });
  const upcomingInvited = rsvpEvents.filter(rsvp => {
    const eventDate = new Date(rsvp.event.event_date);
    return eventDate >= now;
  });
  const pastHosted = myEvents.filter(event => {
    const eventDate = new Date(event.event_date);
    return eventDate < now;
  });
  const pastInvited = rsvpEvents.filter(rsvp => {
    const eventDate = new Date(rsvp.event.event_date);
    return eventDate < now;
  });
  const draftEvents = myEvents.filter(event => event.status === 'draft');
  const upcomingEvents = [
    ...upcomingHosted.map(event => ({ ...event, _type: 'host' })),
    ...upcomingInvited.map(rsvp => ({ ...rsvp.event, _type: 'attendee', rsvpResponse: rsvp.response })),
  ].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  const pastEvents = [
    ...pastHosted.map(event => ({ ...event, _type: 'host' })),
    ...pastInvited.map(rsvp => ({ ...rsvp.event, _type: 'attendee', rsvpResponse: rsvp.response })),
  ].sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

  // Share handler
  const handleShare = (event, eventId, eventTitle) => {
    event.stopPropagation();
    const url = `${window.location.protocol}//${window.location.host}/events/${eventId}`;
    if (navigator.share) {
      navigator.share({
        title: eventTitle || 'Event',
        text: `You're invited! See event details and RSVP: ${eventTitle || ''}`,
        url,
      }).catch(() => {}); // Ignore errors (e.g., user cancels)
    } else {
      navigator.clipboard.writeText(url);
      setSnackbar({ open: true, message: 'Link copied to clipboard!', severity: 'success' });
    }
  };

  const getEmptyStateContent = (currentView) => {
    switch (currentView) {
      case 'upcoming':
        return {
          title: "All Clear for Now!",
          message: "No upcoming events on your radar. Time to plan something new or check back later!"
        };
      case 'hosting':
        return {
          title: "Ready to Host?",
          message: "You're not hosting any events at the moment. Click the '+' button to create your next gathering!"
        };
      case 'attending':
        return {
          title: "Nothing on the Calendar",
          message: "You haven't RSVP'd to any events yet. Explore events or see if you've been invited!"
        };
      case 'past':
        return {
          title: "No Past Adventures (Yet!)",
          message: "Looks like there are no past events recorded here. Future memories await!"
        };
      case 'drafts':
        return {
          title: "No Drafts Here",
          message: "You don't have any event drafts saved. Start planning your next event by clicking the '+' button!"
        };
      default:
        return {
          title: "No Events Found",
          message: "Try a different filter or create a new event."
        };
    }
  };

  const filteredEvents = (viewMode === 'upcoming' ? upcomingEvents :
    viewMode === 'hosting' ? myEvents :
    viewMode === 'attending' ? rsvpEvents.map(rsvp => rsvp.event) :
    viewMode === 'past' ? pastEvents :
    viewMode === 'drafts' ? draftEvents :
    upcomingEvents);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pt: 8 }}>
      <SharedHeader currentPage="/user" userInfo={userData} />
      {/* Responsive layout: DashboardContainer on desktop, open layout on mobile */}
      {isMobile ? (
        <>
          <FormControl size="small" sx={{
            minWidth: 120,
            px: 0,
            py: 0,
            mt: 2.5,
            mb: 0.5,
            ml: { xs: '10vw', sm: 'calc((100vw - 400px) / 2)' },
            background: 'transparent',
            boxShadow: 'none',
            borderRadius: 0,
            '& .MuiOutlinedInput-root': {
              borderRadius: 999,
              fontWeight: 600,
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.95)',
              boxShadow: '0 2px 12px rgba(102,126,234,0.10)',
              px: 1.2,
              py: 0.2,
            },
            '& .MuiSelect-select': {
              py: 0.7,
              px: 1.2,
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
            },
          }}>
            <Select
              id="view-mode-select"
              value={viewMode}
              onChange={e => setViewMode(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Select event view' }}
            >
              <MenuItem value="upcoming">Upcoming</MenuItem>
              <MenuItem value="hosting">Hosting</MenuItem>
              <MenuItem value="attending">Attending</MenuItem>
              <MenuItem value="past">Past</MenuItem>
              <MenuItem value="drafts">Drafts</MenuItem>
            </Select>
          </FormControl>
          {/* Responsive event tiles: carousel on mobile */}
          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              px: 0,
              py: 2,
              gap: 3,
              maxWidth: '100vw',
              minHeight: 480,
              pl: { xs: '10vw', sm: 'calc((100vw - 400px) / 2)' },
              pr: { xs: '10vw', sm: 'calc((100vw - 400px) / 2)' },
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {filteredEvents.length === 0 ? (
              (() => {
                const emptyState = getEmptyStateContent(viewMode);
                return (
                  <Paper elevation={3} sx={{ p: 4, borderRadius: 4, minWidth: 280, maxWidth: 400, mx: 'auto', my: 6, textAlign: 'center', background: 'rgba(255,255,255,0.95)' }}>
                    <EventIcon sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 1 }}>
                      {emptyState.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {emptyState.message}
                    </Typography>
                  </Paper>
                );
              })()
            ) : (
              filteredEvents.map((event, idx) => {
                let imageUrlToDisplay = event.image;
                if (!imageUrlToDisplay && event.event_type) {
                  imageUrlToDisplay = eventTypeImages[event.event_type] || eventTypeImages.other;
                }
                return (
                  <Box
                    key={event.id + (event._type || '')}
                    sx={{
                      flex: '0 0 80vw',
                      maxWidth: 400,
                      minWidth: 320,
                      mx: 'auto',
                      scrollSnapAlign: 'center',
                      position: 'relative',
                      transition: 'transform 0.3s',
                    }}
                  >
                    <EventCard
                      sx={{ boxShadow: 6, cursor: 'pointer' }}
                      onClick={() => window.location.href = `/events/${event.id}`}
                    >
                      {imageUrlToDisplay && (
                        <CardMedia
                          component="img"
                          height="220"
                          image={imageUrlToDisplay}
                          alt={event.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = eventTypeImages.other;
                          }}
                          sx={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                        />
                      )}
                      <CardContent sx={{ pb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600, 
                              color: '#2d3748',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flexGrow: 1,
                              mr: 1,
                            }}
                            title={event.title}
                          >
                            {event.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {event._type === 'host' ? (
                              <Chip label="Hosting" size="small" sx={{ backgroundColor: '#667eea', color: 'white', ml: 1 }} />
                            ) : event._type === 'attendee' ? (
                              <Chip label="Attending" size="small" sx={{ backgroundColor: '#764ba2', color: 'white', ml: 1 }} />
                            ) : null}
                            <IconButton size="small" aria-label="share" onClick={e => handleShare(e, event.id, event.title)} sx={{ ml: 0.5 }}>
                              <ShareIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
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
                            {formatEventDate(event.event_date)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                          <LocationOnIcon sx={{ fontSize: 16, mr: 1, color: '#667eea', flexShrink: 0 }} />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            title={event.venue}
                          >
                            {event.venue}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                          <PersonIcon sx={{ color: '#667eea', fontSize: 18, mr: 1 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {event.user?.name || 'Organizer'}
                          </Typography>
                        </Box>
                        {event.description && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                            <DescriptionIcon sx={{ fontSize: 16, mr: 1, color: '#667eea', flexShrink: 0 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {event.description}
                            </Typography>
                          </Box>
                        )}
                        <Chip 
                          label={`${getEventTypeIcon(event.event_type)} ${event.event_type.replace('_', ' ')}`}
                          size="small" 
                          sx={{ 
                            backgroundColor: '#667eea', 
                            color: 'white',
                            textTransform: 'capitalize',
                            mt: 1.2
                          }} 
                        />
                        {event._type === 'attendee' && (
                          (() => {
                            let bgColor = '#6b7280';
                            let label = 'Unknown';
                            if (event.rsvpResponse === 'yes') {
                              bgColor = '#059669'; // green
                              label = 'Going';
                            } else if (event.rsvpResponse === 'no') {
                              bgColor = '#dc2626'; // red
                              label = 'Not Going';
                            } else if (event.rsvpResponse === 'maybe') {
                              bgColor = '#d97706'; // yellow
                              label = 'Maybe';
                            }
                            return (
                              <Chip
                                label={label}
                                size="small"
                                sx={{
                                  backgroundColor: bgColor,
                                  color: 'white',
                                  borderRadius: 999,
                                  mt: 1.2,
                                  ml: 1,
                                  mb: 0,
                                  textTransform: 'capitalize',
                                }}
                              />
                            );
                          })()
                        )}
                      </CardContent>
                    </EventCard>
                  </Box>
                );
              })
            )}
          </Box>
        </>
      ) : (
        <DashboardContainer>
          <FormControl size="small" sx={{
            minWidth: 120,
            px: 0,
            py: 0,
            mt: 0,
            mb: 2,
            background: 'transparent',
            boxShadow: 'none',
            borderRadius: 0,
            '& .MuiOutlinedInput-root': {
              borderRadius: 999,
              fontWeight: 600,
              fontSize: '1rem',
              background: 'rgba(255,255,255,1)',
              boxShadow: '0 2px 12px rgba(102,126,234,0.10)',
              px: 1.2,
              py: 0.2,
            },
            '& .MuiSelect-select': {
              py: 0.7,
              px: 1.2,
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
            },
          }}>
            <Select
              id="view-mode-select"
              value={viewMode}
              onChange={e => setViewMode(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Select event view' }}
            >
              <MenuItem value="upcoming">Upcoming</MenuItem>
              <MenuItem value="hosting">Hosting</MenuItem>
              <MenuItem value="attending">Attending</MenuItem>
              <MenuItem value="past">Past</MenuItem>
              <MenuItem value="drafts">Drafts</MenuItem>
            </Select>
          </FormControl>
          <Grid container spacing={3}>
            {filteredEvents.length === 0 ? (
              (() => {
                const emptyState = getEmptyStateContent(viewMode);
                return (
                  <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 6, borderRadius: 4, textAlign: 'center', background: 'rgba(255,255,255,0.95)' }}>
                      <EventIcon sx={{ fontSize: 56, color: '#667eea', mb: 2 }} />
                      <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 1 }}>
                        {emptyState.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {emptyState.message}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })()
            ) : (
              filteredEvents.map((event, idx) => {
                let imageUrlToDisplay = event.image;
                if (!imageUrlToDisplay && event.event_type) {
                  imageUrlToDisplay = eventTypeImages[event.event_type] || eventTypeImages.other;
                }
                return (
                  <Grid item xs={12} sm={6} md={4} key={event.id + (event._type || '')}>
                    <EventCard sx={{ boxShadow: 6, cursor: 'pointer' }} onClick={() => window.location.href = `/events/${event.id}`}>
                      {imageUrlToDisplay && (
                        <CardMedia
                          component="img"
                          height="220"
                          image={imageUrlToDisplay}
                          alt={event.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = eventTypeImages.other;
                          }}
                          sx={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                        />
                      )}
                      <CardContent sx={{ pb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600, 
                              color: '#2d3748',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flexGrow: 1,
                              mr: 1,
                            }}
                            title={event.title}
                          >
                            {event.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {event._type === 'host' ? (
                              <Chip label="Hosting" size="small" sx={{ backgroundColor: '#667eea', color: 'white', ml: 1 }} />
                            ) : event._type === 'attendee' ? (
                              <Chip label="Attending" size="small" sx={{ backgroundColor: '#764ba2', color: 'white', ml: 1 }} />
                            ) : null}
                            <IconButton size="small" aria-label="share" onClick={e => handleShare(e, event.id, event.title)} sx={{ ml: 0.5 }}>
                              <ShareIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
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
                            {formatEventDate(event.event_date)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                          <LocationOnIcon sx={{ fontSize: 16, mr: 1, color: '#667eea', flexShrink: 0 }} />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            title={event.venue}
                          >
                            {event.venue}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                          <PersonIcon sx={{ color: '#667eea', fontSize: 18, mr: 1 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {event.user?.name || 'Organizer'}
                          </Typography>
                        </Box>
                        {event.description && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                            <DescriptionIcon sx={{ fontSize: 16, mr: 1, color: '#667eea', flexShrink: 0 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {event.description}
                            </Typography>
                          </Box>
                        )}
                        <Chip 
                          label={`${getEventTypeIcon(event.event_type)} ${event.event_type.replace('_', ' ')}`}
                          size="small" 
                          sx={{ 
                            backgroundColor: '#667eea', 
                            color: 'white',
                            textTransform: 'capitalize',
                            mt: 1.2
                          }} 
                        />
                        {event._type === 'attendee' && (
                          (() => {
                            let bgColor = '#6b7280';
                            let label = 'Unknown';
                            if (event.rsvpResponse === 'yes') {
                              bgColor = '#059669'; // green
                              label = 'Going';
                            } else if (event.rsvpResponse === 'no') {
                              bgColor = '#dc2626'; // red
                              label = 'Not Going';
                            } else if (event.rsvpResponse === 'maybe') {
                              bgColor = '#d97706'; // yellow
                              label = 'Maybe';
                            }
                            return (
                              <Chip
                                label={label}
                                size="small"
                                sx={{
                                  backgroundColor: bgColor,
                                  color: 'white',
                                  borderRadius: 999,
                                  mt: 1.2,
                                  ml: 1,
                                  mb: 0,
                                  textTransform: 'capitalize',
                                }}
                              />
                            );
                          })()
                        )}
                      </CardContent>
                    </EventCard>
                  </Grid>
                );
              })
            )}
          </Grid>
        </DashboardContainer>
      )}
      <Fab
        href="/create-event"
        aria-label="Create Event"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
          color: 'white',
          boxShadow: '0 6px 24px 0 rgba(255, 152, 0, 0.25), 0 1.5px 0 rgba(255, 152, 0, 0.08)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ff9800 0%, #ffa726 100%)',
            boxShadow: '0 12px 32px 0 rgba(255, 152, 0, 0.32)',
            transform: 'scale(1.08)',
          },
          zIndex: 1201,
        }}
      >
        <AddIcon sx={{ fontSize: 28 }} />
      </Fab>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEditEvent}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Event
        </MenuItem>
        <MenuItem onClick={(e) => openConfirmationDialog(e, 'delete_event')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          Delete Event
        </MenuItem>
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogContent.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogContent.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Back
          </Button>
          <Button onClick={handleDialogConfirm} color={dialogContent.action === 'delete' ? "error" : "primary"} autoFocus>
            Confirm {dialogContent.action === 'delete' ? "Deletion" : "Publish"}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserDashboard; 