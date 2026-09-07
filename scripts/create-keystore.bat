@echo off
chcp 65001 > nul
echo ========================================================
echo   TẠO KHÓA KÝ ỨNG DỤNG (RELEASE KEYSTORE) GOOGLE PLAY
echo ========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0create-keystore.ps1"
pause
