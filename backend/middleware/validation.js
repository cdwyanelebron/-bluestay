// Backend Validation Middleware
// File: /backend/middleware/validation.js

const validateBooking = (req, res, next) => {
  const { listingId, checkIn, checkOut, numberOfGuests } = req.body;

  if (!listingId) {
    return res.status(400).json({ error: 'listingId is required' });
  }

  if (!checkIn || !checkOut) {
    return res.status(400).json({ error: 'checkIn and checkOut are required' });
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return res.status(400).json({ error: 'Check-in date cannot be in the past' });
  }

  if (end <= start) {
    return res.status(400).json({ error: 'Check-out must be after check-in' });
  }

  if (!numberOfGuests || numberOfGuests < 1) {
    return res.status(400).json({ error: 'numberOfGuests must be at least 1' });
  }

  next();
};

const validateListing = (req, res, next) => {
  const { title, price, location } = req.body;

  if (!title || title.trim().length < 5) {
    return res.status(400).json({
      error: 'Title must be at least 5 characters long',
    });
  }

  if (!price || price < 100) {
    return res.status(400).json({
      error: 'Price must be at least 100',
    });
  }

  if (!location || !location.city || !location.barangay) {
    return res.status(400).json({
      error: 'Location (city and barangay) is required',
    });
  }

  next();
};

const validateReview = (req, res, next) => {
  const { bookingId, rating, type } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: 'bookingId is required' });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      error: 'Rating must be between 1 and 5',
    });
  }

  if (!type || !['guest_to_host', 'host_to_guest'].includes(type)) {
    return res.status(400).json({
      error: 'Invalid review type',
    });
  }

  next();
};

const validatePayment = (req, res, next) => {
  const { bookingId, paymentMethod } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: 'bookingId is required' });
  }

  const validMethods = ['gcash', 'maya', 'cash', 'credit_card', 'bank_transfer'];
  if (!paymentMethod || !validMethods.includes(paymentMethod)) {
    return res.status(400).json({
      error: 'Invalid payment method',
    });
  }

  next();
};

const validateProfileUpdate = (req, res, next) => {
  const { name, phone, email } = req.body;

  if (name && name.trim().length < 2) {
    return res.status(400).json({
      error: 'Name must be at least 2 characters',
    });
  }

  if (phone && !/^\+?[0-9]{10,}$/.test(phone.replace(/\s/g, ''))) {
    return res.status(400).json({
      error: 'Invalid phone number',
    });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      error: 'Invalid email format',
    });
  }

  next();
};

module.exports = {
  validateBooking,
  validateListing,
  validateReview,
  validatePayment,
  validateProfileUpdate,
};
