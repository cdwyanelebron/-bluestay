## BlueStay Backend - Quick Reference Guide

### Installation & Setup

```bash
cd backend
npm install
cp .env.example .env
node seed.js
npm run dev
```

---

### File Organization

| File | Purpose |
|------|---------|
| `server.js` | Express app initialization, routes, middleware |
| `controllers/*` | Business logic for each feature |
| `models/*` | MongoDB schemas |
| `routes/*` | API endpoint definitions |
| `middleware/auth.js` | JWT verification |
| `utils/helpers.js` | Reusable functions |
| `seed.js` | Sample data insertion |
| `FRONTEND_INTEGRATION.js` | Frontend API client code |

---

### Core API Endpoints Summary

**Auth**: `/api/auth` (register, login, logout, me)
**Listings**: `/api/listings` (CRUD operations)
**Bookings**: `/api/bookings` (create, manage, cancel)
**Payments**: `/api/payments` (create, process, refund)
**Reviews**: `/api/reviews` (create, read, update)
**Chat**: `/api/chat` (conversations, messages)
**Users**: `/api/users` (profile, saved listings, settings)

---

### Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bluestay
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

---

### Authentication Flow

1. **Register**: POST `/api/auth/register` → Returns JWT token
2. **Login**: POST `/api/auth/login` → Returns JWT token  
3. **Store**: Save token in `localStorage.setItem('authToken', token)`
4. **Use**: Add to headers: `Authorization: Bearer <token>`
5. **Verify**: Server validates token with `authMiddleware`

---

### Booking Flow

1. User views listing details: `GET /api/listings/:id`
2. User selects dates → Check conflicts (backend validates)
3. User creates booking: `POST /api/bookings`
   - Backend calculates total price
   - Checks date conflicts
   - Validates guest capacity
4. Booking returned with pricing breakdown
5. User creates payment: `POST /api/payments`
6. Booking status changes to "confirmed"

---

### Database Relationships

```
User (host)
  ├── owns → Listing
  │         ├── has → Review
  │         └── has → Booking
  │
Guest (user)
  ├── makes → Booking (request)
  │         └── has → Payment
  │         └── can → Review
  ├── participates in → Conversation
  └── saves → Listing (wishlist)
```

---

### Important Functions

**Calculate Booking Price**:
```javascript
const { calculateTotalPrice } = require('./utils/helpers');
const result = calculateTotalPrice(1200, 3); // ₱1200/night, 3 nights
// Returns: { subtotal: 3600, serviceFee: 360, total: 3960 }
```

**Check Date Conflicts**:
```javascript
const { hasDateConflict } = require('./utils/helpers');
const conflict = hasDateConflict('2024-04-15', '2024-04-18', unavailableDates);
```

**Generate JWT**:
```javascript
const { generateToken } = require('./utils/helpers');
const token = generateToken(userId, 'host');
```

---

### Frontend Integration

Use provided `FRONTEND_INTEGRATION.js` in your HTML:

```javascript
// Replace dummy API in index.html with:
const user = await AuthAPI.login(email, password);
const listings = await ListingsAPI.getAll({ category: 'beach', page: 1 });
const booking = await BookingsAPI.create(listingId, checkIn, checkOut, guests);
```

---

### Error Responses

| Status | Response |
|--------|----------|
| 400 | Bad Request - Missing/invalid data |
| 401 | Unauthorized - Invalid credentials |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal issue |

---

### Common Issues & Solutions

**CORS Error**: Update `CORS_ORIGIN` in `.env` to match frontend URL
**Auth Fails**: Check JWT token in Authorization header
**Date Conflict**: Backend checks `unavailableDates` array in listing
**Duplicate Booking**: Prevent same user booking same date twice (frontend validation)

---

### Payment Gateway Integration

Currently uses mock payment processor. To integrate GCash/Maya:

1. Replace payment creation with gateway API call
2. Store transaction ID and receipt
3. Verify payment status before confirming booking
4. Handle webhooks for async payments

---

### Next Steps for Production

1. Add email notifications (password reset, booking confirmation)
2. Integrate real payment gateway (GCash, Maya, Stripe)
3. Add image upload (AWS S3, Cloudinary)
4. Implement real-time chat (Socket.io)
5. Add admin dashboard endpoints
6. Set up logging (Winston, Sentry)
7. Add rate limiting (express-rate-limit)
8. Set up automated testing
9. Configure CI/CD pipeline
10. Deploy to production server

---

### Testing Sample Credentials

**Guest Account**:
- Email: guest@bluestay.com
- Password: password123
- Role: guest

**Host Account**:
- Email: host@bluestay.com  
- Password: password123
- Role: host

**Admin Account**:
- Email: admin@bluestay.com
- Password: password123
- Role: admin

---

### Backend-Frontend Connection

The frontend (`index.html`) needs to update its API calls from:
```javascript
// OLD - Dummy data
const API = { getListings: async () => [...] }

// NEW - Real backend
const listings = await ListingsAPI.getAll();
```

All functionality in the frontend is now ready to connect to this backend!
