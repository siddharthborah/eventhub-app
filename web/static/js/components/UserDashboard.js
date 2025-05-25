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
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  },
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
    } else if (actionType === 'cancel_event') {
        title = 'Cancel Event?';
        message = `Are you sure you want to cancel the event "${selectedEvent.title}"?`;
        action = 'cancel';
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
    let body = null;

    if (dialogContent.action === 'cancel') {
        method = 'PUT';
        body = JSON.stringify({ status: 'cancelled' });
        successMessage = 'Event cancelled successfully.';
    }

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: body,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update event');
      }
      setSnackbar({ open: true, message: successMessage, severity: 'success' });
      fetchMyEvents();
    } catch (error) {
      console.error('Error performing action:', error);
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
      if (event.status !== 'published') return false;
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

  return (
    <>
      <SharedHeader currentPage="/user" userInfo={userData} />
      <DashboardContainer>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledPaper>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>
                      Welcome Back, {userData.nickname}! 👋
                    </Typography>
                    {!myEventsLoading && myEvents && myEvents.length > 0 ? (
                        (() => {
                            const eventsThisWeekCount = countEventsThisWeek(myEvents);
                            if (eventsThisWeekCount > 0) {
                                return (
                                    <Typography variant="body1" color="text.secondary">
                                        You have {eventsThisWeekCount} event{eventsThisWeekCount > 1 ? 's' : ''} this week.
                                    </Typography>
                                );
                            } else {
                                return (
                                    <Typography variant="body1" color="text.secondary">
                                       You have no events scheduled for this week. Why not create one?
                                    </Typography>
                                );
                            }
                        })()
                    ) : !myEventsLoading ? (
                        <Typography variant="body1" color="text.secondary">
                           Ready to create amazing events? Here's your dashboard overview.
                        </Typography>
                    ) : null /* Don't show anything while myEvents are loading */ }
                  </StyledPaper>
                </Grid>

                <Grid item xs={12}>
                  <StyledPaper>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748' }}>
                        <EventIcon sx={{ mr: 1, color: '#667eea' }} />
                        My Events
                      </Typography>
                      <PrimaryButton
                        href="/create-event"
                        size="small"
                      >
                        <AddIcon />
                      </PrimaryButton>
                    </Box>
                    
                    {myEventsLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : myEvents.length > 0 ? (
                      <Grid container spacing={2}>
                        {myEvents.map((event) => {
                          const statusStyle = getStatusStyle(event.status);
                          const showStatusChip = event.status === 'published' || event.status === 'cancelled';
                          return (
                          <Grid item xs={12} sm={6} md={4} key={event.id}>
                            <EventCard onClick={(e) => handleCardClick(event.id, e)} sx={{cursor: 'pointer'}}>
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
                                  <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                    {showStatusChip && (
                                      <Chip
                                        label={statusStyle.label}
                                        size="small"
                                        sx={{
                                          backgroundColor: statusStyle.backgroundColor,
                                          color: statusStyle.color,
                                          fontWeight: 600,
                                          fontSize: '0.75rem',
                                          mr: 0.5,
                                        }}
                                      />
                                    )}
                                    <IconButton 
                                      aria-label="settings" 
                                      onClick={(e) => handleMenuOpen(e, event)}
                                      size="small"
                                      sx={{ p:0.5 }}
                                    >
                                      <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
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
                                    {formatEventDate(event.event_date)}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <LocationOnIcon sx={{ fontSize: 16, mr: 1, color: '#667eea', flexShrink: 0 }} />
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    title={event.venue}
                                  >
                                    {event.venue}
                                  </Typography>
                                </Box>
                                <Chip 
                                  label={`${getEventTypeIcon(event.event_type)} ${event.event_type.replace('_', ' ')}`}
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
                          🎪 No events created yet!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Start by creating your first event
                        </Typography>
                        <PrimaryButton href="/create-event">
                          <AddIcon />
                        </PrimaryButton>
                      </Box>
                    )}
                  </StyledPaper>
                </Grid>

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
                                  label={`${getEventTypeIcon(rsvp.event.event_type)} ${rsvp.event.event_type.replace('_', ' ')}`}
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
                      </Box>
                    )}
                  </StyledPaper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </DashboardContainer>
      
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
        {selectedEvent?.status === 'published' ? (
          <MenuItem onClick={(e) => openConfirmationDialog(e, 'cancel_event')} sx={{ color: 'warning.dark' }}>
            <ListItemIcon>
              <CancelIcon fontSize="small" sx={{ color: 'warning.dark' }} />
            </ListItemIcon>
            Cancel Event
          </MenuItem>
        ) : selectedEvent?.status === 'cancelled' || selectedEvent?.status === 'draft' ? (
           <MenuItem onClick={(e) => openConfirmationDialog(e, 'delete_event')} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            {selectedEvent?.status === 'draft' ? 'Delete Draft' : 'Delete Event'}
          </MenuItem>
        ) : null}
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
          <Button onClick={handleDialogConfirm} color={dialogContent.action === 'delete' ? "error" : (dialogContent.action === 'cancel' ? "warning" : "primary")} autoFocus>
            Confirm {dialogContent.action === 'delete' ? "Deletion" : (dialogContent.action === 'cancel' ? "Cancellation" : "Publish")}
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
    </>
  );
};

export default UserDashboard; 