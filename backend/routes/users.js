const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

// Public Routes
router.get('/:id/profile', userController.getPublicProfile);

// Protected Routes
router.get('/profile/me', authMiddleware, userController.getUserProfile);
router.put('/profile/update', authMiddleware, userController.updateProfile);
router.post('/saved', authMiddleware, userController.saveListing);
router.delete('/saved/:listingId', authMiddleware, userController.unsaveListing);
router.get('/saved/list', authMiddleware, userController.getSavedListings);
router.post('/password/change', authMiddleware, userController.changePassword);
router.delete('/account/delete', authMiddleware, userController.deleteAccount);

module.exports = router;
