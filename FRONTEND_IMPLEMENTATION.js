// FRONTEND INTEGRATION IMPLEMENTATION EXAMPLES
// Copy these patterns into your index.html and replace corresponding sections

// ========== HOME PAGE - Load Listings ==========

async function renderHomePageWithAPI() {
  // Show loading skeleton
  document.getElementById('featured-listings').innerHTML = getLoadingSkeletons(3);
  document.getElementById('nearby-listings').innerHTML = getLoadingSkeletons(3);
  document.getElementById('trending-listings').innerHTML = getLoadingSkeletons(4);

  // Fetch featured listings
  const result = await ListingsService.getAll({ limit: 3 });

  if (result.success) {
    const featuredHtml = result.data.listings
      .map(listing => createListingCard(listing))
      .join('');
    document.getElementById('featured-listings').innerHTML = featuredHtml;
  } else {
    showError(result.error);
    document.getElementById('featured-listings').innerHTML =
      '<p class="text-center text-gray-600">Walang listings dito</p>';
  }

  // Fetch nearby listings with city filter
  const nearbyResult = await ListingsService.getAll({
    city: getUserCity(),
    limit: 3
  });

  if (nearbyResult.success) {
    const nearbyHtml = nearbyResult.data.listings
      .map(listing => createListingCard(listing))
      .join('');
    document.getElementById('nearby-listings').innerHTML = nearbyHtml;
  }

  // Fetch trending listings (highest rated)
  const trendingResult = await ListingsService.getAll({ limit: 4 });

  if (trendingResult.success) {
    const trendingHtml = trendingResult.data.listings
      .sort((a, b) => b.rating - a.rating)
      .map(listing => createListingCard(listing))
      .join('');
    document.getElementById('trending-listings').innerHTML = trendingHtml;
  }
}

// ========== LOGIN PAGE ==========

async function handleLoginSubmit(event) {
  event.preventDefault();

  const email = document.querySelector('[name="email"]').value;
  const password = document.querySelector('[name="password"]').value;

  // Show loading state
  const button = event.target.querySelector('button');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Logging in...';

  try {
    const result = await AuthService.login(email, password);

    if (result.success) {
      showSuccess('Welcome back!');
      // Automatically redirect after 1 second
      setTimeout(() => navigateTo('home'), 1000);
    } else {
      showError(result.error); // "Invalid email or password"
      button.disabled = false;
      button.textContent = originalText;
    }
  } catch (error) {
    showError('Network error. Please try again.');
    button.disabled = false;
    button.textContent = originalText;
  }
}

// ========== BOOKING FLOW ==========

async function handleBookNow(listingId) {
  if (!AuthService.isLoggedIn()) {
    showError('Please login first');
    navigateTo('home');
    return;
  }

  // Get check-in and check-out from form
  const checkIn = document.querySelector('[name="check-in"]').value;
  const checkOut = document.querySelector('[name="check-out"]').value;
  const numberOfGuests = parseInt(document.querySelector('[name="guests"]').value);

  // Show loading
  const button = event.target;
  button.disabled = true;
  button.textContent = 'Creating booking...';

  try {
    const result = await BookingsService.create({
      listingId,
      checkIn,
      checkOut,
      numberOfGuests,
      guestNotes: document.querySelector('[name="notes"]').value || '',
    });

    if (result.success) {
      // Store booking ID for payment
      window.currentBooking = result.data;

      // Display price breakdown
      displayPricingBreakdown(result.pricing);

      // Show payment modal
      showModal('payment-modal');

      showSuccess('Booking created! Proceed to payment.');
    } else {
      showError(result.error); // "Dates are not available" or other error
    }
  } catch (error) {
    showError('Failed to create booking. Please try again.');
  } finally {
    button.disabled = false;
    button.textContent = 'Book Now';
  }
}

// Display pricing breakdown
function displayPricingBreakdown(pricing) {
  const breakdownHtml = `
    <div class="space-y-2 pb-3 border-b">
      <div class="flex justify-between text-sm">
        <span>₱${pricing.nightly_rate} × ${pricing.nights} nights</span>
        <span class="font-semibold">₱${pricing.subtotal}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span>Service fee (10%)</span>
        <span class="font-semibold">₱${pricing.service_fee}</span>
      </div>
    </div>
    <div class="flex justify-between text-lg font-bold pt-3">
      <span>Total</span>
      <span class="text-blue-600">₱${pricing.total}</span>
    </div>
  `;
  document.getElementById('pricing-breakdown').innerHTML = breakdownHtml;
}

