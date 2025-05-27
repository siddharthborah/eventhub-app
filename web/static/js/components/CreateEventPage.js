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
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  IconButton,
  useTheme,
  useMediaQuery,
  Collapse,
  Divider,
  Card,
  CardMedia,
  Link,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  Save as SaveIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Settings as SettingsIcon,
  PhotoAlbum as PhotoAlbumIcon,
  CheckCircle as CheckCircleIcon
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

// Add missing styled components for detail sections
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

// Google Places Autocomplete Component
const GooglePlacesAutocomplete = ({ value, onChange, ...props }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [inputValue, setInputValue] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places || !inputRef.current) {
      // Google Maps API not loaded yet, or ref not available
      return;
    }

    // Initialize Google Places Autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['establishment', 'geocode'], // Common types for venues
        fields: ['name', 'formatted_address', 'geometry', 'place_id', 'types', 'business_status'],
        // componentRestrictions: { country: "us" }, // Optional: restrict to a country
      }
    );

    // Event listener for when a place is selected
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
        setInputValue(displayValue); // Update our local state for the input field
        if (typeof onChange === 'function') {
          onChange(venueData); // Pass the rich venue object to the parent
        }
      } else {
        // If place is not valid, or no details, pass current input text
        if (typeof onChange === 'function') {
          onChange(inputRef.current.value);
        }
      }
      setIsLoading(false);
    });

    return () => {
      // Clean up listeners when the component unmounts
      if (autocompleteRef.current) {
        window.google.maps.event.removeListener(placeChangedListener);
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        // The following line can cause issues if Google's dropdown is still present
        // const pacContainers = document.querySelectorAll('.pac-container');
        // pacContainers.forEach(container => container.remove());
      }
    };
  }, [onChange]); // Rerun effect if onChange prop changes

  // Effect to update inputValue if the external 'value' prop changes
  // This is important if the parent form resets or loads initial data
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value || '');
    }
  }, [value]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setIsLoading(newValue.length > 0); // Show loader while typing
    
    // If user is typing manually, we should still call onChange
    // but with the raw string, not a venue object.
    // The parent component's handleChange for 'venue' already handles this.
    if (typeof onChange === 'function') {
      onChange(newValue);
    }
  };
  
  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
        // Prevent form submission if user hits Enter in autocomplete input
        // Google's widget handles Enter to select the highlighted item
        const pacItemSelected = document.querySelector('.pac-item-selected');
        if(!pacItemSelected) { // if no item is selected, prevent form submission
            event.preventDefault();
        }
    }
    if (event.key === 'Escape') {
        setIsLoading(false);
    }
  };


  return (
    <TextField
      {...props} // Spread other props like label, fullWidth, etc.
      inputRef={inputRef} // Assign the ref to the underlying input element
      value={inputValue} // Controlled component
      onChange={handleInputChange}
      onKeyDown={handleInputKeyDown} // Handle Enter/Escape
      InputProps={{
        ...props.InputProps, // Merge existing InputProps if any
        startAdornment: (
          <LocationIcon sx={{ color: '#667eea', mr: 1 }} />
        ),
        endAdornment: isLoading ? (
          <CircularProgress size={20} sx={{ color: '#667eea' }} />
        ) : null,
      }}
      // Ensure browser's native autocomplete doesn't interfere
      autoComplete="off" 
      // Add a unique name to help differentiate from other autocompletes if necessary
      name="google-places-autocomplete-venue"
    />
  );
};

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

