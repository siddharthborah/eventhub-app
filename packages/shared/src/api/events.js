// Shared API calls for events
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const eventsAPI = {
  // Get all events with pagination
  async getEvents(page = 1, limit = 10) {
    const response = await fetch(`${BASE_URL}/api/events?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return response.json();
  },

  // Get public events
  async getPublicEvents() {
    const response = await fetch(`${BASE_URL}/api/events/public`);
    if (!response.ok) {
      throw new Error('Failed to fetch public events');
    }
    return response.json();
  },

  // Get upcoming events
  async getUpcomingEvents() {
    const response = await fetch(`${BASE_URL}/api/events/upcoming`);
    if (!response.ok) {
      throw new Error('Failed to fetch upcoming events');
    }
    return response.json();
  },

  // Search events
  async searchEvents(query) {
    const response = await fetch(`${BASE_URL}/api/events/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search events');
    }
    return response.json();
  },

  // Get single event
  async getEvent(id) {
    const response = await fetch(`${BASE_URL}/api/events/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }
    return response.json();
  },

  // Create event
  async createEvent(eventData) {
    const response = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
    return response.json();
  },

  // Update event
  async updateEvent(id, eventData) {
    const response = await fetch(`${BASE_URL}/api/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      throw new Error('Failed to update event');
    }
    return response.json();
  },

  // Delete event
  async deleteEvent(id) {
    const response = await fetch(`${BASE_URL}/api/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
    return response.json();
  },
}; 