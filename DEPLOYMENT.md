# Deployment Guide - Files to Upload

## 📦 Files Required for Deployment

### Option 1: Separate Backend & Frontend Deployment

#### Backend Files (Python/Flask - Deploy to Railway, Render, or Heroku)
```
ward-lab-system/
├── backend/
│   ├── app.py                    ✅ REQUIRED
│   ├── requirements.txt          ✅ REQUIRED
│   └── .env                      ⚠️  Create on server (don't upload to Git)
```

#### Frontend Files (React/Vite - Deploy to Vercel, Netlify, or GitHub Pages)
```
ward-lab-system/
├── frontend/
│   ├── index.html                ✅ REQUIRED
│   ├── package.json              ✅ REQUIRED
│   ├── vite.config.js            ✅ REQUIRED
│   ├── tailwind.config.js        ✅ REQUIRED
│   ├── postcss.config.js         ✅ REQUIRED
│   └── src/                      ✅ REQUIRED (entire folder)
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   └── Layout.jsx
│       ├── contexts/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   ├── WardDirectory.jsx
│       │   ├── AddOnRequest.jsx
│       │   ├── CriticalCall.jsx
│       │   ├── LabDashboard.jsx
│       │   └── Analytics.jsx
│       └── services/
│           └── api.js
```

### Option 2: Full Stack Deployment (Vercel with Serverless Functions)

Upload entire project:
```
ward-lab-system/
├── backend/                      ✅ REQUIRED
│   ├── app.py
│   └── requirements.txt
├── frontend/                     ✅ REQUIRED
│   ├── (all files listed above)
├── vercel.json                   ✅ REQUIRED (for Vercel)
└── README.md                     ⚠️  Optional
```

---

## 🚀 Quick Upload Checklist

### ✅ Must Upload:
- [ ] `backend/app.py`
- [ ] `backend/requirements.txt`
- [ ] `frontend/index.html`
- [ ] `frontend/package.json`
- [ ] `frontend/vite.config.js`
- [ ] `frontend/tailwind.config.js`
- [ ] `frontend/postcss.config.js`
- [ ] `frontend/src/` (entire directory with all subfolders)

### ⚠️ Don't Upload (Create on Server):
- [ ] `backend/.env` - Create manually on server
- [ ] `backend/venv/` - Virtual environment (recreate on server)
- [ ] `frontend/node_modules/` - Will be installed via `npm install`
- [ ] `backend/ward_lab.db` - Database file (will be created automatically)

### 📝 Optional Files:
- [ ] `README.md` - Documentation
- [ ] `.gitignore` - Git ignore rules
- [ ] `vercel.json` - Vercel configuration (if using Vercel)

---

## 📋 Complete File List

### Backend (7 files total)
```
backend/
├── app.py                        ✅ Core application
├── requirements.txt              ✅ Dependencies
└── .env.example                  ⚠️  Template (create .env on server)
```

### Frontend (15+ files total)
```
frontend/
├── index.html                    ✅ Entry point
├── package.json                  ✅ Dependencies & scripts
├── vite.config.js               ✅ Vite configuration
├── tailwind.config.js           ✅ Tailwind CSS config
├── postcss.config.js            ✅ PostCSS config
└── src/
    ├── main.jsx                 ✅ React entry
    ├── App.jsx                  ✅ Main app component
    ├── index.css                ✅ Global styles
    ├── components/
    │   └── Layout.jsx           ✅ Layout component
    ├── contexts/
    │   └── AuthContext.jsx       ✅ Auth context
    ├── pages/
    │   ├── Login.jsx            ✅ Login page
    │   ├── Dashboard.jsx        ✅ Dashboard page
    │   ├── WardDirectory.jsx    ✅ Ward directory page
    │   ├── AddOnRequest.jsx     ✅ Add-on request page
    │   ├── CriticalCall.jsx     ✅ Critical call page
    │   ├── LabDashboard.jsx     ✅ Lab dashboard page
    │   └── Analytics.jsx        ✅ Analytics page
    └── services/
        └── api.js                ✅ API service
```

---

## 🔧 Environment Variables to Set on Server

### Backend (.env file):
```
DATABASE_URL=sqlite:///ward_lab.db
JWT_SECRET_KEY=your-secret-key-here
FLASK_ENV=production
```

### Frontend (if needed):
Update `frontend/src/services/api.js` with your backend URL:
```javascript
baseURL: 'https://your-backend-url.com/api'
```

---

## 📤 Upload Methods

### Method 1: Git Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### Method 2: Direct Upload (Vercel/Netlify)
1. Zip the `frontend` folder
2. Upload to Vercel/Netlify dashboard
3. Or use their CLI: `vercel` or `netlify deploy`

### Method 3: FTP/SFTP
Upload all files listed above to your server

---

## ✅ Post-Deployment Checklist

After uploading:
- [ ] Install backend dependencies: `pip install -r requirements.txt`
- [ ] Create `.env` file on backend server
- [ ] Install frontend dependencies: `npm install`
- [ ] Build frontend: `npm run build`
- [ ] Update API base URL in frontend
- [ ] Test login functionality
- [ ] Verify database creation
- [ ] Check all routes are working

---

## 📝 Notes

1. **Database**: SQLite file will be created automatically on first run
2. **CORS**: Backend already configured for CORS
3. **Build**: Frontend needs to be built before deployment (`npm run build`)
4. **Ports**: Backend runs on port 5000, Frontend on port 3000 (dev) or served statically (production)

