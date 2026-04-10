const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { authMiddleware, hostMiddleware } = require('../middleware/auth');
const { validateListing } = require('../middleware/validation');

// Public Routes
router.get('/', listingController.getListings);
router.get('/:id', listingController.getListing);

// Protected Routes (Host Only)
router.post('/', authMiddleware, hostMiddleware, validateListing, listingController.createListing);
router.put('/:id', authMiddleware, hostMiddleware, validateListing, listingController.updateListing);
router.delete('/:id', authMiddleware, hostMiddleware, listingController.deleteListing);
router.get('/host/my-listings', authMiddleware, hostMiddleware, listingController.getHostListings);

module.exports = router;
