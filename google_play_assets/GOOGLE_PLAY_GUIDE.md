# 📱 CẨM NANG HƯỚNG DẪN XUẤT BẢN HOME CHICKEN POS LÊN GOOGLE PLAY STORE

Tài liệu này cung cấp lộ trình từng bước chi tiết giúp bạn đóng gói và đưa ứng dụng **Home Chicken POS** lên cửa hàng **Google Play Store** thành công theo các chính sách mới nhất của Google.

---

## 1. BỘ TÀI NGUYÊN ĐÃ ĐƯỢC CHUẨN BỊ SẴN CHO BẠN

| Tài nguyên | Vị trí file | Mục đích sử dụng |
| :--- | :--- | :--- |
| **Mã nguồn Android** | `d:\homechicken\android\` | Dự án Android Studio hoàn chỉnh (Target SDK 34) |
| **Khóa ký ứng dụng** | `d:\homechicken\android\release-key.jks` | File bảo mật bắt buộc để ký file `.aab` |
| **Thông tin Key** | Alias: `homechicken` \| Pass: `HomeChicken@2026` | Dùng khi build bản phát hành (Release) |
| **Icon Play Store (512x512)** | `d:\homechicken\google_play_assets\app_icon_512.png` | Ảnh đại diện app trên Play Store |
| **Banner Feature Graphic (1024x500)** | `d:\homechicken\google_play_assets\feature_graphic_1024x500.png` | Banner nổi bật đầu trang Play Store |
| **Chính sách riêng tư** | `d:\homechicken\google_play_assets\privacy_policy.html` | Bắt buộc phải có để duyệt app |
| **Script đồng bộ** | `d:\homechicken\scripts\sync-assets.bat` | 1-click cập nhật web vào Android |
| **Script đóng gói** | `d:\homechicken\scripts\build-android.bat` | Hướng dẫn xuất `.aab` / `.apk` |

---

## 2. CÁCH BIÊN DỊCH FILE `.AAB` TRONG ANDROID STUDIO (1-CLICK)

Google Play yêu cầu định dạng **Android App Bundle (.aab)** thay vì APK.

1. Tải và cài đặt [Android Studio](https://developer.android.com/studio) (nếu máy tính chưa có).
2. Mở Android Studio, chọn **Open**, trỏ vào thư mục: `d:\homechicken\android`.
3. Chờ Android Studio đồng bộ xong Gradle (khoảng 1 - 2 phút).
4. Vào menu phía trên: **Build** > **Generate Signed Bundle / APK...**
5. Chọn **Android App Bundle** > Bấm **Next**.
6. Điền thông tin Keystore:
   - **Key store path:** Bấm *Choose existing...* và chọn file `d:\homechicken\android\release-key.jks`
   - **Key store password:** `HomeChicken@2026`
   - **Key alias:** `homechicken`
   - **Key password:** `HomeChicken@2026`
   - Tích chọn *"Remember passwords"* để lần sau không cần nhập lại.
7. Bấm **Next** > Chọn biến thể **release** > Bấm **Create**.
8. Sau khi build hoàn tất, file `.aab` sẽ nằm tại:
   `d:\homechicken\android\app\release\app-release.aab`
   *(Đây chính là file bạn sẽ tải lên Google Play Console!)*

> [!TIP]
> Nếu bạn muốn cài trực tiếp file `.apk` vào điện thoại của bạn hoặc nhân viên để dùng thử ngay:
> - Kết nối điện thoại với máy tính bằng cáp USB (đã bật "Tùy chọn cho nhà phát triển" > "Gỡ lỗi USB").
> - Bấm nút **Run (Tam giác xanh)** trên Android Studio, app sẽ tự động cài vào điện thoại trong vài giây.

---

## 3. CÁC BƯỚC ĐƯA ỨNG DỤNG LÊN GOOGLE PLAY CONSOLE

### Bước 1: Chuẩn bị tài khoản Google Play Developer
- Truy cập: [play.google.com/console](https://play.google.com/console)
- Đăng ký tài khoản nhà phát triển (phí một lần duy nhất của Google là 25 USD).
- Hoàn tất xác minh danh tính (CCCD / Hộ chiếu) theo hướng dẫn của Google.

### Bước 2: Tạo ứng dụng mới (Create App)
1. Bấm nút **Create app** (Tạo ứng dụng) ở góc phải.
2. Điền thông tin:
   - **App name:** `Home Chicken POS`
   - **Default language:** `Vietnamese (vi)`
   - **App or game:** `App`
   - **Free or paid:** `Free`
3. Tích chọn đồng ý các điều khoản của Google và bấm **Create app**.

### Bước 3: Thiết lập trang thông tin cửa hàng (Store Listing)
Vào mục **Grow** > **Store presence** > **Main store listing**:
1. **Short description (Mô tả ngắn - tối đa 80 ký tự):**
   > *Phần mềm quản lý bán hàng và quầy thu ngân Home Chicken POS thông minh, tiện lợi.*
2. **Full description (Mô tả đầy đủ):**
   > *Home Chicken POS là giải pháp quản lý bán hàng chuyên nghiệp dành cho cửa hàng F&B, nhà hàng và quầy thức ăn nhanh.*
   > 
   > *Tính năng nổi bật:*
   > - Quản lý thực đơn món ăn, danh mục và giá bán linh hoạt.
   > - Thao tác chọn món và tính tiền nhanh chóng, chính xác.
   > - Hỗ trợ in hóa đơn thanh toán cho khách hàng.
   > - Thống kê doanh thu, lịch sử đơn hàng theo thời gian thực.
   > - Quản lý nhập xuất kho hàng nguyên vật liệu.
   > - Giao diện thân thiện, tối ưu cho cả điện thoại di động và máy tính bảng POS.
3. **Graphics (Tài nguyên đồ họa):**
   - **App icon (512x512):** Tải lên file `d:\homechicken\google_play_assets\app_icon_512.png`.
   - **Feature graphic (1024x500):** Tải lên file `d:\homechicken\google_play_assets\feature_graphic_1024x500.png`.
   - **Phone screenshots (Ảnh chụp màn hình):** Chụp từ 2 đến 4 ảnh màn hình ứng dụng trên điện thoại (Màn hình đăng nhập, màn hình bán hàng thực đơn, màn hình đơn hàng) và tải lên.

### Bước 4: Hoàn thành các mục chính sách ứng dụng (App Content)
Vào mục **Policy** > **App content** và hoàn thành các mục sau:
1. **Privacy Policy (Chính sách quyền riêng tư):**
   - Đưa file `d:\homechicken\google_play_assets\privacy_policy.html` lên hosting của bạn (ví dụ `https://giavdn.pro.vn/privacy_policy.html` hoặc GitHub Pages).
   - Dán đường link đó vào ô Privacy Policy URL.
