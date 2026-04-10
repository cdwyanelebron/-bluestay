# BlueStay System - Testing Checklist

## Pre-Flight Checklist

### Backend
- [ ] MongoDB running locally or connected to Atlas
- [ ] .env configured with correct values
- [ ] Database seeded with sample data: `node seed.js`
- [ ] Backend running: `npm run dev` (port 5000)
- [ ] Health check passes: `http://localhost:5000/health`

### Frontend
- [ ] api-service.js included in HTML
- [ ] API_BASE_URL points to correct backend
- [ ] No console errors on page load

---

## Authentication Tests

### Register
- [ ] Form rejects empty fields
- [ ] Form rejects invalid email
- [ ] Form rejects short password (<6 chars)
- [ ] Form rejects duplicate email
- [ ] Valid registration stores token
- [ ] User redirects to home after registration
- [ ] Profile shows registered user info

### Login
- [ ] Form rejects empty fields
- [ ] Form rejects invalid credentials
- [ ] Valid login stores token
- [ ] User redirects to home
- [ ] Navbar shows user name + avatar after login

### Logout
- [ ] Token removed from localStorage
- [ ] User redirected to home
- [ ] Protected pages require login

### Protected Routes
- [ ] Accessing `/bookings` without token redirects to home
- [ ] Accessing `/profile` without token redirects to home
- [ ] Token in header on protected requests
- [ ] 401 response auto-logs out user

---

## Listing Tests

### Browse Listings
- [ ] Home page loads featured listings
- [ ] Search page shows all listings
- [ ] Filters work (category, price, city)
- [ ] Pagination works (page 1, 2, 3)
- [ ] Each listing shows correct data:
  - [ ] Title
  - [ ] Price (₱/night)
  - [ ] Location
  - [ ] Host name
  - [ ] Rating + review count

### View Listing Details
- [ ] Page loads with correct listing
- [ ] Image gallery scrolls
- [ ] Host information displays
- [ ] Amenities listed correctly
- [ ] Rating and reviews show
- [ ] "Book Now" button accessible

### Create Listing (Host)
- [ ] Form validates required fields
- [ ] Title minimum 5 characters
- [ ] Price minimum 100
- [ ] Location requires city + barangay
- [ ] Submit creates listing in database
- [ ] New listing appears in host dashboard
- [ ] Default unavailable dates empty

### Update Listing (Host)
- [ ] Edit button opens form
- [ ] Form pre-fills current data
- [ ] Changes save correctly
- [ ] Updated data shows on page

### Delete Listing (Host)
- [ ] Delete button appears
- [ ] Confirmation required
- [ ] Listing removed from dashboard
- [ ] Listing no longer browsable

---

## Booking Tests

### Create Booking
- [ ] Select check-in date
- [ ] Select check-out date
- [ ] Price calculation correct:
  - [ ] Subtotal = price × nights
  - [ ] Service fee = subtotal × 10%
  - [ ] Total = subtotal + fee
- [ ] Guest selection validates max capacity
- [ ] Submit creates booking
- [ ] Booking status = "pending"
- [ ] Error: past dates rejected
- [ ] Error: check-out before check-in rejected
- [ ] Error: exceeds guest capacity rejected

### Date Conflict Detection
- [ ] Can't book overlapping dates
- [ ] Can't book unavailable date ranges
- [ ] Error message: "Dates are not available"

### View Bookings
- [ ] Guest sees own bookings
- [ ] Host sees own bookings
- [ ] Shows check-in, check-out dates
- [ ] Shows booking status
- [ ] Shows total price
- [ ] Shows listing details

### Cancel Booking
- [ ] Guest can cancel pending booking
- [ ] Host can decline booking
- [ ] Status changes to "cancelled"
- [ ] Error: can't cancel confirmed booking

### Update Booking Status (Host)
- [ ] Host can confirm booking
- [ ] Dates added to listing unavailable_dates
- [ ] Status changes to "confirmed"
- [ ] Can add response message

---

## Payment Tests

### Initiate Payment
- [ ] Payment form shows correct amount
- [ ] Method dropdown shows options:
  - [ ] GCash
  - [ ] Maya
  - [ ] Cash on Arrival
- [ ] Submit initiates payment

### GCash Simulation
- [ ] "Processing..." shows for 2 seconds
- [ ] Payment marked "completed"
- [ ] Booking status auto-confirmed
- [ ] Receipt with transaction ID shows

### Maya Simulation
- [ ] "Processing..." shows for 3 seconds
- [ ] Payment marked "completed"
- [ ] Booking status auto-confirmed
- [ ] Receipt with transaction ID shows

### Cash on Arrival
- [ ] Payment marked "pending"
- [ ] Booking marked "pending"
- [ ] Host needs to confirm payment

### Refund
- [ ] User can request refund
- [ ] Payment status = "refunded"
- [ ] Booking status = "cancelled"
- [ ] Refund takes ~1 second

### Payment History
- [ ] View all payments
- [ ] Shows booking reference
- [ ] Shows method + transaction ID
- [ ] Shows status

---

## Review Tests

