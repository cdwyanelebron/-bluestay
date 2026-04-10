# BlueStay Backend API

Production-ready Node.js + Express backend for BlueStay rental marketplace.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and update:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bluestay
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Start Server
```bash
npm start          # Production
npm run dev        # Development (with nodemon)
```

Server runs on `http://localhost:5000`

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (protected)

### Listings
- `GET /api/listings` - Get all listings (public, with pagination & filters)
- `GET /api/listings/:id` - Get single listing (public)
- `POST /api/listings` - Create listing (protected, host only)
- `PUT /api/listings/:id` - Update listing (protected, host only)
- `DELETE /api/listings/:id` - Delete listing (protected, host only)
- `GET /api/listings/host/my-listings` - Get host's listings (protected)

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/user` - Get user's bookings (protected)
- `GET /api/bookings/:id` - Get booking details (protected)
- `PUT /api/bookings/:id/status` - Update booking status (protected, host only)
- `PUT /api/bookings/:id/cancel` - Cancel booking (protected)

### Payments
- `POST /api/payments` - Create payment (protected)
- `GET /api/payments/user` - Get user's payments (protected)
- `GET /api/payments/:id` - Get payment details (protected)
- `POST /api/payments/:id/refund` - Refund payment (protected)

### Reviews
- `GET /api/reviews/listing/:listingId` - Get listing reviews (public)
- `POST /api/reviews` - Create review (protected)
- `GET /api/reviews/host` - Get host reviews (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)
- `POST /api/reviews/:id/helpful` - Mark review helpful (protected)

### Chat
- `GET /api/chat/conversations` - Get conversations (protected)
- `POST /api/chat/conversations` - Create conversation (protected)
- `GET /api/chat/conversations/:conversationId/messages` - Get messages (protected)
- `POST /api/chat/messages` - Send message (protected)
- `PUT /api/chat/conversations/:conversationId/read` - Mark as read (protected)
- `DELETE /api/chat/conversations/:id` - Delete conversation (protected)

### Users
- `GET /api/users/:id/profile` - Get public profile (public)
- `GET /api/users/profile/me` - Get current user profile (protected)
- `PUT /api/users/profile/update` - Update profile (protected)
- `POST /api/users/saved` - Save listing (protected)
- `DELETE /api/users/saved/:listingId` - Unsave listing (protected)
- `GET /api/users/saved/list` - Get saved listings (protected)
- `POST /api/users/password/change` - Change password (protected)
- `DELETE /api/users/account/delete` - Delete account (protected)

---

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Database Schema

### Users
- email, password, name, phone, avatar, role, isVerified, bio, location, reviews, savedListings

### Listings
- title, description, price, location, amenities, images, maxGuests, bedrooms, bathrooms, category, host, rating, reviews, isAvailable, unavailableDates

### Bookings
- listing, guest, host, checkIn, checkOut, numberOfGuests, totalPrice, status, paymentStatus, paymentId, guestNotes, hostResponse, cancellationReason

### Payments
- booking, user, amount, currency, paymentMethod, status, transactionId, paymentGateway, receipt

### Reviews
- listing, booking, reviewer, reviewee, rating, title, comment, cleanliness, accuracy, communication, location, value, images, helpful, type

### Conversations & Messages
- conversation contains participants, listing, lastMessage, lastMessageAt
- message contains conversation, sender, content, attachment, isRead

---

## Features

✓ User authentication with JWT
✓ Role-based authorization (guest, host, admin)
✓ Listing management with date conflict detection
✓ Booking system with automatic pricing calculation
✓ Payment processing integration ready
✓ Review system with ratings
✓ Real-time chat system ready
✓ Saved listings functionality
✓ Password hashing with bcryptjs
✓ Input validation
✓ Error handling

---

## Integration with Frontend

Frontend API calls should use:
- Base URL: `http://localhost:5000/api`
- Include JWT token in Authorization header after login
- Handle error responses and loading states

Example:
```javascript
const response = await fetch('http://localhost:5000/api/listings', {
  headers: { 'Authorization': 'Bearer ' + token }
});
```

---

## Production Deployment

1. Update `.env` with production values
2. Use MongoDB Atlas or managed database
3. Implement payment gateway integration (GCash, Maya)
4. Add email notifications
5. Enable HTTPS
6. Set up logging and monitoring
7. Deploy to Cloud (Heroku, AWS, Vercel, etc.)

---

## License

ISC