// ========== PAYMENT PROCESSING ==========

async function processPayment(paymentMethod) {
  if (!window.currentBooking) {
    showError('No booking found');
    return;
  }

  const bookingId = window.currentBooking._id;

  // Show processing modal
  showProcessingModal(paymentMethod);

  try {
    const result = await PaymentsService.initiate(bookingId, paymentMethod);

    if (result.success) {
      // Show success receipt
      showPaymentReceipt(result.data);

      // Reload bookings
      loadUserBookings();

      showSuccess('Payment successful! Your booking is confirmed.');

      // Close modal after 3 seconds
      setTimeout(() => {
        closeModal('payment-modal');
        navigateTo('bookings');
      }, 3000);
    } else {
      showError(result.error);
      closeProcessingModal();
    }
  } catch (error) {
    showError('Payment processing failed. Please try again.');
    closeProcessingModal();
  }
}

// Show payment receipt
function showPaymentReceipt(paymentData) {
  const receipt = `
    <div class="bg-green-50 p-4 rounded-lg mb-4">
      <h3 class="font-bold text-green-700 mb-2">✓ Payment Successful</h3>
      <div class="text-sm space-y-1 text-gray-700">
        <p><strong>Transaction ID:</strong> ${paymentData.payment.transactionId}</p>
        <p><strong>Method:</strong> ${paymentData.gatewayResponse.method.toUpperCase()}</p>
        <p><strong>Amount:</strong> ₱${paymentData.gatewayResponse.amount}</p>
        <p><strong>Status:</strong> ${paymentData.gatewayResponse.status}</p>
      </div>
    </div>
  `;
  document.getElementById('payment-receipt').innerHTML = receipt;
}

// ========== HOST DASHBOARD ==========

async function loadHostDashboard() {
  if (!AuthService.isLoggedIn()) {
    navigateTo('home');
    return;
  }

  // Show loading
  document.getElementById('host-listings').innerHTML = getLoadingSkeletons(2);
  document.getElementById('host-bookings').innerHTML = getLoadingSkeletons(3);

  try {
    // Load host's listings
    const listingsResult = await ListingsService.getMyListings();

    if (listingsResult.success) {
      const html = listingsResult.data
        .map(listing => createHostListingCard(listing))
        .join('');
      document.getElementById('host-listings').innerHTML = html;

      // Update earnings (mock calculation)
      const totalEarnings = listingsResult.data.reduce((sum, listing) => {
        return sum + (listing.price * 30); // Assume 30 nights booked
      }, 0);
      document.getElementById('total-earnings').textContent = `₱${totalEarnings}`;
    } else {
      showError(listingsResult.error);
    }

    // Load host's bookings
    const bookingsResult = await BookingsService.getAll();

    if (bookingsResult.success) {
      const hostBookings = bookingsResult.data.filter(b =>
        b.host._id === apiClient.getUserId()
      );

      const html = hostBookings
        .map(booking => createHostBookingCard(booking))
        .join('');
      document.getElementById('host-bookings').innerHTML = html;

      document.getElementById('active-bookings').textContent =
        hostBookings.filter(b => b.status === 'confirmed').length;
    }
  } catch (error) {
    showError('Failed to load dashboard');
  }
}

// Create host listing card with edit options
function createHostListingCard(listing) {
  return `
    <div class="listing-card p-4">
      <img src="${listing.images[0]}" alt="${listing.title}" class="h-40 w-full object-cover rounded mb-3">
      <h3 class="font-semibold">${listing.title}</h3>
      <p class="text-blue-600 font-bold">₱${listing.price}/night</p>
      <p class="text-sm text-gray-600">${listing.location.city}, ${listing.location.barangay}</p>
      <div class="flex gap-2 mt-3">
        <button class="flex-1 btn-secondary btn-small text-xs" onclick="editListing('${listing._id}')">Edit</button>
        <button class="flex-1 btn-danger btn-small text-xs" onclick="deleteListing('${listing._id}')">Delete</button>
      </div>
    </div>
  `;
}

// ========== USER PROFILE ==========

