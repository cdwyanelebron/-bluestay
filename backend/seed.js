// Database Seeding Script
// Run: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});

    // Create sample users
    const users = await User.insertMany([
      {
        email: 'guest@bluestay.com',
        password: 'password123',
        name: 'Juan Dela Cruz',
        phone: '+63912345678',
        role: 'guest',
        isVerified: true,
        location: 'Manila, Philippines',
      },
      {
        email: 'host@bluestay.com',
        password: 'password123',
        name: 'Maria Garcia',
        phone: '+63987654321',
        role: 'host',
        isVerified: true,
        bio: 'Professional property manager',
        location: 'Los Baños, Laguna',
      },
      {
        email: 'admin@bluestay.com',
        password: 'password123',
        name: 'Admin User',
        phone: '+63900000000',
        role: 'admin',
        isVerified: true,
      },
    ]);

    console.log('✓ Users created:', users.length);

    // Create sample listings
    const listings = await Listing.insertMany([
      {
        title: 'Modern Apartment with Sea View',
        description: 'Beautiful apartment with modern amenities and sea view',
        price: 1200,
        location: {
          city: 'Los Baños',
          barangay: 'Batong Malake',
          address: '123 Main St, Los Baños, Laguna',
        },
        amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Parking'],
        images: [
          'https://via.placeholder.com/500x300?text=Apartment+View+1',
          'https://via.placeholder.com/500x300?text=Apartment+View+2',
        ],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        category: 'apartment',
        host: users[1]._id,
        rating: 4.8,
        isAvailable: true,
      },
      {
        title: 'Cozy Beach House',
        description: 'Perfect beach getaway with private beach access',
        price: 1500,
        location: {
          city: 'Batangas',
          barangay: 'Nasugbu',
          address: '456 Beach Rd, Nasugbu, Batangas',
        },
        amenities: ['WiFi', 'Air Conditioning', 'Beach Access', 'Kitchen'],
        images: [
          'https://via.placeholder.com/500x300?text=Beach+House+1',
          'https://via.placeholder.com/500x300?text=Beach+House+2',
        ],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        category: 'beach',
        host: users[1]._id,
        rating: 4.9,
        isAvailable: true,
      },
      {
        title: 'Budget-Friendly Dorm',
        description: 'Affordable solution for backpackers and solo travelers',
        price: 350,
        location: {
          city: 'Quezon City',
          barangay: 'Diliman',
          address: '789 Student Ave, QC',
        },
        amenities: ['WiFi', 'Shared Kitchen', 'Common Area'],
        images: [
          'https://via.placeholder.com/500x300?text=Dorm+1',
          'https://via.placeholder.com/500x300?text=Dorm+2',
        ],
        maxGuests: 1,
        bedrooms: 1,
        bathrooms: 1,
        category: 'budget',
        host: users[1]._id,
        rating: 4.5,
        isAvailable: true,
      },
      {
        title: 'Luxury Staycation Resort',
        description: 'Premium resort with world-class amenities',
        price: 3500,
        location: {
          city: 'Laguna',
          barangay: 'Santa Rosa',
          address: '999 Resort Blvd, Santa Rosa, Laguna',
        },
        amenities: [
          'WiFi',
          'Air Conditioning',
          'Pool',
          'Gym',
          'Restaurant',
          'Parking',
        ],
        images: [
          'https://via.placeholder.com/500x300?text=Resort+1',
          'https://via.placeholder.com/500x300?text=Resort+2',
        ],
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
        category: 'staycation',
        host: users[1]._id,
        rating: 4.9,
        isAvailable: true,
      },
    ]);

    console.log('✓ Listings created:', listings.length);

    // Create sample bookings
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 3);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + 3);

    const bookings = await Booking.insertMany([
      {
        listing: listings[0]._id,
        guest: users[0]._id,
        host: users[1]._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        numberOfGuests: 2,
        totalPrice: 3960,
        status: 'confirmed',
        paymentStatus: 'paid',
        guestNotes: 'Looking forward to the stay!',
      },
    ]);

    console.log('✓ Bookings created:', bookings.length);

    // Create sample reviews
    const reviews = await Review.insertMany([
      {
        listing: listings[0]._id,
        booking: bookings[0]._id,
        reviewer: users[0]._id,
        reviewee: users[1]._id,
        rating: 5,
        title: 'Excellent stay!',
        comment: 'Great property, very clean and well-maintained. Host is responsive.',
        cleanliness: 5,
        accuracy: 5,
        communication: 5,
        location: 4,
        value: 4,
        type: 'guest_to_host',
      },
    ]);

    console.log('✓ Reviews created:', reviews.length);

    // Update listings with reviews
    await Listing.findByIdAndUpdate(listings[0]._id, {
      reviews: reviews.map(r => r._id),
    });

    console.log('\n✅ Database seeding complete!');
    console.log('\n📝 Test Credentials:');
    console.log('Guest - Email: guest@bluestay.com, Password: password123');
    console.log('Host - Email: host@bluestay.com, Password: password123');
    console.log('Admin - Email: admin@bluestay.com, Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(seedDatabase);
