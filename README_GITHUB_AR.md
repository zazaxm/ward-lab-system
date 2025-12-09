# دليل رفع المشروع على GitHub - بالعربي

## 🎯 الطريقة الأسهل (خطوة بخطوة)

### الخطوة 1: افتح Terminal

**Windows:**
- اضغط `Windows + R`
- اكتب `powershell` واضغط Enter
- أو اضغط `Windows + X` واختر "Terminal"

**أو استخدم ملف `رفع_بسيط.bat`** (انقر نقراً مزدوجاً عليه)

---

### الخطوة 2: اذهب لمجلد المشروع

في الـ Terminal، اكتب:

```bash
cd C:\Users\Abdulaziz\.cursor-tutor\ward-lab-system
```

اضغط Enter

---

### الخطوة 3: ابدأ Git

```bash
git init
```

---

### الخطوة 4: أضف جميع الملفات

```bash
git add .
```

**هذا الأمر سيضيف جميع الـ 22 ملف تلقائياً!**

---

### الخطوة 5: احفظ التغييرات

```bash
git commit -m "Initial commit - Ward & Lab Management System"
```

---

### الخطوة 6: أنشئ Repository على GitHub

1. اذهب إلى: **https://github.com**
2. اضغط على **"+"** في الأعلى → **"New repository"**
3. اكتب اسم: **`ward-lab-system`**
4. اختر **Public** أو **Private**
5. **لا تضع علامة** على "Initialize with README"
6. اضغط **"Create repository"**

---

### الخطوة 7: اربط المشروع بـ GitHub

بعد إنشاء الـ Repository، GitHub سيعطيك رابط مثل:
```
https://github.com/YOUR_USERNAME/ward-lab-system.git
```

انسخ هذا الرابط، ثم في الـ Terminal اكتب:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ward-lab-system.git
```

**استبدل `YOUR_USERNAME` باسمك على GitHub**

---

### الخطوة 8: ارفع الملفات

```bash
git branch -M main
git push -u origin main
```

سيطلب منك:
- **Username:** اسمك على GitHub
- **Password:** استخدم **Personal Access Token** (ليس كلمة المرور العادية)

---

## 🔐 كيفية الحصول على Personal Access Token

1. اذهب إلى: **https://github.com/settings/tokens**
2. اضغط **"Generate new token"** → **"Generate new token (classic)"**
3. اكتب اسم للـ Token (مثلاً: "ward-lab-system")
4. اختر الصلاحيات: ✅ **repo** (كلها)
5. اضغط **"Generate token"**
6. **انسخ الـ Token فوراً** (لن يظهر مرة أخرى!)
7. استخدمه كـ **Password** عند الرفع

---

## ✅ التحقق من النجاح

بعد الرفع، اذهب إلى:
```
https://github.com/YOUR_USERNAME/ward-lab-system
```

يجب أن ترى جميع الملفات!

---

## 📋 جميع الأوامر دفعة واحدة

```bash
cd C:\Users\Abdulaziz\.cursor-tutor\ward-lab-system
git init
git add .
git commit -m "Initial commit - Ward & Lab Management System"
git remote add origin https://github.com/YOUR_USERNAME/ward-lab-system.git
git branch -M main
git push -u origin main
```

---

## 🆘 حل المشاكل

### "git is not recognized"
**الحل:** ثبت Git من: https://git-scm.com/download/win

### "fatal: not a git repository"
**الحل:** تأكد أنك في المجلد الصحيح:
```bash
cd C:\Users\Abdulaziz\.cursor-tutor\ward-lab-system
```

### "remote origin already exists"
**الحل:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/ward-lab-system.git
```

### "Authentication failed"
**الحل:** استخدم Personal Access Token بدلاً من كلمة المرور

---

## 💡 نصائح

1. ✅ **`git add .`** يضيف جميع الملفات تلقائياً
2. ✅ ملف **`.gitignore`** موجود - سيتجاهل الملفات غير المرغوبة
3. ✅ لا تحتاج لرفع كل ملف على حدة
4. ✅ الملفات الكبيرة (مثل `node_modules`) لن تُرفع تلقائياً

---

## 🎉 انتهى!

بعد الرفع، يمكن لأي شخص:
- رؤية الكود
- تحميل المشروع
- المساهمة في التطوير

