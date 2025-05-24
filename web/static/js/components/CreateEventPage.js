import React, { useState } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: theme.spacing(3, 0),
}));

const Header = styled(Box)(({ theme }) => ({
  background: 'white',
  borderRadius: '16px',
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
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

const CreateEventPage = ({ userId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Format current date for datetime-local input
  const now = new Date();
  const defaultDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    event_date: defaultDateTime,
    image: '',
    event_type: 'birthday',
    is_public: true,
    max_attendees: 0,
    status: 'draft',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    <PageContainer>
      <Container maxWidth="md">
        {/* Header */}
        <Header>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#667eea',
              fontSize: '24px',
            }}
          >
            EventHub
          </Typography>
          <SecondaryButton
            onClick={() => window.location.href = '/events'}
            startIcon={<ArrowBackIcon />}
          >
            Back to Events
          </SecondaryButton>
        </Header>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <StyledPaper>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>
              Create New Event 🎉
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Fill in the details for your amazing event
            </Typography>
          </Box>

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

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={handleChange('status')}
                    label="Status"
                  >
                    <MenuItem value="draft">📝 Draft</MenuItem>
                    <MenuItem value="published">✅ Published</MenuItem>
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
                <TextField
                  fullWidth
                  label="Venue"
                  value={formData.venue}
                  onChange={handleChange('venue')}
                  placeholder="e.g., Central Park, 123 Main St"
                />
              </Grid>

              {/* Additional Settings */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mt: 2 }}>
                  Additional Settings
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Attendees"
                  type="number"
                  value={formData.max_attendees}
                  onChange={handleChange('max_attendees')}
                  placeholder="0 for unlimited"
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Event Image URL"
                  value={formData.image}
                  onChange={handleChange('image')}
                  placeholder="https://example.com/image.jpg"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_public}
                      onChange={handleChange('is_public')}
                      color="primary"
                    />
                  }
                  label="Make this event public"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  Public events can be discovered by other users
                </Typography>
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
  );
};

export default CreateEventPage; 