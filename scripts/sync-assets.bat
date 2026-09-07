@echo off
chcp 65001 > nul
echo [1/2] Đang đồng bộ giao diện Web vào thư mục ứng dụng Android...
powershell -ExecutionPolicy Bypass -File "%~dp0sync-assets.ps1"
echo [2/2] Hoàn thành đồng bộ!
pause
