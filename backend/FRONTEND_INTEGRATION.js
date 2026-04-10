// BlueStay Frontend-Backend API Integration Guide
// Add this to your frontend JavaScript to connect with the backend

const API_BASE_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');

// ===== API CLIENT =====

const APIClient = {
  // Set token after login
  setToken: (token) => {
    authToken = token;
    localStorage.setItem('authToken', token);
  },

  // Get token
  getToken: () => authToken,

  // Make authenticated request
  request: async (endpoint, method = 'GET', body = null) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API Error');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// ===== AUTH API =====

const AuthAPI = {
  register: async (email, password, name, role = 'guest') => {
    const response = await APIClient.request('/auth/register', 'POST', {
      email, password, name, role
    });
    APIClient.setToken(response.token);
    return response.user;
  },

  login: async (email, password) => {
    const response = await APIClient.request('/auth/login', 'POST', {
      email, password
    });
    APIClient.setToken(response.token);
    return response.user;
  },

  getCurrentUser: async () => {
    return await APIClient.request('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('authToken');
    authToken = null;
  },
};

// ===== LISTINGS API =====

const ListingsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await APIClient.request(`/listings?${params}`);
  },

  getById: async (id) => {
    return await APIClient.request(`/listings/${id}`);
  },

  create: async (listing) => {
    return await APIClient.request('/listings', 'POST', listing);
  },

  update: async (id, updates) => {
    return await APIClient.request(`/listings/${id}`, 'PUT', updates);
  },

  delete: async (id) => {
    return await APIClient.request(`/listings/${id}`, 'DELETE');
  },

  getMyListings: async () => {
    return await APIClient.request('/listings/host/my-listings');
  },
};

// ===== BOOKINGS API =====

const BookingsAPI = {
  create: async (listingId, checkIn, checkOut, numberOfGuests, guestNotes = '') => {
    return await APIClient.request('/bookings', 'POST', {
      listingId, checkIn, checkOut, numberOfGuests, guestNotes
    });
  },

  getUserBookings: async () => {
    return await APIClient.request('/bookings/user');
  },

  getById: async (id) => {
    return await APIClient.request(`/bookings/${id}`);
  },

  updateStatus: async (id, status, hostResponse = '') => {
    return await APIClient.request(`/bookings/${id}/status`, 'PUT', {
      status, hostResponse
    });
  },

  cancel: async (id, cancellationReason = '') => {
    return await APIClient.request(`/bookings/${id}/cancel`, 'PUT', {
      cancellationReason
    });
  },
};

// ===== PAYMENTS API =====

const PaymentsAPI = {
  create: async (bookingId, paymentMethod) => {
    return await APIClient.request('/payments', 'POST', {
      bookingId, paymentMethod
    });
  },

  getUserPayments: async () => {
    return await APIClient.request('/payments/user');
  },

  getById: async (id) => {
    return await APIClient.request(`/payments/${id}`);
  },

  refund: async (id) => {
    return await APIClient.request(`/payments/${id}/refund`, 'POST');
  },
};

// ===== REVIEWS API =====

const ReviewsAPI = {
  getListingReviews: async (listingId) => {
    return await APIClient.request(`/reviews/listing/${listingId}`);
  },

  create: async (bookingId, rating, title, comment, type) => {
    return await APIClient.request('/reviews', 'POST', {
      bookingId, rating, title, comment, type
    });
  },

  getHostReviews: async () => {
    return await APIClient.request('/reviews/host');
  },

  update: async (id, rating, title, comment) => {
    return await APIClient.request(`/reviews/${id}`, 'PUT', {
      rating, title, comment
    });
  },

  delete: async (id) => {
    return await APIClient.request(`/reviews/${id}`, 'DELETE');
  },

  markHelpful: async (id) => {
    return await APIClient.request(`/reviews/${id}/helpful`, 'POST');
  },
};

// ===== CHAT API =====

