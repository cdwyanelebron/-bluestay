# BlueStay Frontend ↔ Backend Integration Notes

## Setup Instructions

### 1. Frontend Setup
- Include `api-service.js` before `index.html` closes
```html
<script src="api-service.js"></script>
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
node seed.js
npm run dev
```

### 3. Update Frontend API Calls
Replace dummy API calls with new service:

**OLD:**
```javascript
const result = await API.getListings();
```

**NEW:**
```javascript
const result = await ListingsService.getAll();
if (result.success) {
  // Use result.data
}
```

---

## API Response Format

All responses follow this structure:

### Success (200-201)
```json
{
  "success": true,
  "message": "Operation completed",
  "data": { /* actual data */ }
}
```

### Error (400-500)
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

---

## Authentication Flow

1. **Register/Login**: Returns token
```javascript
const result = await AuthService.register(email, password, name);
if (result.success) {
  // Token automatically stored in localStorage
  // Use result.user data
}
```

2. **Protected Routes**: Token automatically added to headers
```javascript
// No need to manually add token - APIClient handles it
const bookings = await BookingsService.getAll();
```

3. **Token Expiry**: Auto-logout on 401
```javascript
// If token expires, user auto-redirected to home
```

---

## Key API Services Architecture

### Service Objects
- `AuthService` - Login, register, logout
- `ListingsService` - Browse, create, update listings
- `BookingsService` - Create, manage bookings
- `PaymentsService` - Process payments
- `ReviewsService` - Create, read reviews
- `ChatService` - Messages, conversations
- `UsersService` - Profile management
- `ImageService` - Image uploads (Cloudinary)

### Error Handling
```javascript
const result = await ListingsService.getAll();
if (!result.success) {
  console.error(result.error); // Display error to user
}
```

---

## Frontend Integration Checklist

### Login/Registration Page
- [ ] Use `AuthService.login()` / `AuthService.register()`
- [ ] Store token automatically on success
- [ ] Show error message on failure
- [ ] Check `AuthService.isLoggedIn()` to show/hide nav items

### Home Page
- [ ] Use `ListingsService.getAll()` for featured listings
- [ ] Handle `result.success` before using data
- [ ] Show loading skeleton while fetching

### Booking Flow
1. [ ] View listing: `ListingsService.getById(id)`
2. [ ] Create booking: `BookingsService.create(data)`
3. [ ] Show pricing breakdown from response
4. [ ] Process payment: `PaymentsService.initiate(bookingId, method)`
5. [ ] Show payment status

### Host Dashboard
- [ ] List listings: `ListingsService.getMyListings()`
- [ ] Manage bookings: `BookingsService.getAll()`
- [ ] Update status: `BookingsService.updateStatus(id, status)`

### User Profile
- [ ] Get profile: `UsersService.getProfile()`
- [ ] Update profile: `UsersService.updateProfile(data)`
- [ ] Manage saved listings: `UsersService.getSavedListings()`

---

## Backend Changes Made

### Middleware Added
- `validation.js` - Input validation for bookings, listings, reviews, payments
- `errorHandler.js` - Global error handling and response formatting

### Controllers Updated
- `authController.js` - Consistent response format
- `bookingController.js` - Better error handling, response formatting
- `paymentController.js` - Mock GCash/Maya payment gateway

### Routes Updated
- Added validation middleware to protected routes
- All routes use consistent error responses

---

## Mock Payment Simulation

GCash: 2-second processing
```javascript
await PaymentsService.initiate(bookingId, 'gcash');
// Simulates 2-second GCash transaction
```

Maya: 3-second processing
```javascript
await PaymentsService.initiate(bookingId, 'maya');
// Simulates 3-second Maya transaction
```

Cash: Pending until confirmed
```javascript
await PaymentsService.initiate(bookingId, 'cash');
// Returns pending status, requires host confirmation
```

---

## Security Features Implemented

✅ JWT token validation on protected routes
✅ Role-based access control (guest, host, admin)
✅ Input validation on all endpoints
✅ Prevents double booking with date conflict checking
✅ Prevents unauthorized actions (user can only access their own data)
✅ Password hashing with bcryptjs
✅ Token expiry handling with auto-logout

---

## Common Frontend Patterns

### Protected Component
```javascript
async function loadProtectedData() {
  if (!AuthService.isLoggedIn()) {
    navigateTo('home'); // Redirect to login
    return;
  }
  
  const result = await DataService.fetch();
  if (!result.success) {
    showError(result.error);
    return;
  }
  
  // Use result.data
}
```

### Booking Button Click
```javascript
async function handleBookNow(listingId) {
  const result = await BookingsService.create({
    listingId,
    checkIn,
    checkOut,
    numberOfGuests,
  });

  if (!result.success) {
    showError(result.error); // "Dates are not available"
    return;
  }

  // Show payment screen with result.pricing
  showPaymentModal(result.data._id, result.pricing);
}
```

---

## Troubleshooting

**CORS Error**: Update CORS_ORIGIN in `.env` to frontend URL

**Auth Token Error**: Clear localStorage and re-login
```javascript
localStorage.removeItem('authToken');
```

**Date Conflict**: Backend checks unavailable dates in listing

**Payment Failed**: Check network tab for error response

**Validation Error**: Check backend console for validation details

---

## Deployment Notes

Before going live:

1. [ ] Set `NODE_ENV=production` in .env
2. [ ] Use real payment processor API keys
3. [ ] Configure real image upload service (Cloudinary)
4. [ ] Set strong `JWT_SECRET`
5. [ ] Enable HTTPS
6. [ ] Test all booking flows
7. [ ] Test payment processing
8. [ ] Test user authentication
9. [ ] Configure production database
10. [ ] Set up monitoring and logging

---

## Example: Complete Booking Flow

```javascript
// 1. Load listing
const listing = await ListingsService.getById(listingId);

// 2. Create booking
const booking = await BookingsService.create({
  listingId,
  checkIn: '2024-04-20',
  checkOut: '2024-04-23',
  numberOfGuests: 2,
});

// 3. Process payment
const payment = await PaymentsService.initiate(
  booking.data._id,
  'gcash'
);

// 4. Show confirmation
if (payment.success) {
  showSuccess('Booking confirmed!');
  // Load updated bookings
  const bookings = await BookingsService.getAll();
}
```
