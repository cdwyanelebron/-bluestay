const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  location: {
    city: String,
    barangay: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  amenities: [String],
  images: [String],
  maxGuests: Number,
  bedrooms: Number,
  bathrooms: Number,
  category: {
    type: String,
    enum: ['beach', 'staycation', 'apartment', 'budget', 'barkada', 'solo'],
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  }],
  isAvailable: {
    type: Boolean,
    default: true,
  },
  unavailableDates: [
    {
      startDate: Date,
      endDate: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Listing', listingSchema);