const ChatAPI = {
  getConversations: async () => {
    return await APIClient.request('/chat/conversations');
  },

  createConversation: async (recipientId, listingId = null) => {
    return await APIClient.request('/chat/conversations', 'POST', {
      recipientId, listingId
    });
  },

  getMessages: async (conversationId) => {
    return await APIClient.request(`/chat/conversations/${conversationId}/messages`);
  },

  sendMessage: async (conversationId, content) => {
    return await APIClient.request('/chat/messages', 'POST', {
      conversationId, content
    });
  },

  markAsRead: async (conversationId) => {
    return await APIClient.request(`/chat/conversations/${conversationId}/read`, 'PUT');
  },

  deleteConversation: async (id) => {
    return await APIClient.request(`/chat/conversations/${id}`, 'DELETE');
  },
};

// ===== USERS API =====

const UsersAPI = {
  getProfile: async () => {
    return await APIClient.request('/users/profile/me');
  },

  getPublicProfile: async (id) => {
    return await APIClient.request(`/users/${id}/profile`);
  },

  updateProfile: async (updates) => {
    return await APIClient.request('/users/profile/update', 'PUT', updates);
  },

  saveListing: async (listingId) => {
    return await APIClient.request('/users/saved', 'POST', { listingId });
  },

  unsaveListing: async (listingId) => {
    return await APIClient.request(`/users/saved/${listingId}`, 'DELETE');
  },

  getSavedListings: async () => {
    return await APIClient.request('/users/saved/list');
  },

  changePassword: async (oldPassword, newPassword) => {
    return await APIClient.request('/users/password/change', 'POST', {
      oldPassword, newPassword
    });
  },

  deleteAccount: async (password) => {
    return await APIClient.request('/users/account/delete', 'DELETE', { password });
  },
};

// ===== USAGE EXAMPLES IN FRONTEND =====

/*

// 1. LOGIN
async function handleLogin() {
  try {
    const user = await AuthAPI.login('user@example.com', 'password123');
    console.log('Logged in:', user);
  } catch (error) {
    console.error('Login failed:', error);
  }
}

// 2. GET LISTINGS
async function loadListings(filters) {
  try {
    const result = await ListingsAPI.getAll({
      category: 'beach',
      minPrice: 500,
      maxPrice: 2000,
      page: 1,
      limit: 12
    });
    console.log('Listings:', result.listings);
  } catch (error) {
    console.error('Failed to load listings:', error);
  }
}

// 3. CREATE BOOKING
async function handleBooking(listingId, checkIn, checkOut, guests) {
  try {
    const booking = await BookingsAPI.create(listingId, checkIn, checkOut, guests);
    console.log('Booking created:', booking);

    // Create payment
    const payment = await PaymentsAPI.create(booking.booking._id, 'gcash');
    console.log('Payment processed:', payment);
  } catch (error) {
    console.error('Booking failed:', error);
  }
}

// 4. SEND MESSAGE
async function sendMessage(conversationId, message) {
  try {
    const result = await ChatAPI.sendMessage(conversationId, message);
    console.log('Message sent:', result);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}

// 5. CREATE LISTING (HOST)
async function createListing(listingData) {
  try {
    const listing = await ListingsAPI.create({
      title: 'Modern Apartment',
      description: 'Beautiful modern apartment...',
      price: 1200,
      location: { city: 'Los Baños', barangay: 'Batong Malake' },
      amenities: ['WiFi', 'Aircon', 'Kitchen'],
      maxGuests: 4,
      category: 'apartment'
    });
    console.log('Listing created:', listing);
  } catch (error) {
    console.error('Failed to create listing:', error);
  }
}

// 6. SAVE LISTING (GUEST)
async function saveListing(listingId) {
  try {
    await UsersAPI.saveListing(listingId);
    console.log('Listing saved');
  } catch (error) {
    console.error('Failed to save listing:', error);
  }
}

// 7. CREATE REVIEW
async function submitReview(bookingId, rating, comment) {
  try {
    const review = await ReviewsAPI.create(bookingId, rating, 'Great stay!', comment, 'guest_to_host');
    console.log('Review created:', review);
  } catch (error) {
    console.error('Failed to create review:', error);
  }
}

*/

// INTEGRATION NOTE:
// Replace all API calls in the frontend index.html with these API functions
// Update the "API" object at the bottom of index.html with these implementations
// Ensure CORS is properly configured in backend for your frontend origin