2. **App access (Quyền truy cập ứng dụng):**
   - Chọn *"All or some functionality is restricted"* (Một số tính năng bị giới hạn vì cần tài khoản).
   - Bấm **Add instructions**: Cung cấp 1 tài khoản đăng nhập mẫu (ví dụ: `demo` / `123456`) để kỹ sư Google có thể đăng nhập vào trải nghiệm ứng dụng khi duyệt.
3. **Ads (Quảng cáo):** Chọn *"No, my app does not contain ads"*.
4. **Content rating (Đánh giá nội dung):**
   - Trả lời bảng câu hỏi phân loại độ tuổi.
   - Chọn danh mục: *"Utility, Productivity, Communication, or other"*.
   - Trả lời "Không" cho tất cả các câu hỏi về bạo lực, tình dục, cờ bạc.
   - Kết quả sẽ đạt xếp hạng: **3+ (Phù hợp mọi lứa tuổi)**.
5. **Target audience (Đối tượng mục tiêu):** Chọn từ **18 tuổi trở lên**.
6. **Data safety (An toàn dữ liệu):**
   - Chọn ứng dụng có thu thập tên người dùng để định danh tài khoản quản lý bán hàng.
   - Dữ liệu được mã hóa trong quá trình truyền qua giao thức HTTPS.

### Bước 5: Tải file `.aab` và Tạo bản phát hành
1. Vào mục **Release** > **Testing** > **Closed testing** (hoặc **Production** nếu tài khoản doanh nghiệp).
2. Bấm **Create new release**.
3. Tại ô **App bundles**, bấm **Upload** và chọn file `app-release.aab` vừa xuất ở Bước 2.
4. **Release name:** Nhập `1.0.0`.
5. **Release notes:** Nhập `Phiên bản phát hành chính thức đầu tiên của ứng dụng Home Chicken POS`.
6. Bấm **Next** > Kiểm tra cảnh báo (nếu không có lỗi đỏ) > Bấm **Save** và **Start rollout**.

---

## 4. QUY TRÌNH DUYỆT 20 TESTER TRONG 14 NGÀY (LƯU Ý ĐẶC BIỆT)

Nếu tài khoản Google Play Developer của bạn là **Tài khoản cá nhân (Personal Account)** được đăng ký từ sau tháng 11/2023, Google áp dụng quy định:
- Bạn phải tạo bản phát hành tại mục **Closed Testing (Kiểm thử kín)**.
- Thêm tối thiểu **20 địa chỉ Gmail** của bạn bè/nhân viên vào danh sách tester.
- Gửi liên kết tham gia thử nghiệm cho 20 người này cài đặt ứng dụng và mở ứng dụng liên tục trong vòng **14 ngày**.
- Sau 14 ngày, nút **Apply for Production** sẽ sáng lên. Bạn chỉ cần bấm vào và trả lời 1 số câu hỏi ngắn về quá trình kiểm thử, Google sẽ mở quyền đưa app lên Production công khai toàn cầu!

*(Nếu bạn đăng ký bằng Tài khoản Tổ chức/Doanh nghiệp - Organization Account thì không bị yêu cầu này, có thể xuất bản Production trực tiếp).*

---

## 5. TỔNG KẾT
Toàn bộ mã nguồn Android, icon đồ họa, chính sách quyền riêng tư và script tự động đều đã sẵn sàng trong thư mục dự án của bạn:
- Thư mục Android: `d:\homechicken\android`
- Thư mục đồ họa: `d:\homechicken\google_play_assets`
- Thư mục script tiện ích: `d:\homechicken\scripts`
