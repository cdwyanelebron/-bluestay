const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Calculate total price with service fee
const calculateTotalPrice = (nightlyRate, numberOfNights, serviceFeePct = 0.1) => {
  const subtotal = nightlyRate * numberOfNights;
  const serviceFee = subtotal * serviceFeePct;
  return {
    subtotal,
    serviceFee,
    total: subtotal + serviceFee,
  };
};

// Check for date conflicts
const hasDateConflict = (startDate, endDate, unavailableDates) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return unavailableDates.some(period => {
    const periodStart = new Date(period.startDate);
    const periodEnd = new Date(period.endDate);
    return start < periodEnd && end > periodStart;
  });
};

// Calculate number of nights
const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Validate email
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Format response
const successResponse = (data, message = 'Success') => {
  return { success: true, message, data };
};

const errorResponse = (message, code = 500) => {
  return { success: false, message, code };
};

module.exports = {
  generateToken,
  calculateTotalPrice,
  hasDateConflict,
  calculateNights,
  validateEmail,
  successResponse,
  errorResponse,
};
