// Updated Payment Controller with Mock GCash/Maya
// File: /backend/controllers/paymentController.js (REPLACEMENT)

const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// Simulated GCash/Maya payment gateway
const PaymentGateway = {
  simulateGCash: async (amount) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `GC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          amount,
          status: 'completed',
        });
      }, 2000); // Simulate 2 second processing
    });
  },

  simulateMaya: async (amount) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `MY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          amount,
          status: 'completed',
        });
      }, 3000); // Simulate 3 second processing
    });
  },

  simulateCash: async (amount) => {
    return Promise.resolve({
      success: true,
      transactionId: `CASH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount,
      status: 'pending', // Cash payment pending until confirmed
    });
  },
};

// Create Payment
exports.createPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentMethod } = req.body;

    // Get booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify guest
    if (booking.guest.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to make payment for this booking' });
    }

    // Check if already paid
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Booking already paid' });
    }

    // Create payment record
    const payment = new Payment({
      booking: bookingId,
      user: req.user.userId,
      amount: booking.totalPrice,
      paymentMethod,
      status: 'pending',
      transactionId: `PENDING-${Date.now()}`,
    });

    await payment.save();

    // Process with appropriate gateway
    let gatewayResult;
    try {
      if (paymentMethod === 'gcash') {
        gatewayResult = await PaymentGateway.simulateGCash(booking.totalPrice);
      } else if (paymentMethod === 'maya') {
        gatewayResult = await PaymentGateway.simulateMaya(booking.totalPrice);
      } else if (paymentMethod === 'cash') {
        gatewayResult = await PaymentGateway.simulateCash(booking.totalPrice);
      } else {
        throw new Error('Invalid payment method');
      }

      // Update payment with gateway response
      payment.transactionId = gatewayResult.transactionId;
      payment.paymentGateway = paymentMethod;

      if (gatewayResult.status === 'completed') {
        payment.status = 'completed';
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
      } else if (gatewayResult.status === 'pending') {
        payment.status = 'pending';
        booking.paymentStatus = 'unpaid';
        booking.status = 'pending';
      }

      await payment.save();
      await booking.save();

      res.status(201).json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          payment,
          booking,
          gatewayResponse: {
            method: paymentMethod,
            transactionId: gatewayResult.transactionId,
            status: gatewayResult.status,
            amount: gatewayResult.amount,
          },
        },
      });
    } catch (paymentError) {
      payment.status = 'failed';
      await payment.save();

      res.status(400).json({
        success: false,
        message: 'Payment processing failed',
        data: { error: paymentError.message },
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get Payment
exports.getPayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id).populate('booking user');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Verify authorization
    if (payment.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this payment' });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// Get User Payments
exports.getUserPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user.userId })
      .populate('booking')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

// Refund Payment
exports.refundPayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Verify authorization
    if (payment.user.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to refund this payment' });
    }

    // Check if already refunded
    if (payment.status === 'refunded') {
      return res.status(400).json({ success: false, message: 'Payment already refunded' });
    }

    // Simulate refund processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    payment.status = 'refunded';
    await payment.save();

    // Update booking
    const booking = await Booking.findById(payment.booking);
    booking.paymentStatus = 'refunded';
    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment refunded successfully',
      data: { payment, booking },
    });
  } catch (error) {
    next(error);
  }
};
