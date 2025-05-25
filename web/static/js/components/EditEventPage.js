import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  useTheme,
  useMediaQuery,
  Collapse,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  Save as SaveIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import SharedHeader from './SharedHeader';

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

const eventTypes = [
  { value: 'birthday', label: '🎂 Birthday' },
  { value: 'anniversary', label: '💑 Anniversary' },
  { value: 'house_party', label: '🏠 House Party' },
  { value: 'wedding', label: '💒 Wedding' },
  { value: 'graduation', label: '🎓 Graduation' },
  { value: 'corporate', label: '🏢 Corporate Event' },
  { value: 'other', label: '🎉 Other' },
];

// Google Places Autocomplete Component
const GooglePlacesAutocomplete = ({ value, onChange, ...props }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [inputValue, setInputValue] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places || !inputRef.current) {
      return;
    }

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['establishment', 'geocode'],
        fields: ['name', 'formatted_address', 'geometry', 'place_id', 'types', 'business_status'],
      }
    );

    const placeChangedListener = autocompleteRef.current.addListener('place_changed', () => {
      setIsLoading(true);
      const place = autocompleteRef.current.getPlace();

      if (place && (place.formatted_address || place.name)) {
        const venueData = {
          name: place.name || '',
          address: place.formatted_address || place.name,
          placeId: place.place_id || '',
          coordinates: place.geometry && place.geometry.location ? {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          } : null,
          businessStatus: place.business_status || 'OPERATIONAL',
          types: place.types || [],
        };
        
        const displayValue = place.formatted_address || place.name || '';
        setInputValue(displayValue);
        if (typeof onChange === 'function') {
          onChange(venueData);
        }
      } else {
        if (typeof onChange === 'function') {
          onChange(inputRef.current.value);
        }
      }
      setIsLoading(false);
    });

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.removeListener(placeChangedListener);
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value || '');
    }
  }, [value]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setIsLoading(newValue.length > 0);
    
    if (typeof onChange === 'function') {
      onChange(newValue);
    }
  };
  
  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      const pacItemSelected = document.querySelector('.pac-item-selected');
      if(!pacItemSelected) {
        event.preventDefault();
      }
    }
    if (event.key === 'Escape') {
      setIsLoading(false);
    }
  };

  return (
    <TextField
      {...props}
      inputRef={inputRef}
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleInputKeyDown}
      InputProps={{
        ...props.InputProps,
        startAdornment: (
          <LocationIcon sx={{ color: '#667eea', mr: 1 }} />
        ),
        endAdornment: isLoading ? (
          <CircularProgress size={20} sx={{ color: '#667eea' }} />
        ) : null,
      }}
      autoComplete="off" 
      name="google-places-autocomplete-venue"
    />
  );
};

