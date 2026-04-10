const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/auth');
const { validatePayment } = require('../middleware/validation');

// Protected Routes
router.post('/', authMiddleware, validatePayment, paymentController.createPayment);
router.get('/user', authMiddleware, paymentController.getUserPayments);
router.get('/:id', authMiddleware, paymentController.getPayment);
router.post('/:id/refund', authMiddleware, paymentController.refundPayment);

module.exports = router;
