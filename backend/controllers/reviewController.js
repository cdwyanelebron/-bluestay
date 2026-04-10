const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// Create Review
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, title, comment, cleanliness, accuracy, communication, location, value, type } = req.body;

    if (!bookingId || !rating || !type) {
      return res.status(400).json({ error: 'bookingId, rating, and type are required' });
    }

    // Get booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify authorization
    if (type === 'guest_to_host' && booking.guest.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only guest can review host' });
    }
    if (type === 'host_to_guest' && booking.host.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only host can review guest' });
    }

    // Create review
    const review = new Review({
      listing: booking.listing,
      booking: bookingId,
      reviewer: req.user.userId,
      reviewee: type === 'guest_to_host' ? booking.host : booking.guest,
      rating,
      title,
      comment,
      cleanliness,
      accuracy,
      communication,
      location,
      value,
      type,
    });

    await review.save();

    // Update listing rating
    const listing = await Listing.findById(booking.listing);
    const reviews = await Review.find({ listing: booking.listing });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    listing.rating = avgRating;
    listing.reviews.push(review._id);
    await listing.save();

    res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Listing Reviews
exports.getListingReviews = async (req, res) => {
  try {
    const { listingId } = req.params;

    const reviews = await Review.find({ listing: listingId })
      .populate('reviewer', 'name avatar');

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Host Reviews
exports.getHostReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.user.userId })
      .populate('reviewer', 'name avatar')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.status(200).json({
      reviews,
      stats: { avgRating, totalReviews: reviews.length },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Verify reviewer
    if (review.reviewer.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this review' });
    }

    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;

    await review.save();

    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Verify reviewer
    if (review.reviewer.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(id);

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark Review as Helpful
exports.markHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    res.status(200).json({ review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