const EditEventPage = ({ userId, userInfo, eventId, eventData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const autocompleteRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    venueData: null,
    event_date: '',
    image: '',
    event_type: 'birthday',
    max_attendees: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showAdditionalSettings, setShowAdditionalSettings] = useState(false);

  // Load event data when component mounts
  useEffect(() => {
    if (eventData) {
      // Format the date for datetime-local input
      const eventDate = new Date(eventData.event_date);
      const formattedDate = eventDate.toISOString().slice(0, 16);

      setFormData({
        title: eventData.title || '',
        description: eventData.description || '',
        venue: eventData.venue || '',
        venueData: null, // Will be populated if we have enhanced venue data
        event_date: formattedDate,
        image: eventData.image || '',
        event_type: eventData.event_type || 'birthday',
        max_attendees: eventData.max_attendees || '',
      });

      // Show additional settings if any advanced fields are set
      if (eventData.max_attendees > 0 || eventData.image) {
        setShowAdditionalSettings(true);
      }
    }
  }, [eventData]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVenueSelect = (venueData) => {
    setFormData(prev => ({
      ...prev,
      venue: venueData.address,
      venueData: venueData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updateData = {
        ...formData,
        event_date: new Date(formData.event_date).toISOString(),
        max_attendees: parseInt(formData.max_attendees) || 0,
      };

      // Add enhanced venue data if available from Google Places
      if (formData.venueData && typeof formData.venueData === 'object') {
        updateData.venue_name = formData.venueData.name || '';
        updateData.venue_place_id = formData.venueData.placeId || '';
        if (formData.venueData.coordinates) {
          updateData.venue_lat = formData.venueData.coordinates.lat || 0;
          updateData.venue_lng = formData.venueData.coordinates.lng || 0;
        }
      }

      // Remove fields that shouldn't be updated
      delete updateData.venueData;

      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update event');
      }

      setSuccess(true);
      // Redirect to event detail page after 2 seconds
      setTimeout(() => {
        window.location.href = `/events/${eventId}`;
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <SharedHeader currentPage="/edit-event" userInfo={userInfo} />
        <PageContainer>
          <Container maxWidth="md">
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
              <Alert severity="success" sx={{ borderRadius: '12px', fontSize: '1.1rem' }}>
                ✅ Event updated successfully! Redirecting to event page...
              </Alert>
            </Box>
          </Container>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <SharedHeader currentPage="/edit-event" userInfo={userInfo} />
      <PageContainer>
        <Container maxWidth="md">
          {/* Header */}
          <Box mb={4} display="flex" alignItems="center" gap={2}>
            <IconButton 
              onClick={() => window.location.href = `/events/${eventId}`}
              sx={{ 
                color: 'white',
                background: 'rgba(255,255,255,0.1)',
                '&:hover': { background: 'rgba(255,255,255,0.2)' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              component="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2.5rem' }
              }}
            >
              Edit Event
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <StyledPaper>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Title"
                    value={formData.title}
                    onChange={handleChange('title')}
                    required
                    placeholder="e.g., John's 30th Birthday Party"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={handleChange('description')}
                    multiline
                    rows={3}
                    placeholder="Tell people about your event..."
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Event Type</InputLabel>
                    <Select
                      value={formData.event_type}
                      onChange={handleChange('event_type')}
                      label="Event Type"
                    >
                      {eventTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Date and Location */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mt: 2 }}>
                    Date & Location
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Event Date & Time"
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={handleChange('event_date')}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <GooglePlacesAutocomplete
                    ref={autocompleteRef}
                    onPlaceSelect={handleVenueSelect}
                    value={formData.venue}
                    placeholder="Enter event location..."
                    label="Venue"
                    required
                    fullWidth
                  />
                </Grid>

                {/* Additional Settings */}
                <Grid item xs={12}>
                    <Button 
                        fullWidth 
                        onClick={() => setShowAdditionalSettings(!showAdditionalSettings)}
                        sx={{
                            justifyContent: 'space-between',
                            py: 1.5,
                            textTransform: 'none',
                            color: 'text.primary',
                            "&:hover": {
                                background: 'rgba(0,0,0,0.04)'
                            }
                        }}
                        endIcon={showAdditionalSettings ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                            Additional Settings
                        </Typography>
                    </Button>
                    <Divider sx={{ mt:1, mb: showAdditionalSettings ? 2 : 0 }}/>
                </Grid>
                
                {/* Collapsed Content: Max Attendees */}
                <Grid item xs={12} sm={6}>
                  <Collapse in={showAdditionalSettings} timeout="auto" unmountOnExit sx={{ width: '100%'}}>
                    <TextField
                      fullWidth
                      label="Max Attendees"
                      type="number"
                      value={formData.max_attendees}
                      onChange={handleChange('max_attendees')}
                      placeholder="0 for unlimited"
                      inputProps={{ min: 0 }}
                    />
                  </Collapse>
                </Grid>

                {/* Collapsed Content: Event Image URL */}
                <Grid item xs={12} sm={6}>
                  <Collapse in={showAdditionalSettings} timeout="auto" unmountOnExit sx={{ width: '100%'}}>
                    <TextField
                      fullWidth
                      label="Event Image URL"
                      value={formData.image}
                      onChange={handleChange('image')}
                      placeholder="https://example.com/image.jpg"
                    />
                  </Collapse>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box display="flex" gap={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                    <SecondaryButton
                      variant="outlined"
                      onClick={() => window.location.href = `/events/${eventId}`}
                      disabled={loading}
                    >
                      Cancel
                    </SecondaryButton>
                    <PrimaryButton
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    >
                      {loading ? 'Updating...' : 'Update Event'}
                    </PrimaryButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </StyledPaper>
        </Container>
      </PageContainer>
    </>
  );
};

// Make component available globally for the simple HTML page
window.EditEventPage = EditEventPage;

export default EditEventPage; 