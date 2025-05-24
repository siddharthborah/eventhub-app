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

const PageContainer = styled(Box)(({ theme }) => ({
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

const EventCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 500,
  ...(status === 'published' && {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
  }),
  ...(status === 'draft' && {
    backgroundColor: '#fff3e0',
    color: '#f57c00',
  }),
  ...(status === 'cancelled' && {
    backgroundColor: '#ffebee',
    color: '#c62828',
  }),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  fontWeight: 500,
}));

const MyEventsPage = ({ userId }) => {
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
      <PageContainer>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress size={60} />
          </Box>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="lg">
        {/* Header Section */}
        <StyledPaper sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
                My Events
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and view your upcoming events
              </Typography>
            </Box>
            <ActionButton
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ mt: isMobile ? 2 : 0 }}
              onClick={handleCreateEvent}
            >
              Create Event
            </ActionButton>
          </Box>
        </StyledPaper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Events List */}
        {events.length === 0 ? (
          <StyledPaper>
            <Box textAlign="center" py={6}>
              <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No events yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Create your first event to get started
              </Typography>
              <ActionButton variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreateEvent}>
                Create Your First Event
              </ActionButton>
            </Box>
          </StyledPaper>
        ) : (
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} lg={4} key={event.id}>
                <EventCard>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
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

                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button size="small" startIcon={<VisibilityIcon />} onClick={() => handleViewEvent(event.id)}>
                      View
                    </Button>
                    <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditEvent(event.id)}>
                      Edit
                    </Button>
                  </CardActions>
                </EventCard>
              </Grid>
            ))}
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
            color="primary"
            aria-label="add"
            onClick={handleCreateEvent}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
          >
            <AddIcon />
          </Fab>
        )}
      </Container>
    </PageContainer>
  );
};

export default MyEventsPage; 