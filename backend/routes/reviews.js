const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/auth');
const { validateReview } = require('../middleware/validation');

// Public Routes
router.get('/listing/:listingId', reviewController.getListingReviews);

// Protected Routes
router.post('/', authMiddleware, validateReview, reviewController.createReview);
router.get('/host', authMiddleware, reviewController.getHostReviews);
router.put('/:id', authMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);
router.post('/:id/helpful', authMiddleware, reviewController.markHelpful);

module.exports = router;
