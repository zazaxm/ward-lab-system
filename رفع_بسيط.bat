@echo off
echo ========================================
echo رفع المشروع على GitHub
echo ========================================
echo.

cd /d "C:\Users\Abdulaziz\.cursor-tutor\ward-lab-system"

echo [1/5] بدء Git...
git init

echo [2/5] إضافة الملفات...
git add .

echo [3/5] حفظ التغييرات...
git commit -m "Initial commit - Ward & Lab Management System"

echo.
echo ========================================
echo الخطوات التالية:
echo ========================================
echo 1. اذهب إلى https://github.com
echo 2. أنشئ repository جديد باسم: ward-lab-system
echo 3. انسخ الرابط من صفحة الـ repository
echo 4. ارجع هنا واكتب:
echo.
echo    git remote add origin [الرابط الذي نسخته]
echo    git branch -M main
echo    git push -u origin main
echo.
echo ========================================
pause