async function loadUserProfile() {
  try {
    const result = await UsersService.getProfile();

    if (result.success) {
      const user = result.data;

      // Update profile display
      document.getElementById('user-name').textContent = user.name;
      document.getElementById('user-avatar').textContent = user.avatar || '👤';
      document.getElementById('user-bio').textContent = user.bio || 'No bio';
      document.getElementById('user-location').textContent = user.location || 'Not specified';

      // Show verification badge if verified
      if (user.isVerified) {
        document.getElementById('verification-badge').style.display = 'inline';
      }

      // Load reviews if host
      if (user.role === 'host') {
        loadHostReviews();
      }
    } else {
      showError(result.error);
    }
  } catch (error) {
    showError('Failed to load profile');
  }
}

async function updateUserProfile() {
  const updates = {
    name: document.querySelector('[name="name"]').value,
    phone: document.querySelector('[name="phone"]').value,
    bio: document.querySelector('[name="bio"]').value,
    location: document.querySelector('[name="location"]').value,
  };

  const result = await UsersService.updateProfile(updates);

  if (result.success) {
    showSuccess('Profile updated!');
    loadUserProfile();
  } else {
    showError(result.error);
  }
}

// ========== REVIEWS ==========

async function submitReview(bookingId) {
  const rating = parseInt(document.querySelector('[name="rating"]').value);
  const title = document.querySelector('[name="title"]').value;
  const comment = document.querySelector('[name="comment"]').value;

  const result = await ReviewsService.create({
    bookingId,
    rating,
    title,
    comment,
    type: 'guest_to_host', // or 'host_to_guest'
  });

  if (result.success) {
    showSuccess('Review posted!');
    // Reload listing to show new review
    reloadCurrentListing();
  } else {
    showError(result.error);
  }
}

// ========== SAVED LISTINGS ==========

async function toggleSaveListing(listingId) {
  const button = event.target;
  const isSaved = button.classList.contains('saved');

  try {
    if (isSaved) {
      // Unsave
      const result = await UsersService.unsaveListing(listingId);
      if (result.success) {
        button.classList.remove('saved');
        button.textContent = '♡';
      }
    } else {
      // Save
      const result = await UsersService.saveListing(listingId);
      if (result.success) {
        button.classList.add('saved');
        button.textContent = '♥';
      }
    }
  } catch (error) {
    showError('Failed to save listing');
  }
}

// ========== UTILITY FUNCTIONS ==========

// Show error message
function showError(message) {
  const toast = document.createElement('div');
  toast.className = 'bg-red-500 text-white p-4 rounded fixed top-4 right-4 z-50';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// Show success message
function showSuccess(message) {
  const toast = document.createElement('div');
  toast.className = 'bg-green-500 text-white p-4 rounded fixed top-4 right-4 z-50';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// Get user's city (mock - in production, use geolocation/user preference)
function getUserCity() {
  return 'Los Baños'; // Default
}

// Create loading skeletons
function getLoadingSkeletons(count) {
  return Array(count)
    .fill(0)
    .map(() => `
      <div class="skeleton h-48 rounded-lg"></div>
    `)
    .join('');
}

// Create listing card
function createListingCard(listing) {
  return `
    <div class="listing-card cursor-pointer" onclick="viewListing('${listing._id}')">
      <img src="${listing.images[0] || listing.image}" alt="${listing.title}" class="w-full h-40 object-cover">
      <div class="p-3">
        <h3 class="font-semibold text-sm line-clamp-2">${listing.title}</h3>
        <p class="text-xs text-gray-600">${listing.location.city}, ${listing.location.barangay}</p>
        <div class="flex justify-between items-center mt-2">
          <span class="text-blue-600 font-bold">₱${listing.price}<span class="text-xs">/night</span></span>
          <span class="text-xs font-semibold">⭐ ${listing.rating}</span>
        </div>
      </div>
    </div>
  `;
}

// ========== PAGE INITIALIZATION ==========

// Call on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  if (!AuthService.isLoggedIn()) {
    // Show login prompt for protected pages
    const currentPage = getCurrentPage();
    if (['booking', 'profile', 'bookings'].includes(currentPage)) {
      showError('Please login to continue');
      navigateTo('home');
    }
  } else {
    // User is logged in - load user-specific data
    const result = await AuthService.getCurrentUser();
    if (result.success) {
      updateNavbarWithUser(result.data);
    }
  }

  // Load page-specific data
  const currentPage = getCurrentPage();
  if (currentPage === 'home') {
    renderHomePageWithAPI();
  } else if (currentPage === 'host-dashboard') {
    loadHostDashboard();
  } else if (currentPage === 'profile') {
    loadUserProfile();
  }
});
