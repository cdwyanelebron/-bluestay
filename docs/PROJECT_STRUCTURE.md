# BlueStay Project Structure

## 📁 Folder Organization

```
bluestay/
├── backend/                          # Node.js + Express + MongoDB API
│   ├── controllers/                  # Route handlers
│   ├── middleware/                   # Auth, validation, error handling
│   ├── models/                       # MongoDB schemas
│   ├── routes/                       # API endpoints
│   ├── utils/                        # Helper functions
│   ├── server.js                     # Main server file
│   ├── seed.js                       # Database seeding
│   ├── package.json                  # Dependencies
│   └── .env                          # Environment variables
│
├── frontend/                         # Web frontend (future assets)
│   └── (add web-specific assets here)
│
├── docs/                             # Documentation
│   └── (documentation files)
│
├── index.html                        # Main web app (served by backend)
├── api-service.js                    # API client helper
├── FRONTEND_IMPLEMENTATION.js        # Frontend integration guide
├── README.md                         # Project readme
└── START_HERE.md                     # Quick start guide
```

## 🚀 Running the Application

### Backend
```bash
cd backend
npm install
npm run dev
```
**Backend runs on:** `http://localhost:5000`

### Frontend
Open in browser: `file:///c:/Users/Dwyane/-bluestay/index.html`

Or serve via backend:
```
http://localhost:5000
```

## 🔐 Test Accounts
- **Guest:** guest@bluestay.com / password123
- **Host:** host@bluestay.com / password123
- **Admin:** admin@bluestay.com / password123

## 📡 API Base URL
- `http://localhost:5000/api`

## 🗄️ Database
- **Type:** MongoDB
- **Connection:** Local (localhost:27017)
- **Database Name:** bluestay
- **Status:** Seeded with sample data

## ✅ Features Implemented
- ✅ User authentication (JWT)
- ✅ Listing management (CRUD)
- ✅ Booking system
- ✅ Payment integration
- ✅ Review system
- ✅ Chat messaging
- ✅ User profiles
- ✅ Host dashboard
- ✅ Responsive web design

## 📝 API Endpoints
- `/api/auth` - Authentication
- `/api/listings` - Property listings
- `/api/bookings` - Booking management
- `/api/payments` - Payment processing
- `/api/reviews` - Review system
- `/api/chat` - Messaging
- `/api/users` - User profiles
