### BlueStay Backend Architecture

```
backend/
├── server.js                  # Main entry point
├── package.json              # Dependencies
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── seed.js                   # Database seeding script
├── README.md                 # Setup & API docs
├── FRONTEND_INTEGRATION.js   # Frontend API client
│
├── controllers/
│   ├── authController.js     # Auth logic (register, login)
│   ├── listingController.js  # Listing CRUD + filtering
│   ├── bookingController.js  # Booking creation & management
│   ├── paymentController.js  # Payment processing
│   ├── reviewController.js   # Review management
│   ├── chatController.js     # Messaging system
│   └── userController.js     # User profile & settings
│
├── models/
│   ├── User.js               # User schema
│   ├── Listing.js            # Property listing schema
│   ├── Booking.js            # Booking schema
│   ├── Payment.js            # Payment schema
│   ├── Review.js             # Review schema
│   └── Chat.js               # Conversation & Message schemas
│
├── routes/
│   ├── auth.js               # Authentication endpoints
│   ├── listings.js           # Listing endpoints
│   ├── bookings.js           # Booking endpoints
│   ├── payments.js           # Payment endpoints
│   ├── reviews.js            # Review endpoints
│   ├── chat.js               # Chat endpoints
│   └── users.js              # User endpoints
│
├── middleware/
│   └── auth.js               # JWT verification & role checks
│
└── utils/
    └── helpers.js            # Utility functions
```

### Key Features

✅ **Authentication**
- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (guest, host, admin)
- Token expiration handling

✅ **Listings Management**
- Create, read, update, delete listings
- Advanced filtering (category, price, city, search)
- Pagination support
- Unavailable date tracking

✅ **Booking System**
- Date conflict detection
- Automatic pricing calculation (subtotal + service fee)
- Booking status workflow (pending → confirmed → completed)
- Guest capacity validation

✅ **Payments**
- Payment method selection (GCash, Maya, cash, credit card)
- Refund processing
- Transaction tracking
- Payment status management

✅ **Reviews & Ratings**
- Guest-to-host reviews
- Host-to-guest reviews
- 5-star rating system with detailed criteria
- Review editing and deletion
- Helpful review votes

✅ **Chat System**
- Real-time messaging ready
- Conversation management
- Message read status
- Multi-participant conversations

✅ **User Management**
- Profile creation and updates
- Saved listings (wishlist)
- Password change
- Account deletion
- Public profile viewing

### Database Models

All models use MongoDB with Mongoose:
- **Users**: Authentication, profile, saved listings
- **Listings**: Properties with details, availability
- **Bookings**: Reservations with pricing and status
- **Payments**: Transaction records
- **Reviews**: Ratings and feedback from users
- **Conversations**: Chat channels between users
- **Messages**: Individual messages in conversations

### API Response Format

Success Response:
```json
{
  "message": "Success",
  "data": { /* response data */ }
}
```

Error Response:
```json
{
  "error": "Error message"
}
```

### Security Features

✓ JWT tokens for API authentication
✓ Password hashing with bcryptjs
✓ Role-based authorization
✓ CORS configuration
✓ Input validation
✓ Error handling middleware
✓ No sensitive data in responses

### Ready for Integration

- Frontend API client included (FRONTEND_INTEGRATION.js)
- All endpoints match frontend requirements
- Sample data seeding script (seed.js)
- Modular, scalable architecture
- Ready for payment gateway integration
- Ready for email notifications
- Ready for real-time socket.io updates

### Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Seed database with sample data
node seed.js

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

### Deployment Checklist

- [ ] Update .env with production database URL
- [ ] Set strong JWT_SECRET in production
- [ ] Configure payment gateway (GCash API, Maya API)
- [ ] Set up email service (SendGrid, AWS SES)
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure production CORS_ORIGIN
- [ ] Set up logging and monitoring
- [ ] Add rate limiting and DDoS protection
- [ ] Test all API endpoints
- [ ] Set up automated backups
- [ ] Deploy to production (Heroku, AWS, DigitalOcean)

### Frontend Integration Example

```javascript
// Use the provided API client in FRONTEND_INTEGRATION.js
const user = await AuthAPI.login(email, password);
const listings = await ListingsAPI.getAll({ category: 'beach' });
const booking = await BookingsAPI.create(listingId, checkIn, checkOut, guests);
const payment = await PaymentsAPI.create(bookingId, 'gcash');
```

All frontend API calls from index.html should be updated to use these backend endpoints.
