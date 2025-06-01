import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './components/LandingPage';
import UserDashboard from './components/UserDashboard';
import MyEventsPage from './components/MyEventsPage';
import CreateEventPage from './components/CreateEventPage';
import EditEventPage from './components/EditEventPage';
import EventDetailPage from './components/EventDetailPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50',
      light: '#34495E',
      dark: '#1A252F',
    },
    background: {
      default: '#F8F9FA',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 300,
    },
    h2: {
      fontWeight: 300,
    },
    h3: {
      fontWeight: 300,
    },
    button: {
      textTransform: 'none',
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
        },
      },
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container);

// Check page type and user data
const pageType = window.pageType;
const userData = window.userData;
const userId = window.userId;
const eventId = window.eventId;
const eventData = window.eventData;

// Determine which component to render
let ComponentToRender;
if (pageType === 'events') {
  ComponentToRender = <MyEventsPage userId={userId} userInfo={userData} />;
} else if (pageType === 'create-event') {
  ComponentToRender = <CreateEventPage userId={userId} userInfo={userData} />;
} else if (pageType === 'edit-event') {
  ComponentToRender = <EditEventPage userId={userId} userInfo={userData} eventId={eventId} eventData={eventData} />;
} else if (pageType === 'event-detail') {
  ComponentToRender = <EventDetailPage eventId={eventId} userInfo={userData} />;
} else if (userData) {
  ComponentToRender = <UserDashboard userData={userData} />;
} else {
  ComponentToRender = <LandingPage />;
}

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {ComponentToRender}
    </ThemeProvider>
  </React.StrictMode>
); 