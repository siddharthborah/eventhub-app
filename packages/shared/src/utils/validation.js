// Shared validation utilities
import { isValid, parseISO, isFuture } from 'date-fns';

export const validateEvent = (event) => {
  const errors = {};

  // Title validation
  if (!event.title || event.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (event.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (event.title.trim().length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  // Description validation
  if (event.description && event.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  // Date validation
  if (!event.event_date) {
    errors.event_date = 'Event date is required';
  } else {
    const eventDate = typeof event.event_date === 'string' 
      ? parseISO(event.event_date) 
      : event.event_date;
    
    if (!isValid(eventDate)) {
      errors.event_date = 'Invalid date format';
    } else if (!isFuture(eventDate)) {
      errors.event_date = 'Event date must be in the future';
    }
  }

  // Venue validation
  if (!event.venue || event.venue.trim().length === 0) {
    errors.venue = 'Venue is required';
  }

  // Event type validation
  const validEventTypes = ['birthday', 'wedding', 'anniversary', 'corporate', 'social', 'other'];
  if (!event.event_type || !validEventTypes.includes(event.event_type)) {
    errors.event_type = 'Valid event type is required';
  }

  // Max attendees validation
  if (event.max_attendees && (event.max_attendees < 1 || event.max_attendees > 10000)) {
    errors.max_attendees = 'Max attendees must be between 1 and 10,000';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return `${fieldName} is required`;
  }
  return null;
}; 