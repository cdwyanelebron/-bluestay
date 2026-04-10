# 🏨 BlueStay - Quick Setup & Usage Guide

## ✅ Status: READY TO USE! 🚀

Your BlueStay application is **fully set up and running**!

---

## 🎯 Quick Start (30 seconds)

### 1️⃣ **Backend is ALREADY RUNNING**
```
✅ Running on: http://localhost:5000
✅ MongoDB: Connected
✅ Database: Seeded with test data
```

### 2️⃣ **Open the Web App**
Open this file in your browser:
```
file:///c:/Users/Dwyane/-bluestay/index.html
```

Or access via backend:
```
http://localhost:5000
```

### 3️⃣ **Login & Test**
Use any of these test accounts:
```
Email: guest@bluestay.com  
Password: password123
---
Email: host@bluestay.com
Password: password123
---
Email: admin@bluestay.com
Password: password123
```

---

## 📱 Features to Try

- 🏠 **Browse Listings** - See all available properties
- 🔍 **Search** - Find properties by location
- 📅 **Book** - Reserve a property
- 💬 **Chat** - Message hosts
- 👤 **Profile** - Manage your account
- 🏢 **Host Dashboard** - Manage listings (if host)
- ⭐ **Reviews** - Rate properties

---

## 🛠️ Project Structure

```
bluestay/
├── backend/               # API server (Node.js + MongoDB)
├── index.html             # Main web app
├── api-service.js         # API helper functions
└── docs/                  # Documentation
```

See `PROJECT_STRUCTURE.md` for details.

---

## 📡 API Endpoints

All API calls go to: `http://localhost:5000/api`

### Common Routes:
```
GET    /api/listings          - Get all listings
GET    /api/listings/:id      - Get single listing
POST   /api/bookings          - Create booking
GET    /api/users/profile     - Get user profile
POST   /api/auth/login        - Login user
```

---

## 🐛 Troubleshooting

### Backend not running?
```powershell
cd c:\Users\Dwyane\-bluestay\backend
npm run dev
```

### MongoDB issues?
Check if MongoDB service is running:
```powershell
Get-Service MongoDB | Select-Object Status
```

### Can't connect to API?
- Ensure backend is running on port 5000
- Check that MongoDB is connected
- Look for errors in backend terminal

---

## ✨ What's Included

- ✅ **42 API Endpoints** - Full backend functionality
- ✅ **Complete Web UI** - All pages and features
- ✅ **Authentication** - JWT-based login
- ✅ **Database** - MongoDB with 7 models
- ✅ **Responsive Design** - Mobile-friendly
- ✅ **Error Handling** - Graceful error messages
- ✅ **Test Data** - Pre-populated database

---

## 🚀 Ready to Deploy?

See `docs/` folder for deployment guides and architecture details.

---

**Questions?** Check `START_HERE.md` or `PROJECT_STRUCTURE.md`

Happy stay hunting! 🏖️
