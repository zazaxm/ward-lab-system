# GitHub Upload Guide - ما ترفعه وما تتجاهله

## ✅ ارفع على GitHub (Upload to GitHub)

### Backend Files:
```
✅ backend/app.py
✅ backend/requirements.txt
```

### Frontend Files:
```
✅ frontend/index.html
✅ frontend/package.json
✅ frontend/vite.config.js
✅ frontend/tailwind.config.js
✅ frontend/postcss.config.js
✅ frontend/src/ (كل المجلد مع كل الملفات)
   ├── main.jsx
   ├── App.jsx
   ├── index.css
   ├── components/
   ├── contexts/
   ├── pages/
   └── services/
```

### Documentation:
```
✅ README.md
✅ DEPLOYMENT.md
✅ .gitignore
```

---

## ❌ لا ترفع (Don't Upload - Ignore)

### Backend:
```
❌ backend/.env              (معلومات حساسة)
❌ backend/venv/             (بيئة Python - سيعيد إنشاؤها)
❌ backend/__pycache__/       (ملفات Python المؤقتة)
❌ backend/*.db               (قاعدة البيانات)
❌ backend/*.sqlite
❌ backend/*.sqlite3
```

### Frontend:
```
❌ frontend/node_modules/    (سيتم تثبيتها عبر npm install)
❌ frontend/dist/            (ملفات البناء - سيعاد بناؤها)
❌ frontend/build/
```

### System Files:
```
❌ .DS_Store                 (ملفات Mac)
❌ Thumbs.db                 (ملفات Windows)
❌ *.log                     (ملفات السجلات)
❌ .vscode/                  (إعدادات VS Code)
❌ .idea/                    (إعدادات IntelliJ)
```

---

## 📋 Quick Checklist

### ✅ Upload These:
- [x] `backend/app.py`
- [x] `backend/requirements.txt`
- [x] `frontend/` (all source files)
- [x] `README.md`
- [x] `.gitignore`

### ❌ Don't Upload:
- [ ] `backend/.env`
- [ ] `backend/venv/`
- [ ] `backend/*.db`
- [ ] `frontend/node_modules/`
- [ ] `frontend/dist/`
- [ ] Any `.env` files
- [ ] Any database files

---

## 🚀 Steps to Upload to GitHub

### 1. Initialize Git:
```bash
cd ward-lab-system
git init
```

### 2. Add Files:
```bash
git add backend/app.py
git add backend/requirements.txt
git add frontend/
git add README.md
git add .gitignore
```

### 3. Commit:
```bash
git commit -m "Initial commit - Ward & Lab Management System"
```

### 4. Create Repository on GitHub:
- Go to GitHub.com
- Create new repository
- Copy the repository URL

### 5. Push:
```bash
git remote add origin https://github.com/yourusername/ward-lab-system.git
git branch -M main
git push -u origin main
```

---

## ⚠️ Important Notes

1. **Never upload `.env` files** - They contain sensitive information
2. **Never upload `node_modules/`** - Too large, will be installed via `npm install`
3. **Never upload database files** - They contain actual data
4. **Always include `.gitignore`** - It prevents uploading unwanted files

---

## 📝 What Happens After Upload?

### On Server/Deployment:
1. Clone repository: `git clone https://github.com/yourusername/ward-lab-system.git`
2. Backend: `pip install -r requirements.txt` (installs dependencies)
3. Frontend: `npm install` (installs node_modules)
4. Create `.env` file manually on server
5. Run the application

---

## Summary

**Upload:** Source code files only (20 files)
**Ignore:** Dependencies, databases, environment files, build outputs

