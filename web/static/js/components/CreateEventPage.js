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
    is_public: true,
    max_attendees: 0,
    status: 'published', // Default to published
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [showAdditionalSettings, setShowAdditionalSettings] = useState(false);

  // Load Google Maps API
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }

    // You need to set your Google Maps API key here
    // Get your API key from: https://console.cloud.google.com/apis/credentials
    // Make sure to enable Places API for your project
    const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';
    
    if (GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
      console.warn('Google Maps API key not configured. Set REACT_APP_GOOGLE_MAPS_API_KEY environment variable.');
      setMapsLoaded(false);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
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

  const eventTypes = [
    { value: 'birthday', label: '🎂 Birthday', icon: '🎂' },
    { value: 'anniversary', label: '💑 Anniversary', icon: '💑' },
    { value: 'house_party', label: '🏠 House Party', icon: '🏠' },
    { value: 'wedding', label: '💒 Wedding', icon: '💒' },
    { value: 'graduation', label: '🎓 Graduation', icon: '🎓' },
    { value: 'corporate', label: '🏢 Corporate Event', icon: '🏢' },
    { value: 'conference', label: '🎯 Conference', icon: '🎯' },
    { value: 'workshop', label: '🛠️ Workshop', icon: '🛠️' },
    { value: 'social', label: '🎉 Social Gathering', icon: '🎉' },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const eventData = {
        ...formData,
        user_id: userId,
        event_date: new Date(formData.event_date).toISOString(),
        max_attendees: parseInt(formData.max_attendees) || 0,
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      setSuccess(true);
      // Redirect to events page after 2 seconds
      setTimeout(() => {
        window.location.href = '/events';
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
                Redirecting to your events...
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

                <Grid item xs={12} sm={6}>
                  {mapsLoaded ? (
                    <GooglePlacesAutocomplete
                      fullWidth
                      label="Venue"
                      value={formData.venue}
                      onChange={handleChange('venue')}
                      placeholder="Search for venues, restaurants, parks..."
                      helperText="Start typing to search for places"
                    />
                  ) : (
                    <TextField
                      fullWidth
                      label="Venue"
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
                      onClick={() => window.location.href = '/events'}
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