const CreateEventPage = ({ userId, userInfo }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Format default date for datetime-local input
  // Default to 1 week from now, at the next full hour
  const now = new Date();
  const futureDate = new Date(now.getTime());

  // Set date to 1 week from now
  futureDate.setDate(now.getDate() + 7);

  // Set time to the next full hour from the current time
  futureDate.setHours(now.getHours() + 1); // Move to the next hour block
  futureDate.setMinutes(0);                // Set minutes to 00
  futureDate.setSeconds(0);                // Set seconds to 00
  futureDate.setMilliseconds(0);           // Set milliseconds to 00

  // Adjust for timezone to get local time in ISO format YYYY-MM-DDTHH:mm for the input
  const localFutureDateTime = new Date(futureDate.getTime() - (futureDate.getTimezoneOffset() * 60000));
  const defaultDateTime = localFutureDateTime.toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    venueData: null, // Store additional venue information
    event_date: defaultDateTime,
    image: '',
    event_type: 'birthday',
    max_attendees: 0,
    is_public: true,
    status: 'published', // Default status
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState(eventTypeImages[formData.event_type]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [showAdditionalSettings, setShowAdditionalSettings] = useState(false);
  const [googlePhotosConnected, setGooglePhotosConnected] = useState(false); // New state
  const [googlePhotosEnabled, setGooglePhotosEnabled] = useState(false);

  // Effect to update image preview when event_type or custom image changes
  useEffect(() => {
    if (formData.image) {
      setImagePreviewUrl(formData.image);
    } else {
      setImagePreviewUrl(eventTypeImages[formData.event_type] || eventTypeImages.other);
    }
  }, [formData.event_type, formData.image]);

  // Load Google Maps API
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }

    // You need to set your Google Maps API key here
    // Get your API key from: https://console.cloud.google.com/apis/credentials
    // Make sure to enable Places API for your project
    const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key not configured. Set REACT_APP_GOOGLE_MAPS_API_KEY environment variable.');
      setMapsLoaded(false);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.setAttribute('loading', 'async');
    script.onload = () => setMapsLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Google Maps API. Check your API key and internet connection.');
      setMapsLoaded(false);
    };
    
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Check for Google Photos connection status from backend and URL parameters
  useEffect(() => {
    // 1. Check backend for persistent connection
    fetch('/api/user/google-photos-status')
      .then(res => res.json())
      .then(data => {
        if (data.connected) setGooglePhotosConnected(true);
      });

    // 2. Check URL params for immediate feedback after OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const googlePhotosConnected = urlParams.get('google_photos_connected');
    const googlePhotosError = urlParams.get('google_photos_error');
    
    if (googlePhotosConnected === 'true') {
      setGooglePhotosConnected(true);
      // Optional: Show success message
      console.log('Google Photos connected successfully!');
      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
    
    if (googlePhotosError) {
      // Handle error cases
      console.error('Google Photos connection error:', googlePhotosError);
      // You could show an error message to the user here
      alert(`Google Photos connection failed: ${googlePhotosError}`);
      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []); // Run only once when component mounts

  const eventTypes = [
    { value: 'birthday', label: '🎂 Birthday' },
    { value: 'anniversary', label: '💑 Anniversary' },
    { value: 'house_party', label: '🏠 House Party' },
    { value: 'wedding', label: '💒 Wedding' },
    { value: 'graduation', label: '🎓 Graduation' },
    { value: 'corporate', label: '🏢 Corporate Event' },
    { value: 'conference', label: '🎯 Conference' },
    { value: 'workshop', label: '🛠️ Workshop' },
    { value: 'social', label: '🎉 Social Gathering' },
    { value: 'other', label: '✨ Other' },
  ];

  const handleChange = (field) => (value) => {
    if (field === 'venue') {
      // Handle venue data from Google Places or regular text input
      if (typeof value === 'object' && value.address) {
        // From Google Places selection
        setFormData(prev => ({
          ...prev,
          venue: value.address,
          venueData: value,
        }));
      } else {
        // Regular text input or event object
        const inputValue = value?.target ? value.target.value : value;
        setFormData(prev => ({
          ...prev,
          venue: inputValue,
          venueData: null,
        }));
      }
    } else {
      // Handle other form fields
      const inputValue = value?.target ? (value.target.type === 'checkbox' ? value.target.checked : value.target.value) : value;
      setFormData(prev => ({
        ...prev,
        [field]: inputValue
      }));
    }
  };

  const handleGooglePhotosConnect = () => {
    const YOUR_GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const YOUR_REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;

    // Scopes for Google Photos API - requesting permission to create and share albums
    const scopes = [
      'https://www.googleapis.com/auth/photoslibrary.sharing',
      'https://www.googleapis.com/auth/photoslibrary.appendonly' // If you also want to allow the app to add items
    ];

    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${YOUR_GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(YOUR_REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scopes.join(' '))}` +
      `&access_type=offline` + // To get a refresh token
      `&prompt=consent`; // Forces the consent screen every time, useful for testing. Remove for production.

    window.location.href = oauthUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const eventDataToSubmit = { // Renamed to avoid confusion with global eventData
        ...formData,
        user_id: userId,
        event_date: new Date(formData.event_date).toISOString(),
        max_attendees: parseInt(formData.max_attendees) || 0,
      };

      // Add enhanced venue data if available from Google Places
      if (formData.venueData && typeof formData.venueData === 'object') {
        eventDataToSubmit.venue_name = formData.venueData.name || '';
        eventDataToSubmit.venue_place_id = formData.venueData.placeId || '';
        if (formData.venueData.coordinates) {
          eventDataToSubmit.venue_lat = formData.venueData.coordinates.lat || 0;
          eventDataToSubmit.venue_lng = formData.venueData.coordinates.lng || 0;
        }
      }
      // If formData.image is empty, it means the user is okay with the template image (or no image).
      // We are currently saving it as empty if no custom URL is provided.

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/user'; // Redirect to dashboard (or /events if preferred)
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageContainer>
        <Container maxWidth="md">
          <StyledPaper>
            <Box textAlign="center" py={6}>
              <Typography variant="h2" sx={{ fontSize: '4rem', mb: 2 }}>
                🎉
              </Typography>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>
                Event Created Successfully!
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Redirecting...
              </Typography>
              <CircularProgress size={30} sx={{ color: '#667eea' }} />
            </Box>
          </StyledPaper>
        </Container>
      </PageContainer>
    );
  }

  return (
    <>
      <SharedHeader currentPage="/create-event" userInfo={userInfo} />
      <PageContainer>
        <Container maxWidth="md">
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
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>
                    Create New Event
                  </Typography>
                  <Divider sx={{ mb: 2 }}/>
                </Grid>

                {/* Image Preview Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
                    Event Image
                  </Typography>
                  <Card sx={{ mb: 2, borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={imagePreviewUrl}
                      alt="Event image preview"
                      sx={{ objectFit: 'cover' }}
                      onError={(e) => {
                        // Fallback if image fails to load (e.g. bad custom URL or missing template)
                        e.target.onerror = null; // prevent infinite loop
                        e.target.src = eventTypeImages.other; 
                      }}
                    />
                  </Card>
                  <Typography variant="caption" color="text.secondary">
                    Select an event type to see a template image, or provide your own URL below.
                  </Typography>
                </Grid>
                {/* End Image Preview Section */}
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Title"
                    id="event-title"
                    name="title"
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
                    id="event-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange('description')}
                    multiline
                    rows={3}
                    placeholder="Tell people about your event..."
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="event-type-label">Event Type</InputLabel>
                    <Select
                      labelId="event-type-label"
                      id="event-type"
                      name="event_type"
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
                    id="event-date"
                    name="event_date"
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={handleChange('event_date')}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  {mapsLoaded ? (
                    <GooglePlacesAutocomplete
                      fullWidth
                      label="Venue"
                      id="event-venue-autocomplete"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange('venue')}
                      placeholder="Search for venues, restaurants, parks..."
                      helperText="Start typing to search for places"
                    />
                  ) : (
                    <TextField
                      fullWidth
                      label="Venue"
                      id="event-venue-manual"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange('venue')}
                      placeholder="e.g., Central Park, 123 Main St"
                      InputProps={{
                        startAdornment: <LocationIcon sx={{ color: '#667eea', mr: 1 }} />,
                      }}
                      helperText="Loading location search..."
                    />
                  )}
                </Grid>

                {/* Additional Settings - Collapsible Section Toggle */}
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
                      id="max-attendees"
                      name="max_attendees"
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
                      label="Event Image URL (Custom)"
                      id="event-image-url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange('image')}
                      placeholder="https://example.com/your-custom-image.jpg"
                      helperText="Leave empty to use template image based on event type."
                    />
                  </Collapse>
                </Grid>

                {/* Collapsed Content: Google Photos Connect */}
                <Grid item xs={12}>
                  <Collapse in={showAdditionalSettings} timeout="auto" unmountOnExit sx={{ width: '100%'}}>
                    <Box sx={{ mt: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            id="google-photos-enabled-switch"
                            name="google_photos_enabled"
                            checked={googlePhotosEnabled}
                            onChange={e => setGooglePhotosEnabled(e.target.checked)}
                            color="primary"
                          />
                        }
                        label={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Add Google Photo Album</Typography>}
                        sx={{ mb: googlePhotosEnabled ? 1 : 0 }}
                      />

                      {googlePhotosEnabled && (
                        <Box 
                          sx={{
                            mt: 1,
                            p: 2,
                            border: '1px solid',
                            borderColor: googlePhotosConnected ? 'success.main' : 'divider',
                            borderRadius: '8px',
                            backgroundColor: googlePhotosConnected ? 'rgba(76, 175, 80, 0.04)' : 'transparent'
                          }}
                        >
                          {googlePhotosConnected ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                Connected to Google Photos
                              </Typography>
                            </Box>
                          ) : (
                            <>
                              <Typography color="text.secondary" sx={{ mb: 1.5, fontSize: '0.9rem' }}>
                                Connect your Google Photos account to automatically create a shared album for this event. Guests will be able to view and add photos.
                              </Typography>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PhotoAlbumIcon />}
                                onClick={handleGooglePhotosConnect}
                              >
                                Connect Google Photos
                              </Button>
                            </>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box display="flex" gap={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                    <SecondaryButton
                      variant="outlined"
                      onClick={() => window.location.href = '/user'} // Redirect to dashboard
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
                      {loading ? 'Creating...' : 'Create Event'}
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

export default CreateEventPage; 