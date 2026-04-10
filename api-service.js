// API Service - Frontend ↔ Backend Integration
// Place this in a separate file: api-service.js
// Or replace the API object in index.html with this

const API_BASE_URL = 'http://localhost:5000/api';

// ===== API CLIENT WITH INTERCEPTORS =====

class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  async request(endpoint, method = 'GET', body = null) {
    const url = `${this.baseURL}${endpoint}`;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add token if available
    if (this.token) {
      options.headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Add body if provided
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      // Handle unauthorized (token expired)
      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.error || 'API Error',
          data: data,
        };
      }

      return data;
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }
}

const apiClient = new APIClient();

// ===== AUTH SERVICE =====

const AuthService = {
  async register(email, password, name, role = 'guest') {
    try {
      const response = await apiClient.request('/auth/register', 'POST', {
        email,
        password,
        name,
        role,
      });
      apiClient.setToken(response.token);
      return { success: true, user: response.user, token: response.token };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async login(email, password) {
    try {
      const response = await apiClient.request('/auth/login', 'POST', {
        email,
        password,
      });
      apiClient.setToken(response.token);
      return { success: true, user: response.user, token: response.token };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.request('/auth/me', 'GET');
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  logout() {
    apiClient.clearToken();
    return { success: true };
  },

  isLoggedIn() {
    return !!apiClient.getToken();
  },
};

// ===== LISTINGS SERVICE =====

const ListingsService = {
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await apiClient.request(
        `/listings?${params.toString()}`,
        'GET'
      );
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.request(`/listings/${id}`, 'GET');
      return { success: true, data: response.listing };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async create(listing) {
    try {
      const response = await apiClient.request(
        '/listings',
        'POST',
        listing
      );
      return { success: true, data: response.listing };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async update(id, listing) {
    try {
      const response = await apiClient.request(
        `/listings/${id}`,
        'PUT',
        listing
      );
      return { success: true, data: response.listing };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async delete(id) {
    try {
      await apiClient.request(`/listings/${id}`, 'DELETE');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getMyListings() {
    try {
      const response = await apiClient.request(
        '/listings/host/my-listings',
        'GET'
      );
      return { success: true, data: response.listings };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ===== BOOKINGS SERVICE =====

const BookingsService = {
  async create(bookingData) {
    try {
      const response = await apiClient.request(
        '/bookings',
        'POST',
        bookingData
      );
      return {
        success: true,
        data: response.booking,
        pricing: response.priceBreakdown,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getAll() {
    try {
      const response = await apiClient.request('/bookings/user', 'GET');
      return { success: true, data: response.bookings };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.request(`/bookings/${id}`, 'GET');
      return { success: true, data: response.booking };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateStatus(id, status, hostResponse = '') {
    try {
      const response = await apiClient.request(
        `/bookings/${id}/status`,
        'PUT',
        { status, hostResponse }
      );
      return { success: true, data: response.booking };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async cancel(id, reason = '') {
    try {
      await apiClient.request(`/bookings/${id}/cancel`, 'PUT', {
        cancellationReason: reason,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ===== PAYMENTS SERVICE =====

const PaymentsService = {
  async initiate(bookingId, paymentMethod) {
    try {
      const response = await apiClient.request('/payments', 'POST', {
        bookingId,
        paymentMethod,
      });
      return { success: true, data: response.payment };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getAll() {
    try {
      const response = await apiClient.request('/payments/user', 'GET');
      return { success: true, data: response.payments };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.request(`/payments/${id}`, 'GET');
      return { success: true, data: response.payment };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async refund(id) {
    try {
      await apiClient.request(`/payments/${id}/refund`, 'POST');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ===== REVIEWS SERVICE =====

const ReviewsService = {
  async create(reviewData) {
    try {
      const response = await apiClient.request('/reviews', 'POST', reviewData);
      return { success: true, data: response.review };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getListingReviews(listingId) {
    try {
      const response = await apiClient.request(
        `/reviews/listing/${listingId}`,
        'GET'
      );
      return { success: true, data: response.reviews };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getHostReviews() {
    try {
      const response = await apiClient.request('/reviews/host', 'GET');
      return { success: true, data: response.reviews, stats: response.stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async delete(id) {
    try {
      await apiClient.request(`/reviews/${id}`, 'DELETE');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ===== CHAT SERVICE =====

const ChatService = {
  async getConversations() {
    try {
      const response = await apiClient.request('/chat/conversations', 'GET');
      return { success: true, data: response.conversations };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async createConversation(recipientId, listingId = null) {
    try {
      const response = await apiClient.request(
        '/chat/conversations',
        'POST',
        { recipientId, listingId }
      );
      return { success: true, data: response.conversation };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getMessages(conversationId) {
    try {
      const response = await apiClient.request(
        `/chat/conversations/${conversationId}/messages`,
        'GET'
      );
      return { success: true, data: response.messages };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async sendMessage(conversationId, content) {
    try {
      const response = await apiClient.request('/chat/messages', 'POST', {
        conversationId,
        content,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async deleteConversation(id) {
    try {
      await apiClient.request(`/chat/conversations/${id}`, 'DELETE');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ===== USERS SERVICE =====

const UsersService = {
  async getProfile() {
    try {
      const response = await apiClient.request('/users/profile/me', 'GET');
      return { success: true, data: response.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateProfile(updates) {
    try {
      const response = await apiClient.request(
        '/users/profile/update',
        'PUT',
        updates
      );
      return { success: true, data: response.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async saveListing(listingId) {
    try {
      await apiClient.request('/users/saved', 'POST', { listingId });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async unsaveListing(listingId) {
    try {
      await apiClient.request(`/users/saved/${listingId}`, 'DELETE');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getSavedListings() {
    try {
      const response = await apiClient.request('/users/saved/list', 'GET');
      return { success: true, data: response.listings };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async changePassword(oldPassword, newPassword) {
    try {
      await apiClient.request('/users/password/change', 'POST', {
        oldPassword,
        newPassword,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async deleteAccount(password) {
    try {
      await apiClient.request('/users/account/delete', 'DELETE', {
        password,
      });
      this.logout();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ===== IMAGE UPLOAD SERVICE =====

const ImageService = {
  async uploadToCloudinary(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'bluestay_listings');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (!data.secure_url) throw new Error('Upload failed');

      return { success: true, url: data.secure_url };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ===== EXPORT ALL SERVICES =====

const API = {
  auth: AuthService,
  listings: ListingsService,
  bookings: BookingsService,
  payments: PaymentsService,
  reviews: ReviewsService,
  chat: ChatService,
  users: UsersService,
  images: ImageService,
  client: apiClient,
};

// Make available globally
window.API = API;