### Create Review
- [ ] Only after booking completed
- [ ] Rating 1-5 required
- [ ] Title optional
- [ ] Comment optional
- [ ] Amenity ratings helpful
- [ ] Submit creates review
- [ ] Review appears in listing

### View Reviews
- [ ] Listing shows all reviews
- [ ] Sorted by newest first
- [ ] Shows reviewer name + avatar
- [ ] Shows rating breakdown
- [ ] Shows helpful count

### Update Review
- [ ] User can edit own review
- [ ] Changes save correctly
- [ ] Updated time shows

### Delete Review
- [ ] User can delete own review
- [ ] Confirmation required
- [ ] Review removed

### Host Stats
- [ ] Overall rating calculates
- [ ] Total review count accurate
- [ ] Host profile shows stats

---

## Chat Tests

### Create Conversation
- [ ] Search user to message
- [ ] Conversation created
- [ ] Shows in conversation list
- [ ] Both users see conversation

### Send Message
- [ ] Type message
- [ ] Submit sends message
- [ ] Message appears in chat
- [ ] Shows timestamp

### Receive Messages
- [ ] Other user's message appears
- [ ] Message shows as "from them"
- [ ] Auto-scrolls to new message

### Mark as Read
- [ ] Opening conversation marks as read
- [ ] Unread count updates

### Delete Conversation
- [ ] Delete button removes conversation
- [ ] Messages deleted

---

## User Profile Tests

### View Profile
- [ ] Name displays
- [ ] Avatar shows
- [ ] Verification badge shows if verified
- [ ] Bio displays
- [ ] Location displays
- [ ] Review count shows
- [ ] Average rating shows

### Edit Profile
- [ ] Edit button opens form
- [ ] Pre-fills current data
- [ ] Name minimum 2 characters
- [ ] Phone validates
- [ ] Email validates
- [ ] Changes save correctly

### Saved Listings
- [ ] Heart icon on listing cards
- [ ] Clicking saves/unsaves
- [ ] Saved listings list updates
- [ ] Shows all saved items
- [ ] Can unsave from list

### Change Password
- [ ] Old password required
- [ ] New password required
- [ ] Passwords don't match error
- [ ] Success redirects to profile

### Delete Account
- [ ] Confirmation required
- [ ] Password required
- [ ] Account deleted
- [ ] User logged out
- [ ] Can't login with old email

---

## Error Handling Tests

### Network Errors
- [ ] No internet shows error
- [ ] Error message user-friendly
- [ ] Retry button works

### Validation Errors
- [ ] Invalid booking shows error
- [ ] Invalid listing shows error
- [ ] Invalid payment shows error
- [ ] Field-level error display

### Authorization Errors
- [ ] Non-host can't create listing
- [ ] Guest can't manage host features
- [ ] User can't modify others' data

### Server Errors
- [ ] 500 error shows generic message
- [ ] 404 shows not found
- [ ] Check backend console for details

---

## Performance Tests

### Page Loading
- [ ] Home loads < 3 seconds
- [ ] Listing details < 2 seconds
- [ ] Search results < 2 seconds

### Image Loading
- [ ] Images lazy-load
- [ ] Placeholder shows while loading
- [ ] No layout shift after load

### API Calls
- [ ] No duplicate requests
- [ ] Requests cancel on page change
- [ ] Error responses handled quickly

---

## Mobile Responsiveness Tests

### Desktop (1920px)
- [ ] All content visible
- [ ] No horizontal scroll
- [ ] Images sized correctly

### Tablet (768px)
- [ ] Layout reflows
- [ ] Touch targets 44px minimum
- [ ] Bottom nav accessible

### Mobile (375px)
- [ ] Single column layout
- [ ] Images scale down
- [ ] Forms readable
- [ ] Buttons clickable

---

## Security Tests

### Token Security
- [ ] Token not exposed in URL
- [ ] Token in secure localStorage
- [ ] Token sent in headers (not params)
- [ ] Expired token triggers re-login

### Data Access
- [ ] User can't see others' passwords
- [ ] User can't modify others' listings
- [ ] User can't cancel others' bookings
- [ ] Host-only endpoints require host role

### Input Sanitization
- [ ] XSS attempts in chat fail
- [ ] HTML tags treated as text
- [ ] SQL injection-like strings safe

---

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## Database Tests

### Data Integrity
- [ ] Bookings linked to correct listing
- [ ] Payments linked to correct booking
- [ ] Reviews linked to correct booking
- [ ] Messages linked to correct conversation

### Constraints
- [ ] User email unique
- [ ] Can't create booking without user
- [ ] Can't create booking without listing
- [ ] Date ranges validate

### Data Cleanup
- [ ] Deleted listings don't appear
- [ ] Deleted bookings don't affect stats
- [ ] Deleted reviews update ratings

---

## Final Sign-Off

- [ ] All critical tests pass
- [ ] No console errors
- [ ] No server errors
- [ ] Performance acceptable
- [ ] Responsive on mobile
- [ ] Accessible with keyboard
- [ ] All features working
- [ ] Ready for production

**Tester:** _____________
**Date:** _____________
**Status:** ☐ PASS  ☐ FAIL
