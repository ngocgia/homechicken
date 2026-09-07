@echo off
chcp 65001 > nul
echo =========================================================================
echo   QUY TRÌNH ĐÓNG GÓI ỨNG DỤNG ANDROID - HOME CHICKEN POS (.AAB / .APK)
echo =========================================================================
echo.

echo [Bước 1/2] Đồng bộ hóa tài nguyên giao diện Web vào Android Assets...
powershell -ExecutionPolicy Bypass -File "%~dp0sync-assets.ps1"

echo.
echo [Bước 2/2] Kiểm tra công cụ biên dịch Android...
if exist "%~dp0..\android\release-key.jks" (
    echo [OK] Đã tìm thấy khóa ký Google Play (release-key.jks)
) else (
    echo [CẢNH BÁO] Chưa có release-key.jks. Đang tự động tạo...
    powershell -ExecutionPolicy Bypass -File "%~dp0create-keystore.ps1"
)

echo.
echo =========================================================================
echo CÁC CÁCH BIÊN DỊCH ỨNG DỤNG:
echo =========================================================================
echo.
echo CÁCH 1 (Khuyên dùng - Dễ nhất & Chuẩn nhất qua Android Studio):
echo   1. Mở phần mềm Android Studio.
echo   2. Chọn "Open" và trỏ đến thư mục:
echo      d:\homechicken\android
echo   3. Để cài thử nghiệm lên điện thoại:
echo      - Kết nối điện thoại qua cáp USB (bật USB Debugging) và bấm nút Run (Tam giác xanh).
echo      - Hoặc vào menu: Build ^> Build Bundle(s) / APK(s) ^> Build APK(s).
echo   4. Để xuất file .AAB đưa lên Google Play Store:
echo      - Vào menu: Build ^> Generate Signed Bundle / APK...
echo      - Chọn "Android App Bundle" ^> Next
echo      - Trỏ đến Key store path: d:\homechicken\android\release-key.jks
echo      - Nhập mật khẩu: HomeChicken@2026 (hoặc mật khẩu bạn đã tạo)
echo      - Key alias: homechicken
echo      - Bấm Next ^> Chọn "release" ^> Bấm Create.
echo      - File .aab xuất ra sẽ nằm trong:
echo        d:\homechicken\android\app\release\app-release.aab
echo.
echo CÁCH 2 (Dòng lệnh nếu máy đã cài Android SDK):
echo   cd /d "%~dp0..\android"
echo   gradlew.bat bundleRelease (hoặc gradlew.bat assembleDebug)
echo.
echo =========================================================================
pause
