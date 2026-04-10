const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validation');

// Protected Routes
router.post('/', authMiddleware, validateBooking, bookingController.createBooking);
router.get('/user', authMiddleware, bookingController.getUserBookings);
router.get('/:id', authMiddleware, bookingController.getBooking);
router.put('/:id/status', authMiddleware, bookingController.updateBookingStatus);
router.put('/:id/cancel', authMiddleware, bookingController.cancelBooking);

module.exports = router;
