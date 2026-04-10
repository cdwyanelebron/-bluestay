// Updated Bookings Controller with Response Formatting
// File: /backend/controllers/bookingController.js (REPLACEMENT)

const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { calculateTotalPrice, hasDateConflict, calculateNights } = require('../utils/helpers');

// Create Booking
exports.createBooking = async (req, res, next) => {
  try {
    const { listingId, checkIn, checkOut, numberOfGuests, guestNotes } = req.body;

    // Get listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Check date conflicts
    if (hasDateConflict(checkIn, checkOut, listing.unavailableDates)) {
      return res.status(400).json({ success: false, message: 'Dates are not available for this listing' });
    }

    // Check guest limit
    if (numberOfGuests > listing.maxGuests) {
      return res.status(400).json({
        success: false,
        message: `Exceeds maximum guest capacity. Max guests: ${listing.maxGuests}`,
      });
    }

    // Calculate total price
    const nights = calculateNights(checkIn, checkOut);
    const priceData = calculateTotalPrice(listing.price, nights);

    // Create booking
    const booking = new Booking({
      listing: listingId,
      guest: req.user.userId,
      host: listing.host,
      checkIn,
      checkOut,
      numberOfGuests,
      totalPrice: priceData.total,
      guestNotes,
      status: 'pending',
    });

    await booking.save();
    await booking.populate('listing guest host');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully. Please proceed to payment.',
      data: {
        booking,
        priceBreakdown: {
          nightly_rate: listing.price,
          nights,
          subtotal: priceData.subtotal,
          service_fee: priceData.serviceFee,
          total: priceData.total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get User Bookings
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      $or: [
        { guest: req.user.userId },
        { host: req.user.userId }
      ]
    })
      .populate('listing host guest')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Booking
exports.getBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('listing host guest');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify authorization
    if (booking.guest._id.toString() !== req.user.userId && booking.host._id.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking retrieved successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Update Booking Status (Host)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, hostResponse } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify host ownership
    if (booking.host.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
    }

    if (status) booking.status = status;
    if (hostResponse) booking.hostResponse = hostResponse;

    // Mark unavailable dates on listing
    if (status === 'confirmed') {
      const listing = await Listing.findById(booking.listing);
      listing.unavailableDates.push({
        startDate: booking.checkIn,
        endDate: booking.checkOut,
      });
      await listing.save();
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify authorization
    if (booking.guest.toString() !== req.user.userId && booking.host.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    // Check if already cancelled or completed
    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking` });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason || 'No reason provided';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
