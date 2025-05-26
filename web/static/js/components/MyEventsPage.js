import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Fab,
  Menu,
  MenuItem,
  CardMedia,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
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

const PageContainer = styled(Box)(({ theme }) => ({
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

const EventCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  borderRadius: '12px',
  ...(status === 'published' && {
    backgroundColor: '#d4edda',
    color: '#155724',
  }),
  ...(status === 'draft' && {
    backgroundColor: '#fff3cd',
    color: '#856404',
  }),
  ...(status === 'cancelled' && {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  }),
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

const PageHeader = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '16px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)',
  textAlign: 'center',
}));

const MyEventsPage = ({ userId, userInfo }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    fetchUserEvents();
  }, [userId]);

  const fetchUserEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, eventId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEventId(eventId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEventId(null);
  };

  const handleDeleteEvent = async (eventId) => {
    // TODO: Implement delete functionality
    console.log('Delete event:', eventId);
    handleMenuClose();
  };

  const handleCreateEvent = () => {
    window.location.href = '/create-event';
  };

  const handleViewEvent = (eventId) => {
    window.location.href = `/events/${eventId}`;
  };

  const handleEditEvent = (eventId) => {
    // TODO: Implement edit functionality when edit page is created
    console.log('Edit event:', eventId);
    // window.location.href = `/edit-event/${eventId}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  if (loading) {
    return (
      <>
        <SharedHeader currentPage="/events" userInfo={userInfo} />
        <PageContainer>
          <Container maxWidth="lg">
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              minHeight="50vh"
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box textAlign="center">
                <CircularProgress 
                  size={60} 
                  sx={{ 
                    color: 'white',
                    mb: 2 
                  }} 
                />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  Loading your events...
                </Typography>
              </Box>
            </Box>
          </Container>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <SharedHeader currentPage="/events" userInfo={userInfo} />
      <PageContainer>
        <Container maxWidth="lg">
          {/* Page Header */}
          <PageHeader>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
              My Events
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and view your upcoming events
            </Typography>
          </PageHeader>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {/* Events List */}
          {events.length === 0 ? (
            <StyledPaper>
              <Box textAlign="center" py={6}>
                <EventIcon sx={{ fontSize: 64, color: '#667eea', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>
                  No events yet 🎉
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Create your first event to get started and bring people together
                </Typography>
                <PrimaryButton startIcon={<AddIcon />} onClick={handleCreateEvent}>
                  Create Your First Event
                </PrimaryButton>
              </Box>
            </StyledPaper>
          ) : (
            <Grid container spacing={3}>
              {events.map((event) => {
                let imageUrlToDisplay = event.image; // Custom image URL
                if (!imageUrlToDisplay && event.event_type) {
                  imageUrlToDisplay = eventTypeImages[event.event_type] || eventTypeImages.other;
                }

                return (
                  <Grid item xs={12} sm={6} lg={4} key={event.id}>
                    <EventCard>
                      {imageUrlToDisplay && (
                        <CardMedia
                          component="img"
                          height="140" // Adjust height as needed for tiles
                          image={imageUrlToDisplay}
                          alt={event.title}
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.target.onerror = null; // prevent infinite loop
                            e.target.src = eventTypeImages.other; // or a more generic placeholder
                          }}
                        />
                      )}
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={imageUrlToDisplay ? 1 : 2}> {/* Adjust margin if image is present */}
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="h2" sx={{ fontSize: '1.5rem' }}>
                              {getEventTypeIcon(event.event_type)}
                            </Typography>
                            <StatusChip 
                              label={event.status} 
                              size="small" 
                              status={event.status}
                            />
                          </Box>
                          <IconButton 
                            size="small"
                            onClick={(e) => handleMenuOpen(e, event.id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {event.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {event.description}
                        </Typography>

                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(event.event_date)}
                          </Typography>
                        </Box>

                        {event.venue && (
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {event.venue}
                            </Typography>
                          </Box>
                        )}

                        {event.max_attendees > 0 && (
                          <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              Max {event.max_attendees} attendees
                            </Typography>
                          </Box>
                        )}

                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip 
                            label={event.event_type.replace('_', ' ')} 
                            size="small" 
                            variant="outlined"
                            sx={{ textTransform: 'capitalize' }}
                          />
                          {event.is_public && (
                            <Chip 
                              label="Public" 
                              size="small" 
                              variant="outlined"
                              color="primary"
                            />
                          )}
                        </Box>
                      </CardContent>

                      <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                        <SecondaryButton 
                          size="small" 
                          startIcon={<VisibilityIcon />} 
                          onClick={() => handleViewEvent(event.id)}
                          sx={{ fontSize: '0.875rem', py: 0.5, px: 1.5 }}
                        >
                          View
                        </SecondaryButton>
                        <SecondaryButton 
                          size="small" 
                          startIcon={<EditIcon />} 
                          onClick={() => handleEditEvent(event.id)}
                          sx={{ fontSize: '0.875rem', py: 0.5, px: 1.5 }}
                        >
                          Edit
                        </SecondaryButton>
                      </CardActions>
                    </EventCard>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* Action Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { handleViewEvent(selectedEventId); handleMenuClose(); }}>
              <VisibilityIcon sx={{ mr: 1 }} />
              View Event
            </MenuItem>
            <MenuItem onClick={() => { handleEditEvent(selectedEventId); handleMenuClose(); }}>
              <EditIcon sx={{ mr: 1 }} />
              Edit Event
            </MenuItem>
            <MenuItem onClick={() => handleDeleteEvent(selectedEventId)}>
              <DeleteIcon sx={{ mr: 1 }} />
              Delete Event
            </MenuItem>
          </Menu>

          {/* Floating Action Button for Mobile */}
          {isMobile && (
            <Fab
              onClick={handleCreateEvent}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              }}
            >
              <AddIcon />
            </Fab>
          )}
        </Container>
      </PageContainer>
    </>
  );
};

export default MyEventsPage; 