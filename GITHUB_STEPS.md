# خطوات رفع المشروع على GitHub - Step by Step

## 📍 الملفات التي سترفعها (Exact Paths)

### ✅ Backend Files:
```
ward-lab-system/backend/app.py
ward-lab-system/backend/requirements.txt
```

### ✅ Frontend Files:
```
ward-lab-system/frontend/index.html
ward-lab-system/frontend/package.json
ward-lab-system/frontend/vite.config.js
ward-lab-system/frontend/tailwind.config.js
ward-lab-system/frontend/postcss.config.js
ward-lab-system/frontend/src/main.jsx
ward-lab-system/frontend/src/App.jsx
ward-lab-system/frontend/src/index.css
ward-lab-system/frontend/src/components/Layout.jsx
ward-lab-system/frontend/src/contexts/AuthContext.jsx
ward-lab-system/frontend/src/pages/Login.jsx
ward-lab-system/frontend/src/pages/Dashboard.jsx
ward-lab-system/frontend/src/pages/WardDirectory.jsx
ward-lab-system/frontend/src/pages/AddOnRequest.jsx
ward-lab-system/frontend/src/pages/CriticalCall.jsx
ward-lab-system/frontend/src/pages/LabDashboard.jsx
ward-lab-system/frontend/src/pages/Analytics.jsx
ward-lab-system/frontend/src/services/api.js
```

### ✅ Documentation:
```
ward-lab-system/README.md
ward-lab-system/.gitignore
```

---

## 🚀 الخطوات الكاملة (Step by Step)

### الخطوة 1: افتح Terminal/Command Prompt

افتح PowerShell أو Command Prompt في مجلد المشروع:
```
C:\Users\Abdulaziz\.cursor-tutor\ward-lab-system
```

### الخطوة 2: تأكد من تثبيت Git

```bash
git --version
```

إذا لم يكن مثبتاً، حمله من: https://git-scm.com/download/win

### الخطوة 3: ابدأ Git Repository

```bash
cd C:\Users\Abdulaziz\.cursor-tutor\ward-lab-system
git init
```

### الخطوة 4: أضف جميع الملفات

```bash
git add .
```

هذا الأمر سيضيف جميع الملفات تلقائياً (وسيتجاهل الملفات في `.gitignore`)

### الخطوة 5: احفظ التغييرات (Commit)

```bash
git commit -m "Initial commit - Ward & Lab Management System"
```

### الخطوة 6: أنشئ Repository على GitHub

1. اذهب إلى: https://github.com
2. اضغط على **"+"** في الأعلى → **"New repository"**
3. اكتب اسم المشروع (مثلاً: `ward-lab-system`)
4. اختر **Public** أو **Private**
5. **لا** تضع علامة على "Initialize with README"
6. اضغط **"Create repository"**

### الخطوة 7: اربط المشروع المحلي بـ GitHub

انسخ الرابط من صفحة GitHub (سيظهر بعد إنشاء الـ repository):

```bash
git remote add origin https://github.com/YOUR_USERNAME/ward-lab-system.git
```

**استبدل `YOUR_USERNAME` باسمك على GitHub**

### الخطوة 8: ارفع الملفات

```bash
git branch -M main
git push -u origin main
```

سيطلب منك اسم المستخدم وكلمة المرور (أو Token)

---

## 📋 الأوامر الكاملة (Copy & Paste)

انسخ هذه الأوامر بالترتيب:

```bash
# 1. اذهب للمجلد
cd C:\Users\Abdulaziz\.cursor-tutor\ward-lab-system

# 2. ابدأ Git
git init

# 3. أضف الملفات
git add .

# 4. احفظ التغييرات
git commit -m "Initial commit - Ward & Lab Management System"

# 5. اربط بـ GitHub (استبدل YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ward-lab-system.git

# 6. ارفع الملفات
git branch -M main
git push -u origin main
```

---

## 🔐 إذا طلب منك Authentication

### الطريقة 1: Personal Access Token (موصى بها)

1. اذهب إلى: https://github.com/settings/tokens
2. اضغط **"Generate new token"** → **"Generate new token (classic)"**
3. اكتب اسم للـ Token (مثلاً: "ward-lab-system")
4. اختر الصلاحيات: **repo** (كلها)
5. اضغط **"Generate token"**
6. انسخ الـ Token (لن يظهر مرة أخرى!)
7. استخدم الـ Token كـ **Password** عند الرفع

### الطريقة 2: GitHub CLI

```bash
# ثبت GitHub CLI
winget install GitHub.cli

# سجل دخول
gh auth login

# ثم ارفع
git push -u origin main
```

---

## ✅ التحقق من النجاح

بعد الرفع، اذهب إلى:
```
https://github.com/YOUR_USERNAME/ward-lab-system
```

يجب أن ترى جميع الملفات!

---

## 🔄 إذا أردت تحديث الملفات لاحقاً

```bash
cd C:\Users\Abdulaziz\.cursor-tutor\ward-lab-system
git add .
git commit -m "Update: description of changes"
git push
```

---

## 📝 ملاحظات مهمة

1. ✅ ملف `.gitignore` موجود - سيتجاهل تلقائياً:
   - `node_modules/`
   - `.env`
   - `*.db`
   - `venv/`
   - `dist/`

2. ⚠️ لا ترفع ملفات `.env` - تحتوي على معلومات حساسة

3. 📦 الملفات الكبيرة (مثل `node_modules`) لن تُرفع تلقائياً

---

## 🆘 حل المشاكل الشائعة

### المشكلة: "fatal: not a git repository"
**الحل:** تأكد أنك في المجلد الصحيح:
```bash
cd C:\Users\Abdulaziz\.cursor-tutor\ward-lab-system
```

### المشكلة: "remote origin already exists"
**الحل:** احذف الـ remote وأضفه مرة أخرى:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/ward-lab-system.git
```

### المشكلة: "Authentication failed"
**الحل:** استخدم Personal Access Token بدلاً من كلمة المرور

---

## 📞 المساعدة

إذا واجهت أي مشكلة، تأكد من:
- ✅ Git مثبت: `git --version`
- ✅ أنت في المجلد الصحيح
- ✅ Repository موجود على GitHub
- ✅ الرابط صحيح (يبدأ بـ `https://github.com/...`)

