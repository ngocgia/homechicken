// =========================================================================
// ⚙️ CẤU HÌNH API
// Tự động nhận diện host: nếu chạy cùng domain hoặc localhost thì dùng relative '/api' hoặc origin, fallback production
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? (window.location.port === '3000' || window.location.port === '' ? '/api' : 'http://localhost:3000/api')
    : (window.location.protocol.startsWith('http') ? `${window.location.origin}/api` : 'https://giavdn.pro.vn/api');

const db = createApiClient(API_BASE);

let currentUser = null;
let isLoginMode = true;

function initAuth() {
    const savedUser = localStorage.getItem('pos_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    } else {
        showLoginScreen();
    }
}

function showMainApp() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('main-app-container').style.display = 'block';
    document.getElementById('btnLogout').style.display = 'flex';

    if (currentUser && currentUser.username === 'admin') {
        document.getElementById('btnAdmin').style.display = 'flex';
    } else {
        document.getElementById('btnAdmin').style.display = 'none';
    }

    loadMenuFromSupabase();
    loadOrderTypesFromSupabase();
    loadStockFromSupabase();
    loadSalesHistoryFromSupabase();
    renderOrderTabs();
}

function showLoginScreen() {
    currentUser = null;
    document.getElementById('auth-container').style.display = 'flex';
    document.getElementById('main-app-container').style.display = 'none';
    document.getElementById('btnLogout').style.display = 'none';
    document.getElementById('btnAdmin').style.display = 'none';
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('authTitle');
    const btnSubmit = document.getElementById('btnAuthSubmit');
    const toggleText = document.getElementById('authToggleText');

    if (isLoginMode) {
        title.innerText = 'Đăng Nhập POS';
        btnSubmit.innerText = 'Đăng Nhập';
        toggleText.innerText = 'Chưa có tài khoản? Đăng ký ngay.';
    } else {
        title.innerText = 'Đăng Ký Tài Khoản';
        btnSubmit.innerText = 'Đăng Ký';
        toggleText.innerText = 'Đã có tài khoản? Đăng nhập ngay.';
    }
}


function showAuthLoading(show) {
    const overlay = document.getElementById('authLoadingOverlay');
    if (overlay) overlay.style.display = show ? 'flex' : 'none';
}

async function handleAuthSubmit() {
    showAuthLoading(true);
    const username = document.getElementById('authUsername').value.trim();
    const password = document.getElementById('authPassword').value;

    if (!username || !password) {
        alert('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
        showAuthLoading(false);
        return;
    }

    if (isLoginMode) {
        // Đăng nhập
        const { data, error } = await db.from('users').select('*').eq('username', username).eq('password', password);
        if (error) {
            alert('Lỗi truy vấn: ' + error.message);
            return;
        }

        if (data && data.length > 0) {
            currentUser = data[0];
            localStorage.setItem('pos_current_user', JSON.stringify(currentUser));
            showMainApp();
        } else {
            alert('Tên đăng nhập hoặc mật khẩu không đúng!');
        }
    } else {
        // Đăng ký
        // Kiểm tra xem username đã tồn tại chưa
        const { data: existData, error: existError } = await db.from('users').select('*').eq('username', username);
        if (existError) {
            alert('Lỗi truy vấn: ' + existError.message);
            return;
        }
        if (existData && existData.length > 0) {
            alert('Tên đăng nhập này đã có người sử dụng. Vui lòng chọn tên khác!');
            return;
        }

        // Thêm user mới
        const { data, error } = await db.from('users').insert([{ username, password }]);
        if (error) {
            alert('Lỗi đăng ký: ' + error.message);
        } else {
            alert('Đăng ký thành công! Đang tự động đăng nhập...');
            if (data && data.length > 0) {
                currentUser = data[0];
                localStorage.setItem('pos_current_user', JSON.stringify(currentUser));
                showMainApp();
            }
        }
    }
}

function handleLogout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('pos_current_user');
        showLoginScreen();
    }
}

// Khởi tạo trạng thái đăng nhập khi tải trang


const defaultMenu = [
    { category: "Gà Viên Sốt", name: "Gà Viên Sốt Cay Ngọt", price: 40000 },
    { category: "Gà Viên Sốt", name: "Gà Viên Sốt Chua Ngọt", price: 40000 },
    { category: "Gà Viên Sốt", name: "Gà Viên Sốt Phô Mai", price: 40000 },
    { category: "Gà Viên Sốt", name: "Gà Viên Sốt Kem", price: 40000 },
    { category: "Gà Viên Sốt", name: "Gà Viên Sốt Mắm Tỏi", price: 40000 },
    { category: "Gà Viên Sốt", name: "Gà Viên Sốt Tương Tỏi", price: 40000 },
    { category: "Gà Viên Sốt", name: "Gà Viên Lắc Phô Mai", price: 40000 },
    { category: "Gà Viên Sốt", name: "Gà Mix 2 Vị (M)", price: 75000 },
    { category: "Gà Viên Sốt", name: "Gà Mix 2 Vị (L)", price: 100000 },
    { category: "Gà Viên Sốt", name: "Gà Mix 3 Vị (M)", price: 80000 },
    { category: "Gà Viên Sốt", name: "Gà Mix 3 Vị (L)", price: 100000 },
    { category: "Gà Viên Sốt", name: "Gà Mix 4-5 Vị", price: 120000 },
    { category: "Tokbokki", name: "Tok truyền thống lắc PM", price: 25000 },
    { category: "Tokbokki", name: "Tok cheese lắc PM", price: 25000 },
    { category: "Tokbokki", name: "Tok sốt phô mai + kem", price: 40000 },
    { category: "Tokbokki", name: "Tok cay chả cá Hàn", price: 35000 },
    { category: "Tokbokki", name: "Tok cay king cheese Hàn", price: 45000 },
    { category: "Tokbokki", name: "Tok cay mixx 2 loại", price: 55000 },
    { category: "Tokbokki", name: "Mì tok truyền thống/PM", price: 55000 },
    { category: "Tokbokki", name: "Tok mixx gà sốt", price: 50000 },
    { category: "Tokbokki", name: "Chả cá sốt cay (1 xiên)", price: 15000 },
    { category: "Đồ Ăn No", name: "Mì Ý", price: 30000 },
    { category: "Đồ Ăn No", name: "Mì Ý xúc xích", price: 37000 },
    { category: "Đồ Ăn No", name: "Kimpap truyền thống", price: 25000 },
    { category: "Đồ Ăn No", name: "Kimpap chiên", price: 27000 },
    { category: "Đồ Ăn No", name: "Cơm Gà Viên Sốt", price: 37000 },
    { category: "Đồ Ăn No", name: "Trứng cuộn rong biển", price: 20000 },
    { category: "Mì Tương Đen", name: "Mì Tương Đen Hàn Quốc", price: 40000 },
    { category: "Mì Tương Đen", name: "Mì Tương Đen + Mandu", price: 50000 },
    { category: "Mì Tương Đen", name: "Mì Tương Đen + Tok/Khoai", price: 50000 },
    { category: "Mì Tương Đen", name: "Mì Tương Đen + Gà Viên", price: 70000 },
    { category: "Cơm Trộn", name: "Cơm trộn Xúc Xích", price: 35000 },
    { category: "Cơm Trộn", name: "Cơm trộn Gà Viên (sốt)", price: 35000 },
    { category: "Cơm Trộn", name: "Cơm trộn chả cá (cay)", price: 35000 },
    { category: "Cơm Trộn", name: "Cơm trộn bò Mỹ", price: 40000 },
    { category: "Món Ăn Vặt", name: "Khoai tây chiên", price: 20000 },
    { category: "Món Ăn Vặt", name: "Khoai tây lắc phô mai", price: 25000 },
    { category: "Món Ăn Vặt", name: "Xúc xích chiên (1 cây)", price: 10000 },
    { category: "Món Ăn Vặt", name: "Mandu chiên (1 cái)", price: 10000 },
    { category: "Món Ăn Vặt", name: "Viên Hải Sản Mayo", price: 25000 },
    { category: "Món Ăn Vặt", name: "Phô Mai Que (1 cái)", price: 10000 },
    { category: "Món Ăn Vặt", name: "HÁ Cảo Lắc Phô Mai", price: 40000 },
    { category: "Món Ăn Vặt", name: "Cá/tôm/bò viên (1 xiên)", price: 5000 },
    { category: "Combo 1-2 Người", name: "Set 1: Mì Ý - Gà Viên - Khoai Tây", price: 60000 },
    { category: "Combo 1-2 Người", name: "Set 2: Cơm Cuộn - Gà Viên", price: 55000 },
    { category: "Combo 1-2 Người", name: "Set 3: Mì Ý - Cơm Cuộn - Gà Viên 2 vị", price: 80000 },
    { category: "Combo 1-2 Người", name: "Set 4: Cơm Cuộn - Gà Viên 2 vị - 2 mandu", price: 80000 },
    { category: "Combo 1-2 Người", name: "Set 5: Cơm Cuộn - Gà Viên 2 vị - Khoai lắc", price: 80000 },
    { category: "Combo 1-2 Người", name: "Set 6: 2 Cơm Cuộn - Gà Viên 2 vị", price: 80000 },
    { category: "Combo 1-2 Người", name: "Set 7: Mì Ý - Gà 2 Vị - Khoai Lắc", price: 80000 },
    { category: "Combo 1-2 Người", name: "Set 8: Mì Ý - Gà 2 Vị - 2 mandu", price: 80000 },
    { category: "Combo 1-2 Người", name: "Set 9: Mì Ý - Gà 2 Vị - Viên hải sản", price: 80000 },
    { category: "Combo 1-2 Người", name: "Set 10: Mì Ý - Gà 2 Vị - Tok lắc PM", price: 80000 },
    { category: "Box & Set", name: "Box 1 (1-2 người)", price: 80000 },
    { category: "Box & Set", name: "Box 2 (1-2 người)", price: 80000 },
    { category: "Box & Set", name: "Box 3 (1-2 người)", price: 120000 },
    { category: "Box & Set", name: "Box 4 (1-2 người)", price: 130000 },
    { category: "Box & Set", name: "Box 5 (1-2 người)", price: 130000 },
    { category: "Box & Set", name: "Couple 1 (2-3 người)", price: 135000 },
    { category: "Box & Set", name: "Couple 2 (2-3 người)", price: 160000 },
    { category: "Box & Set", name: "Couple 3 (2-3 người)", price: 150000 },
    { category: "Box & Set", name: "Couple 4 (2-3 người)", price: 140000 },
    { category: "Box & Set", name: "Couple 5 (2-3 người)", price: 145000 },
    { category: "Combo 3-4-5", name: "COUPLE 6", price: 160000 },
    { category: "Combo 3-4-5", name: "COUPLE 7", price: 160000 },
    { category: "Combo 3-4-5", name: "COUPLE 8", price: 200000 },
    { category: "Combo 3-4-5", name: "COUPLE 9", price: 250000 },
    { category: "Món Thêm", name: "Thêm Chả Cá", price: 10000 },
    { category: "Món Thêm", name: "Thêm Phô Mai kéo sợi", price: 10000 },
    { category: "Món Thêm", name: "Thêm Phô Mai cheddar", price: 10000 },
    { category: "Khác", name: "Phí ship", price: 10000 }
];

let menu = [];
let storeOrderTypes = [];
const defaultOrderTypes = [
    { name: "🛵 SHIP MANG VỀ", require_address: true, require_time: false },
    { name: "🍽️ ĂN TẠI QUÁN", require_address: false, require_time: false },
    { name: "🛍️ KHÁCH TỚI LẤY", require_address: false, require_time: true }
];

let cart = [];
let salesHistory = [];
let stockList = [];
let bluetoothDevice = null;
let printCharacteristic = null;
let editingOrderId = null;
let topItemsChartInstance = null;

const todayStr = new Date().toISOString().split('T')[0];

document.getElementById('stockDate').value = todayStr;
document.getElementById('stockFilterStartDate').value = todayStr;
document.getElementById('stockFilterEndDate').value = todayStr;
document.getElementById('filterStartDate').value = todayStr;
document.getElementById('filterEndDate').value = todayStr;

// Đóng popup khi chạm ra ngoài

let parkedOrders = [{
    cart: [],
    type: 'SHIP MANG VỀ',
    customer: '',
    phone: '',
    address: '',
    pickupTime: '',
    discount: ''
}];
let activeOrderIndex = 0;

function saveCurrentOrderState() {
    parkedOrders[activeOrderIndex] = {
        cart: cart,
        type: document.getElementById('orderType').value,
        customer: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        address: document.getElementById('customerAddress').value,
        pickupTime: document.getElementById('pickupTime').value,
        discount: document.getElementById('discountInput').value
    };
}

function loadOrderState(index) {
    activeOrderIndex = index;
    const order = parkedOrders[index];
    cart = order.cart;

    document.getElementById('orderType').value = order.type || (storeOrderTypes[0]?.name || '');
    document.getElementById('customerName').value = order.customer || '';
    document.getElementById('customerPhone').value = order.phone || '';
    document.getElementById('customerAddress').value = order.address || '';
    document.getElementById('pickupTime').value = order.pickupTime || '';
    document.getElementById('discountInput').value = order.discount || '';

    toggleOrderFields();
    renderCart();
    renderOrderTabs();
}

function addNewOrderTab() {
    saveCurrentOrderState();
    parkedOrders.push({
        cart: [],
        type: 'SHIP MANG VỀ',
        customer: '',
        phone: '',
        address: '',
        pickupTime: '',
        discount: ''
    });
    loadOrderState(parkedOrders.length - 1);
}

function updateActiveOrderName() {
    parkedOrders[activeOrderIndex].customer = document.getElementById('customerName').value;
    renderOrderTabs();
}

function closeOrderTab(index, event) {
    if (event) event.stopPropagation();

    if (parkedOrders.length === 1) {
        if (event) {
            if (confirm(`Bạn có chắc muốn xóa Đơn 1?`)) {
                clearCart();
            }
        } else {
            clearCart();
        }
        return;
    }

    if (!event || confirm(`Bạn có chắc muốn xóa Đơn ${index + 1}?`)) {
        parkedOrders.splice(index, 1);
        if (activeOrderIndex >= index) {
            activeOrderIndex = Math.max(0, activeOrderIndex - 1);
        }
        loadOrderState(activeOrderIndex);
    }
}

function renderOrderTabs() {
    const container = document.getElementById('orderTabsContainer');
    if (!container) return;

    let html = '';
    parkedOrders.forEach((order, idx) => {
        const isActive = idx === activeOrderIndex ? 'active' : '';
        const displayName = order.customer ? order.customer : `Đơn ${idx + 1}`;
        html += `
            <div class="order-tab ${isActive}" onclick="switchOrderTab(${idx})">
                ${displayName}
                <span class="order-tab-close" onclick="closeOrderTab(${idx}, event)">×</span>
            </div>
        `;
    });

    html += `<button class="btn-add-order" onclick="addNewOrderTab()">+ Thêm đơn</button>`;
    container.innerHTML = html;

    const headerTitle = document.getElementById('orderHeaderTitle');
    if (headerTitle) {
        const activeCustomer = parkedOrders[activeOrderIndex].customer;
        const activeDisplayName = activeCustomer ? activeCustomer : `Đơn ${activeOrderIndex + 1}`;
        headerTitle.innerText = `Thông Tin Đơn Hàng (${activeDisplayName})`;
    }
}

function switchOrderTab(index) {
    if (index === activeOrderIndex) return;
    saveCurrentOrderState();
    loadOrderState(index);
}

document.addEventListener('click', function (e) {
    if (!e.target.classList.contains('menu-dots-btn') &&
        !e.target.classList.contains('action-dots-btn') &&
        !e.target.classList.contains('stock-dots-btn')) {
        document.querySelectorAll('.menu-dropdown, .action-dropdown, .stock-dropdown').forEach(el => el.classList.remove('show'));
    }
});

function removeVietnameseTones(str) {
    if (!str) return '';
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

// =========================================================================
// 🖨️ BỘ VẼ BILL BITMAP CHỮ TO & RÕ NÉT (384 DOTS - K57)
// =========================================================================
// =========================================================================
async function printOrderAsBitmap(orderData) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 384; // 384 điểm ảnh / dòng của máy K57 (48mm)

    const itemsCount = (orderData.items || []).length;
    // Tăng chiều cao canvas tương ứng với cỡ chữ lớn hơn
    const height = 560 + (itemsCount * 85) + (orderData.discount_percent > 0 ? 100 : 0);

    canvas.width = width;
    canvas.height = height;

    // Nền trắng tinh
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#000000';
    ctx.textBaseline = 'top';
    ctx.imageSmoothingEnabled = false; // Tắt làm mịn nét để chữ in ra đậm & sắc nét

    let y = 12;

    // 1. TIÊU ĐỀ HÓA ĐƠN (Tên quán to siêu nổi bật)
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';

    const storeNameStr = (currentUser && currentUser.store_name) ? currentUser.store_name : 'CỬA HÀNG';
    ctx.fillText(storeNameStr, width / 2, y); y += 46;

    ctx.font = 'bold 24px Arial';
    if (currentUser && currentUser.store_address) {
        ctx.fillText('ĐC: ' + currentUser.store_address, width / 2, y); y += 26;
    }
    if (currentUser && currentUser.store_phone) {
        ctx.fillText('SĐT: ' + currentUser.store_phone, width / 2, y); y += 26;
    }
    if (currentUser && currentUser.store_fb) {
        ctx.fillText('FB: ' + currentUser.store_fb, width / 2, y); y += 30;
    }

    // Đường kẻ nét đứt
    function drawDashLine(currY) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.moveTo(5, currY);
        ctx.lineTo(width - 5, currY);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawDashLine(y); y += 16;

    // 2. LOẠI ĐƠN & THÔNG TIN KHÁCH HÀNG (Cỡ chữ to)
    ctx.font = 'bold 28px Arial';
    ctx.fillText(`[ ${orderData.type || 'HÓA ĐƠN'} ]`, width / 2, y); y += 40;

    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Khách: ${orderData.customer || 'Khách vãng lai'}`, 5, y); y += 30;
    if (orderData.phone) { ctx.fillText(`SĐT: ${orderData.phone}`, 5, y); y += 30; }
    if (orderData.address) { ctx.fillText(`ĐC: ${orderData.address}`, 5, y); y += 30; }
    if (orderData.pickup_time) { ctx.fillText(`Giờ hẹn: ${orderData.pickup_time}`, 5, y); y += 30; }

    drawDashLine(y); y += 16;

    // 3. DANH SÁCH MÓN ĂN (TĂNG CỠ CHỮ + GIÃN KHOẢNG CÁCH CHUẨN)
    (orderData.items || []).forEach(item => {
        // Tên món (Tăng lên 25px - Chữ to, nét đậm)
        ctx.font = 'bold 25px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(item.name, 5, y);
        y += 35; // Giãn dòng an toàn, tuyệt đối không bị đè chữ

        // Số lượng x Giá tiền (Tăng lên 20px)
        ctx.font = 'bold 20px Arial';
        const detailStr = `${item.qty} x ${item.price.toLocaleString('vi-VN')} đ`;
        const totalStr = `${(item.qty * item.price).toLocaleString('vi-VN')} đ`;

        ctx.fillText(detailStr, 12, y);
        ctx.textAlign = 'right';
        ctx.fillText(totalStr, width - 5, y);
        y += 35; // Giãn rộng giữa các món

        if (item.note && item.note.trim() !== '') {
            ctx.textAlign = 'left';
            ctx.font = 'italic 18px Arial';
            ctx.fillText(`* Note: ${item.note.trim()}`, 12, y);
            y += 28;
        }
    });

    drawDashLine(y); y += 16;

    // 4. TỔNG TIỀN / GIẢM GIÁ (Cỡ chữ to)
    if (orderData.discount_percent > 0) {
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left'; ctx.fillText('Tạm tính:', 5, y);
        ctx.textAlign = 'right'; ctx.fillText(`${(orderData.subtotal || 0).toLocaleString('vi-VN')} đ`, width - 5, y);
        y += 32;

        ctx.textAlign = 'left'; ctx.fillText(`Giảm giá (${orderData.discount_percent}%):`, 5, y);
        ctx.textAlign = 'right'; ctx.fillText(`-${(orderData.discount_amount || 0).toLocaleString('vi-VN')} đ`, width - 5, y);
        y += 32;
        drawDashLine(y); y += 16;
    }

    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'left'; ctx.fillText('TỔNG CỘNG:', 5, y);
    ctx.textAlign = 'right'; ctx.fillText(`${(orderData.total || 0).toLocaleString('vi-VN')} đ`, width - 5, y);
    y += 46;

    drawDashLine(y); y += 18;

    // 5. LỜI CẢM ƠN
    ctx.font = 'bold italic 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Cảm ơn quý khách & Hẹn gặp lại!', width / 2, y); y += 36;

    // 🔄 CHUYỂN DỮ LIỆU SANG BITMAP ĐEN THUẦN CHỐNG NHÒE / MỜ
    const imgData = ctx.getImageData(0, 0, width, height);
    const bytesPerLine = width / 8;
    const bitmapBytes = [];

    // Lệnh ESC/POS GS v 0
    bitmapBytes.push(0x1D, 0x76, 0x30, 0x00);
    bitmapBytes.push(bytesPerLine & 0xFF, (bytesPerLine >> 8) & 0xFF);
    bitmapBytes.push(height & 0xFF, (height >> 8) & 0xFF);

    for (let h = 0; h < height; h++) {
        for (let w = 0; w < bytesPerLine; w++) {
            let byteVal = 0;
            for (let bit = 0; bit < 8; bit++) {
                const pixelX = w * 8 + bit;
                const idx = (h * width + pixelX) * 4;
                const r = imgData.data[idx];
                const g = imgData.data[idx + 1];
                const b = imgData.data[idx + 2];

                const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

                // Lọc màu đen đậm giúp chữ in sắc nét
                if (luminance < 200) {
                    byteVal |= (0x80 >> bit);
                }
            }
            bitmapBytes.push(byteVal);
        }
    }

    // Cuộn giấy thêm 3 dòng trống
    bitmapBytes.push(0x1B, 0x64, 0x03);

    // Gửi byte sang máy in Bluetooth
    await sendRawBluetoothBytes(new Uint8Array(bitmapBytes));
}

async function sendRawBluetoothBytes(dataArray) {
    if (!printCharacteristic) {
        window.print();
        return;
    }

    try {
        const initCmd = new Uint8Array([0x1B, 0x40]);
        await printCharacteristic.writeValue(initCmd);

        const CHUNK_SIZE = 200; // Gửi dữ liệu theo từng chunk nhỏ để tránh lỗi
        for (let i = 0; i < dataArray.length; i += CHUNK_SIZE) {
            const chunk = dataArray.slice(i, i + CHUNK_SIZE);
            await printCharacteristic.writeValue(chunk);
        }
    } catch (err) {
        alert('Không thể gửi dữ liệu tới máy in: ' + err.message);
        window.print();
    }
}

// --- 1. QUẢN LÝ THỰC ĐƠN (SUPABASE) ---
async function loadMenuFromSupabase() {
    const { data, error } = await db.from('menu').select('*').eq('user_id', currentUser.id).order('id', { ascending: true });
    if (error) {
        console.error('Lỗi tải menu:', error);
        menu = defaultMenu;
    } else if (data.length === 0) {
        await db.from('menu').insert(defaultMenu.map(item => ({ ...item, user_id: currentUser.id })));
        const { data: newData } = await db.from('menu').select('*').eq('user_id', currentUser.id).order('id', { ascending: true });
        menu = newData || defaultMenu;
    } else {
        menu = data;
    }
    renderMenu();
}

function toggleMenuManager() {
    const box = document.getElementById('menuManagerBox');
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
    if (box.style.display === 'none') cancelEditMenu();
}

async function saveMenuItem() {
    const editId = document.getElementById('editMenuId').value;
    const category = document.getElementById('menuCategoryInput').value.trim() || 'Khác';
    const name = document.getElementById('menuNameInput').value.trim();
    const price = parseInt(document.getElementById('menuPriceInput').value) || 0;

    if (!name || price <= 0) {
        alert('Vui lòng nhập tên món và giá hợp lệ!');
        return;
    }

    if (editId) {
        const { error } = await db.from('menu').update({ category, name, price }).eq('id', editId).eq('user_id', currentUser.id);
        if (error) alert('Lỗi sửa món: ' + error.message);
        else alert('Đã cập nhật món thành công!');
    } else {
        const { error } = await db.from('menu').insert([{ category, name, price, user_id: currentUser.id }]);
        if (error) alert('Lỗi thêm món: ' + error.message);
        else alert('Đã thêm món mới thành công!');
    }

    cancelEditMenu();
    loadMenuFromSupabase();
}

function startEditMenu(id, category, name, price, event) {
    event.stopPropagation();
    document.getElementById('menuManagerBox').style.display = 'block';
    document.getElementById('menuFormTitle').innerText = 'Chỉnh Sửa Món';
    document.getElementById('editMenuId').value = id;
    document.getElementById('menuCategoryInput').value = category;
    document.getElementById('menuNameInput').value = name;
    document.getElementById('menuPriceInput').value = price;
}

async function deleteMenuItem(id, name, event) {
    event.stopPropagation();
    if (confirm(`Bạn có chắc muốn xóa món "${name}" khỏi thực đơn?`)) {
        const { error } = await db.from('menu').delete().eq('id', id).eq('user_id', currentUser.id);
        if (error) alert('Lỗi xóa món: ' + error.message);
        else loadMenuFromSupabase();
    }
}

function cancelEditMenu() {
    document.getElementById('editMenuId').value = '';
    document.getElementById('menuCategoryInput').value = '';
    document.getElementById('menuNameInput').value = '';
    document.getElementById('menuPriceInput').value = '';
    document.getElementById('menuFormTitle').innerText = 'Thêm Món Mới';
}

function toggleMenuDropdown(id, event) {
    event.stopPropagation();
    document.querySelectorAll('.menu-dropdown, .action-dropdown, .stock-dropdown').forEach(el => {
        if (el.id !== `dropdown-${id}`) el.classList.remove('show');
    });

    const currentDropdown = document.getElementById(`dropdown-${id}`);
    if (currentDropdown) currentDropdown.classList.toggle('show');
}

function renderMenu(itemsToRender = menu) {
    const menuContainer = document.getElementById('menuContainer');
    menuContainer.innerHTML = '';

    if (itemsToRender.length === 0) {
        menuContainer.innerHTML = '<div style="text-align: center; color: #8e8e93; padding: 20px;">Không tìm thấy món ăn phù hợp!</div>';
        return;
    }

    const categories = [...new Set(itemsToRender.map(item => item.category || "Khác"))];

    categories.forEach(cat => {
        let catHTML = `<div class="category-title">${cat}</div><div class="menu-grid">`;
        const items = itemsToRender.filter(item => (item.category || "Khác") === cat);

        items.forEach(item => {
            const originalIndex = menu.findIndex(m => m.name === item.name);
            catHTML += `
                <div class="menu-item" onclick="addToCart(${originalIndex})">
                    <div class="menu-dots-btn" onclick="toggleMenuDropdown(${item.id}, event)">⋮</div>
                    
                    <div class="menu-dropdown" id="dropdown-${item.id}">
                        <button class="menu-dropdown-item edit" onclick="startEditMenu(${item.id}, '${item.category}', '${item.name}', ${item.price}, event)">✏️ Sửa món</button>
                        <button class="menu-dropdown-item delete" onclick="deleteMenuItem(${item.id}, '${item.name}', event)">🗑️ Xóa món</button>
                    </div>

                    <div class="name">${item.name}</div>
                    <div class="price">${item.price.toLocaleString('vi-VN')} đ</div>
                </div>
            `;
        });
        catHTML += `</div>`;
        menuContainer.innerHTML += catHTML;
    });
}

// --- 2. HÓA ĐƠN & SỬA GIÁ TRỰC TIẾP ---
function enablePriceEdit(index, tdElement) {
    const currentPrice = cart[index].price;
    tdElement.innerHTML = `
        <input type="number" class="price-input-edit" id="editPriceInput-${index}" value="${currentPrice}" 
               onblur="saveCustomPrice(${index}, this.value)" 
               onkeydown="if(event.key === 'Enter') this.blur();">
    `;
    const input = document.getElementById(`editPriceInput-${index}`);
    if (input) {
        input.focus();
        input.select();
    }
}

function saveCustomPrice(index, newValue) {
    const newPrice = parseInt(newValue);
    if (!isNaN(newPrice) && newPrice >= 0) {
        cart[index].price = newPrice;
    }
    renderCart();
}

function renderCart() {
    const cartBody = document.getElementById('cartBody');
    cartBody.innerHTML = '';
    let subtotalTotal = 0;
    let totalQty = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        subtotalTotal += subtotal;
        totalQty += item.qty;

        cartBody.innerHTML += `
            <tr>
                <td class="col-name">${item.name}</td>
                <td class="col-qty">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                        <span class="qty-number">${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                    </div>
                </td>
                <td class="col-price" ondblclick="enablePriceEdit(${index}, this)" title="Bấm 2 lần để sửa giá">
                    ${subtotal.toLocaleString('vi-VN')}
                </td>
                <td class="col-note">
                    <input type="text" class="note-input" placeholder="Ghi chú..." value="${item.note || ''}" onchange="updateNote(${index}, this.value)">
                </td>
            </tr>
        `;
    });

    let discountPercent = parseFloat(document.getElementById('discountInput').value) || 0;
    if (discountPercent < 0) discountPercent = 0;
    if (discountPercent > 100) discountPercent = 100;

    const discountAmount = Math.round((subtotalTotal * discountPercent) / 100);
    const finalTotal = subtotalTotal - discountAmount;

    const uiSubTotalRow = document.getElementById('uiSubTotalRow');
    const uiDiscountRow = document.getElementById('uiDiscountRow');

    if (discountPercent > 0) {
        uiSubTotalRow.style.display = 'block';
        uiDiscountRow.style.display = 'block';
        document.getElementById('subTotal').innerText = subtotalTotal.toLocaleString('vi-VN');
        document.getElementById('discountPercent').innerText = discountPercent;
        document.getElementById('discountAmount').innerText = discountAmount.toLocaleString('vi-VN');
    } else {
        uiSubTotalRow.style.display = 'none';
        uiDiscountRow.style.display = 'none';
    }

    document.getElementById('grandTotal').innerText = finalTotal.toLocaleString('vi-VN');
    document.getElementById('stickyQty').innerText = totalQty;
    document.getElementById('stickyTotal').innerText = finalTotal.toLocaleString('vi-VN');

    const activeTab = document.querySelector('.tab-content.active').id;
    if (activeTab === 'tab-menu' && cart.length > 0) {
        document.getElementById('cartStickyBar').style.display = 'flex';
    } else {
        document.getElementById('cartStickyBar').style.display = 'none';
    }
}

// --- 3. QUẢN LÝ KHO NGUYÊN LIỆU ---
async function loadStockFromSupabase() {
    const { data, error } = await db.from('stock').select('*').eq('user_id', currentUser.id).order('date', { ascending: false });
    if (error) console.error('Lỗi tải kho:', error);
    else stockList = data || [];
    renderStock();
}

function setTodayStockFilter() {
    document.getElementById('stockFilterStartDate').value = todayStr;
    document.getElementById('stockFilterEndDate').value = todayStr;
    renderStock();
}

function resetStockDateFilter() {
    document.getElementById('stockFilterStartDate').value = '';
    document.getElementById('stockFilterEndDate').value = '';
    renderStock();
}

async function addStockItem() {
    const editId = document.getElementById('editStockId').value;
    const date = document.getElementById('stockDate').value || todayStr;
    const name = document.getElementById('stockName').value.trim();
    const unit = document.getElementById('stockUnit').value.trim() || 'đơn vị';
    const qty = parseFloat(document.getElementById('stockQty').value) || 0;
    const price = parseInt(document.getElementById('stockPrice').value) || 0;

    if (!name) {
        alert('Vui lòng nhập tên nguyên liệu!');
        return;
    }

    if (editId) {
        const { error } = await db.from('stock').update({ date, name, unit, qty, price }).eq('id', editId).eq('user_id', currentUser.id);
        if (error) {
            alert('Lỗi cập nhật nguyên liệu: ' + error.message);
        } else {
            alert('Đã cập nhật nguyên liệu thành công!');
            cancelEditStock();
            loadStockFromSupabase();
        }
    } else {
        const newItem = { id: Date.now(), date, name, unit, qty, price, user_id: currentUser.id };
        const { error } = await db.from('stock').insert([newItem]);
        if (error) {
            alert('Lỗi lưu Supabase: ' + error.message);
        } else {
            stockList.push(newItem);
            cancelEditStock();
            renderStock();
        }
    }
}

function startEditStock(id, event) {
    if (event) event.stopPropagation();
    const item = stockList.find(s => s.id === id);
    if (!item) return;

    document.getElementById('stockFormTitle').innerText = 'Chỉnh Sửa Nguyên Liệu';
    document.getElementById('editStockId').value = item.id;
    document.getElementById('stockDate').value = item.date || todayStr;
    document.getElementById('stockName').value = item.name;
    document.getElementById('stockUnit').value = item.unit;
    document.getElementById('stockQty').value = item.qty;
    document.getElementById('stockPrice').value = item.price;
    document.getElementById('btnCancelStockEdit').style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEditStock() {
    document.getElementById('editStockId').value = '';
    document.getElementById('stockFormTitle').innerText = 'Nhập Nguyên Liệu Mới';
    document.getElementById('stockDate').value = todayStr;
    document.getElementById('stockName').value = '';
    document.getElementById('stockUnit').value = '';
    document.getElementById('stockQty').value = '';
    document.getElementById('stockPrice').value = '';
    document.getElementById('btnCancelStockEdit').style.display = 'none';
}

function viewStockDetail(id, event) {
    if (event) event.stopPropagation();
    const item = stockList.find(s => s.id === id);
    if (!item) return;

    const itemTotal = item.qty * item.price;
    const dateParts = (item.date || todayStr).split('-');
    const displayDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

    let infoHTML = `
        <b>Tên nguyên liệu:</b> ${item.name}<br>
        <b>Ngày nhập:</b> ${displayDate}<br>
        <b>Số lượng:</b> ${item.qty} ${item.unit}<br>
        <b>Đơn giá nhập:</b> ${item.price.toLocaleString('vi-VN')} đ / ${item.unit}<br>
        <hr style="margin: 8px 0; border: 0; border-top: 1px dashed #ccc;">
        <b style="color: #c0392b; font-size: 14px;">TỔNG GIÁ TRỊ NHẬP: ${itemTotal.toLocaleString('vi-VN')} đ</b>
    `;

    document.getElementById('modalStockInfo').innerHTML = infoHTML;
    document.getElementById('stockDetailModal').style.display = 'block';
}

function closeStockDetailModal() {
    document.getElementById('stockDetailModal').style.display = 'none';
}

async function deleteStockItem(id, event) {
    if (event) event.stopPropagation();
    const item = stockList.find(s => s.id === id);
    const itemName = item ? item.name : 'nguyên liệu này';

    if (confirm(`Bạn có chắc muốn xóa "${itemName}" khỏi kho nguyên liệu?`)) {
        const { error } = await db.from('stock').delete().eq('id', id).eq('user_id', currentUser.id);
        if (!error) {
            stockList = stockList.filter(s => s.id !== id);
            renderStock();
        } else {
            alert('Lỗi xóa nguyên liệu: ' + error.message);
        }
    }
}

function toggleStockDayBlock(dateKey) {
    const contentBox = document.getElementById(`stockBlock-${dateKey}`);
    const iconElem = document.getElementById(`stockToggleIcon-${dateKey}`);

    if (contentBox) {
        if (contentBox.style.display === 'none') {
            contentBox.style.display = 'block';
            if (iconElem) iconElem.innerText = '▲ Thu gọn';
        } else {
            contentBox.style.display = 'none';
            if (iconElem) iconElem.innerText = '▼ Xem chi tiết';
        }
    }
}

function toggleStockDropdown(id, event) {
    event.stopPropagation();
    document.querySelectorAll('.menu-dropdown, .action-dropdown, .stock-dropdown').forEach(el => {
        if (el.id !== `stock-dropdown-${id}`) el.classList.remove('show');
    });

    const currentDropdown = document.getElementById(`stock-dropdown-${id}`);
    if (currentDropdown) currentDropdown.classList.toggle('show');
}

function renderStock() {
    const stockContainer = document.getElementById('stockContainer');
    stockContainer.innerHTML = '';

    const startDate = document.getElementById('stockFilterStartDate').value;
    const endDate = document.getElementById('stockFilterEndDate').value;

    let filteredStock = stockList;

    if (startDate || endDate) {
        filteredStock = stockList.filter(item => {
            let itemDate = item.date || todayStr;
            if (startDate && itemDate < startDate) return false;
            if (endDate && itemDate > endDate) return false;
            return true;
        });
    }

    let totalValAll = 0;

    if (filteredStock.length === 0) {
        stockContainer.innerHTML = '<div style="text-align: center; color: #8e8e93; padding: 20px;">Không có nguyên liệu nào trong khoảng thời gian này!</div>';
        document.getElementById('totalStockValue').innerText = "0 đ";
        return;
    }

    const stockByDate = {};
    filteredStock.forEach(item => {
        let dateKey = item.date || todayStr;
        if (!stockByDate[dateKey]) {
            stockByDate[dateKey] = [];
        }
        stockByDate[dateKey].push(item);
    });

    const dates = Object.keys(stockByDate).sort().reverse();

    dates.forEach((d, index) => {
        const itemsInDate = stockByDate[d];
        let dayTotal = 0;

        const dateParts = d.split('-');
        const displayDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        const isDefaultOpen = index === 0;
        const displayStyle = isDefaultOpen ? 'block' : 'none';
        const iconText = isDefaultOpen ? '▲ Thu gọn' : '▼ Xem chi tiết';

        let dayHTML = `
            <div class="day-toggle-header stock-header" onclick="toggleStockDayBlock('${d}')">
                <div>
                    📅 <b>Ngày nhập: ${displayDate}</b> (${itemsInDate.length} NL)
                    <span class="day-toggle-icon" id="stockToggleIcon-${d}">${iconText}</span>
                </div>
                <span id="dayTotal-${d}" style="color: #27ae60;">0 đ</span>
            </div>
            
            <div id="stockBlock-${d}" style="display: ${displayStyle}; overflow-x: visible;">
                <table class="stock-table" style="margin-bottom: 5px;">
                    <thead>
                        <tr>
                            <th style="width: 35%;">Tên NL</th>
                            <th style="width: 25%; text-align: center;">Số lượng</th>
                            <th style="width: 25%; text-align: right;">Giá nhập</th>
                            <th style="width: 15%; text-align: center;">⚙️</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        itemsInDate.forEach(item => {
            const itemTotal = item.qty * item.price;
            dayTotal += itemTotal;
            totalValAll += itemTotal;

            dayHTML += `
                <tr>
                    <td onclick="viewStockDetail(${item.id}, event)" style="cursor: pointer;">
                        <div><b>${item.name}</b></div>
                        <div style="font-size: 10px; color: #7f8c8d;">ĐVT: ${item.unit}</div>
                    </td>
                    <td style="text-align: center;">
                        <span class="stock-qty-display">${item.qty} ${item.unit}</span>
                    </td>
                    <td style="text-align: right; font-weight: 500;">${item.price.toLocaleString('vi-VN')} đ</td>
                    <td style="text-align: center; position: relative;">
                        <span class="stock-dots-btn" onclick="toggleStockDropdown(${item.id}, event)">⋮</span>
                        
                        <div class="stock-dropdown" id="stock-dropdown-${item.id}">
                            <button class="menu-dropdown-item view" onclick="viewStockDetail(${item.id}, event)">👁️ Xem chi tiết</button>
                            <button class="menu-dropdown-item edit" onclick="startEditStock(${item.id}, event)">✏️ Chỉnh sửa</button>
                            <button class="menu-dropdown-item delete" onclick="deleteStockItem(${item.id}, event)">🗑️ Xóa NL</button>
                        </div>
                    </td>
                </tr>
            `;
        });

        dayHTML += `</tbody></table></div>`;
        stockContainer.innerHTML += dayHTML;

        setTimeout(() => {
            const dayElem = document.getElementById(`dayTotal-${d}`);
            if (dayElem) dayElem.innerText = "Tổng: " + dayTotal.toLocaleString('vi-VN') + " đ";
        }, 10);
    });

    document.getElementById('totalStockValue').innerText = totalValAll.toLocaleString('vi-VN') + " đ";
}

// --- 4. BÁO CÁO DOANH THU & BIỂU ĐỒ ---
async function loadSalesHistoryFromSupabase() {
    const { data, error } = await db.from('sales_history').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });
    if (error) console.error('Lỗi tải báo cáo:', error);
    else salesHistory = data || [];
    renderHistory();
}

function setTodayFilter() {
    document.getElementById('filterStartDate').value = todayStr;
    document.getElementById('filterEndDate').value = todayStr;
    renderHistory();
}

function resetDateFilter() {
    document.getElementById('filterStartDate').value = '';
    document.getElementById('filterEndDate').value = '';
    renderHistory();
}

function toggleActionDropdown(id, event) {
    event.stopPropagation();
    document.querySelectorAll('.menu-dropdown, .action-dropdown, .stock-dropdown').forEach(el => {
        if (el.id !== `action-dropdown-${id}`) el.classList.remove('show');
    });

    const currentDropdown = document.getElementById(`action-dropdown-${id}`);
    if (currentDropdown) currentDropdown.classList.toggle('show');
}

function toggleDayOrders(dateKey) {
    const contentBox = document.getElementById(`dayOrdersBlock-${dateKey}`);
    const iconElem = document.getElementById(`toggleIcon-${dateKey}`);

    if (contentBox) {
        if (contentBox.style.display === 'none') {
            contentBox.style.display = 'block';
            if (iconElem) iconElem.innerText = '▲ Thu gọn';
        } else {
            contentBox.style.display = 'none';
            if (iconElem) iconElem.innerText = '▼ Xem chi tiết';
        }
    }
}

function viewOrderDetail(orderId) {
    const order = salesHistory.find(o => o.id === orderId);
    if (!order) return;

    let infoHTML = `
        <b>Loại đơn:</b> ${order.type || 'Chưa rõ'}<br>
        <b>Khách hàng:</b> ${order.customer || 'Khách vãng lai'}<br>
        <b>Số điện thoại:</b> ${order.phone || 'Chưa nhập'}<br>
    `;
    if (order.address) infoHTML += `<b>Địa chỉ ship:</b> ${order.address}<br>`;
    if (order.pickup_time) infoHTML += `<b>Giờ tới lấy:</b> ${order.pickup_time}<br>`;
    infoHTML += `<b>Thời gian tạo:</b> ${order.time}`;

    document.getElementById('modalOrderInfo').innerHTML = infoHTML;

    const itemsBody = document.getElementById('modalOrderItemsBody');
    itemsBody.innerHTML = '';

    if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
            const itemSubtotal = item.price * item.qty;
            let noteStr = item.note ? `<br><small style="color:#7f8c8d;">└ Note: ${item.note}</small>` : '';
            itemsBody.innerHTML += `
                <tr>
                    <td>${item.name}${noteStr}</td>
                    <td style="text-align: center;">${item.qty}</td>
                    <td style="text-align: right;">${itemSubtotal.toLocaleString('vi-VN')} đ</td>
                </tr>
            `;
        });
    }

    let totalHTML = '';
    if (order.discount_percent > 0) {
        totalHTML += `<div style="font-size: 11px; color:#7f8c8d;">Tạm tính: ${(order.subtotal || 0).toLocaleString('vi-VN')} đ</div>`;
        totalHTML += `<div style="font-size: 11px; color:#e67e22;">Giảm giá (${order.discount_percent}%): -${(order.discount_amount || 0).toLocaleString('vi-VN')} đ</div>`;
    }
    totalHTML += `TỔNG CỘNG: ${(order.total || 0).toLocaleString('vi-VN')} đ`;

    document.getElementById('modalOrderTotal').innerHTML = totalHTML;
    document.getElementById('orderDetailModal').style.display = 'block';
}

function closeOrderDetailModal() {
    document.getElementById('orderDetailModal').style.display = 'none';
}

// 🖨️ IN LẠI ĐƠN HÀNG DẠNG BITMAP CHỮ TO & RÕ NÉT
async function rePrintOrder(orderId) {
    const order = salesHistory.find(o => o.id === orderId);
    if (!order) {
        alert('Không tìm thấy dữ liệu đơn hàng để in!');
        return;
    }

    document.getElementById('printOrderType').innerText = "[ " + (order.type || 'HÓA ĐƠN') + " - IN LẠI ]";
    let infoHTML = `<b>Khách:</b> ${order.customer || 'Khách vãng lai'}<br>`;
    if (order.phone) infoHTML += `<b>SĐT:</b> ${order.phone}<br>`;
    if (order.address) infoHTML += `<b>Địa chỉ ship:</b> ${order.address}<br>`;
    if (order.pickup_time) infoHTML += `<b>Giờ tới lấy:</b> ${order.pickup_time}<br>`;
    document.getElementById('printCustomerInfo').innerHTML = infoHTML;

    const printBody = document.getElementById('printBody');
    printBody.innerHTML = '';

    (order.items || []).forEach(item => {
        const subtotal = item.price * item.qty;
        let rowHTML = `
            <tr>
                <td>${item.name}</td>
                <td class="num">${item.qty}</td>
                <td class="num">${subtotal.toLocaleString('vi-VN')}</td>
            </tr>
        `;
        if (item.note && item.note.trim() !== '') {
            rowHTML += `<tr><td colspan="3" class="receipt-note">└> Ghi chú: ${item.note.trim()}</td></tr>`;
        }
        printBody.innerHTML += rowHTML;
    });

    const printDiscountBlock = document.getElementById('printDiscountBlock');
    if (order.discount_percent > 0) {
        document.getElementById('printSubTotal').innerText = (order.subtotal || order.total).toLocaleString('vi-VN');
        document.getElementById('printDiscountPercent').innerText = order.discount_percent;
        document.getElementById('printDiscountVal').innerText = (order.discount_amount || 0).toLocaleString('vi-VN');
        printDiscountBlock.style.display = 'block';
    } else {
        printDiscountBlock.style.display = 'none';
    }

    document.getElementById('printTotal').innerText = (order.total || 0).toLocaleString('vi-VN');

    // In hóa đơn dạng Bitmap Tiếng Việt qua Bluetooth
    await printOrderAsBitmap(order);
}

function editOrder(orderId) {
    const order = salesHistory.find(o => o.id === orderId);
    if (!order) return;

    if (confirm(`Bạn có muốn nạp đơn hàng của khách "${order.customer}" vào giỏ để chỉnh sửa không?`)) {
        editingOrderId = order.id;

        cart = JSON.parse(JSON.stringify(order.items || []));
        document.getElementById('orderType').value = order.type || (storeOrderTypes[0]?.name || '');
        document.getElementById('customerName').value = order.customer || '';
        document.getElementById('customerPhone').value = order.phone || '';
        document.getElementById('customerAddress').value = order.address || '';
        document.getElementById('pickupTime').value = order.pickup_time || '';
        document.getElementById('discountInput').value = order.discount_percent || '';

        toggleOrderFields();
        renderCart();
        switchTab('cart');
    }
}

// 📊 VẼ BIỂU ĐỒ TOP 10 MÓN BÁN CHẠY
function renderTopItemsChart(filteredOrders) {
    const itemQtyMap = {};

    const otherCategoryItemNames = menu
        .filter(m => (m.category || "Khác") === "Khác")
        .map(m => m.name.toLowerCase().trim());

    filteredOrders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const itemNameTrim = (item.name || '').trim();
                const itemNameLower = itemNameTrim.toLowerCase();

                if (otherCategoryItemNames.includes(itemNameLower) || itemNameLower === 'phí ship') {
                    return;
                }

                if (!itemQtyMap[itemNameTrim]) {
                    itemQtyMap[itemNameTrim] = 0;
                }
                itemQtyMap[itemNameTrim] += (item.qty || 0);
            });
        }
    });

    const sortedItems = Object.keys(itemQtyMap)
        .map(name => ({ name, qty: itemQtyMap[name] }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 10);

    const labels = sortedItems.map(i => i.name);
    const dataValues = sortedItems.map(i => i.qty);

    const canvas = document.getElementById('topItemsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (topItemsChartInstance) {
        topItemsChartInstance.destroy();
    }

    topItemsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Số lượng bán',
                data: dataValues,
                backgroundColor: 'rgba(211, 84, 0, 0.75)',
                borderColor: 'rgba(211, 84, 0, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return ` Đã bán: ${context.parsed.y} phần`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: { size: 10 },
                        maxRotation: 45,
                        minRotation: 25
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

function renderHistory() {
    const salesContainer = document.getElementById('salesHistoryContainer');
    salesContainer.innerHTML = '';

    const startDate = document.getElementById('filterStartDate').value;
    const endDate = document.getElementById('filterEndDate').value;

    let filteredOrders = salesHistory;

    if (startDate || endDate) {
        filteredOrders = salesHistory.filter(order => {
            let orderDate = todayStr;
            if (order.created_at) {
                orderDate = order.created_at.split('T')[0];
            }
            if (startDate && orderDate < startDate) return false;
            if (endDate && orderDate > endDate) return false;
            return true;
        });
    }

    renderTopItemsChart(filteredOrders);

    let grandTotalAccumulated = 0;

    if (filteredOrders.length === 0) {
        salesContainer.innerHTML = '<div style="text-align: center; color: #8e8e93; padding: 20px;">Không có đơn hàng nào trong khoảng thời gian này!</div>';
        document.getElementById('dailyOrderCount').innerText = "0 đơn";
        document.getElementById('dailyTotalAmount').innerText = "0 đ";
        return;
    }

    const historyByDate = {};

    filteredOrders.forEach(order => {
        grandTotalAccumulated += order.total;
        let dateKey = todayStr;
        if (order.created_at) {
            dateKey = order.created_at.split('T')[0];
        }

        if (!historyByDate[dateKey]) {
            historyByDate[dateKey] = [];
        }
        historyByDate[dateKey].push(order);
    });

    const sortedDates = Object.keys(historyByDate).sort().reverse();

    sortedDates.forEach((d, index) => {
        const ordersInDay = historyByDate[d];

        ordersInDay.sort((a, b) => {
            if (b.time && a.time) {
                return b.time.localeCompare(a.time);
            }
            return b.id - a.id;
        });

        let dayTotalSales = 0;

        const dateParts = d.split('-');
        const displayDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        const isDefaultOpen = index === 0;
        const displayStyle = isDefaultOpen ? 'block' : 'none';
        const iconText = isDefaultOpen ? '▲ Thu gọn' : '▼ Xem chi tiết';

        let dayHTML = `
            <div class="day-toggle-header" onclick="toggleDayOrders('${d}')">
                <div>
                    📅 <b>Ngày: ${displayDate}</b> (${ordersInDay.length} đơn)
                    <span class="day-toggle-icon" id="toggleIcon-${d}">${iconText}</span>
                </div>
                <span id="salesDayTotal-${d}" style="color: #c0392b;">0 đ</span>
            </div>
            
            <div id="dayOrdersBlock-${d}" style="display: ${displayStyle}; overflow-x: visible;">
                <table class="report-table" style="margin-bottom: 5px;">
                    <thead>
                        <tr>
                            <th style="width: 22%;">Giờ</th>
                            <th style="width: 43%;">Khách / Món</th>
                            <th style="width: 25%; text-align: right;">Tiền</th>
                            <th style="width: 10%; text-align: center;">⚙️</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        ordersInDay.forEach(order => {
            dayTotalSales += order.total;
            let subDetail = order.type || '';
            if (order.pickup_time) subDetail += ` (${order.pickup_time})`;

            let itemsSummary = '';
            if (order.items && Array.isArray(order.items)) {
                itemsSummary = order.items.map(i => `${i.name} (${i.qty})`).join(', ');
            }

            dayHTML += `
                <tr>
                    <td><b>${order.time}</b></td>
                    <td onclick="viewOrderDetail(${order.id})" style="cursor: pointer;">
                        <div><b>${order.customer}</b></div>
                        <div style="font-size: 10px; color: #d35400;">${subDetail}</div>
                        <div style="font-size: 10px; color: #7f8c8d; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">
                            ${itemsSummary}
                        </div>
                    </td>
                    <td style="text-align: right; font-weight: bold; color: #c0392b;">${order.total.toLocaleString('vi-VN')} đ</td>
                    <td style="text-align: center; position: relative;">
                        <span class="action-dots-btn" onclick="toggleActionDropdown(${order.id}, event)">⋮</span>
                        
                        <div class="action-dropdown" id="action-dropdown-${order.id}">
                            <button class="menu-dropdown-item view" onclick="viewOrderDetail(${order.id})">👁️ Xem chi tiết</button>
                            <button class="menu-dropdown-item print" onclick="rePrintOrder(${order.id})">🖨️ In lại đơn</button>
                            <button class="menu-dropdown-item edit" onclick="editOrder(${order.id})">✏️ Sửa đơn</button>
                            <button class="menu-dropdown-item delete" onclick="deleteOrder(${order.id})">🗑️ Xóa đơn</button>
                        </div>
                    </td>
                </tr>
            `;
        });

        dayHTML += `</tbody></table></div>`;
        salesContainer.innerHTML += dayHTML;

        setTimeout(() => {
            const dayElem = document.getElementById(`salesDayTotal-${d}`);
            if (dayElem) dayElem.innerText = "Tổng: " + dayTotalSales.toLocaleString('vi-VN') + " đ";
        }, 10);
    });

    document.getElementById('dailyOrderCount').innerText = filteredOrders.length + " đơn";
    document.getElementById('dailyTotalAmount').innerText = grandTotalAccumulated.toLocaleString('vi-VN') + " đ";
}

async function printReceipt() {
    if (cart.length === 0) {
        alert('Chưa có món nào trong hóa đơn!');
        return;
    }

    const orderType = document.getElementById('orderType').value;
    const customerName = document.getElementById('customerName').value.trim() || 'Khách vãng lai';
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const customerAddress = document.getElementById('customerAddress').value.trim();
    const pickupTime = document.getElementById('pickupTime').value;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    let subtotalTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let discountPercent = parseFloat(document.getElementById('discountInput').value) || 0;
    const discountAmount = Math.round((subtotalTotal * discountPercent) / 100);
    const finalTotal = subtotalTotal - discountAmount;

    const typeObj = storeOrderTypes.find(t => t.name === orderType);

    const orderRecord = {
        user_id: currentUser.id,
        time: timeStr,
        type: orderType,
        customer: customerName,
        phone: customerPhone,
        address: (typeObj && typeObj.require_address) ? customerAddress : '',
        pickup_time: (typeObj && typeObj.require_time) ? pickupTime : '',
        subtotal: subtotalTotal,
        discount_percent: discountPercent,
        discount_amount: discountAmount,
        total: finalTotal,
        items: cart
    };

    if (editingOrderId) {
        const { error } = await db.from('sales_history').update(orderRecord).eq('id', editingOrderId).eq('user_id', currentUser.id);
        if (error) {
            console.error('Lỗi cập nhật đơn hàng:', error);
            alert('Lỗi khi cập nhật đơn hàng: ' + error.message);
            return;
        } else {
            const index = salesHistory.findIndex(o => o.id === editingOrderId);
            if (index !== -1) {
                salesHistory[index] = { ...orderRecord, id: editingOrderId };
            }
        }
    } else {
        orderRecord.id = Date.now();
        const { error } = await db.from('sales_history').insert([orderRecord]);
        if (error) {
            console.error('Lỗi lưu đơn hàng:', error);
            alert('Lỗi khi lưu đơn hàng: ' + error.message);
            return;
        } else {
            salesHistory.push(orderRecord);
        }
    }

    if (currentUser.store_name) document.getElementById('printStoreName').innerText = currentUser.store_name;
    if (currentUser.store_address) document.getElementById('printStoreAddress').innerText = 'ĐC: ' + currentUser.store_address;
    if (currentUser.store_phone) document.getElementById('printStorePhone').innerText = 'SĐT: ' + currentUser.store_phone;
    if (currentUser.store_fb) document.getElementById('printStoreFb').innerText = currentUser.store_fb;

    document.getElementById('printOrderType').innerText = "[ " + orderType + " ]";
    let infoHTML = `<b>Khách:</b> ${customerName}<br>`;
    if (customerPhone) infoHTML += `<b>SĐT:</b> ${customerPhone}<br>`;

    const typeObjPrint = storeOrderTypes.find(t => t.name === orderType);
    if (typeObjPrint && typeObjPrint.require_address && customerAddress) {
        infoHTML += `<b>Địa chỉ ship:</b> ${customerAddress}<br>`;
    } else if (typeObjPrint && typeObjPrint.require_time && pickupTime) {
        infoHTML += `<b>Giờ tới lấy:</b> ${pickupTime}<br>`;
    }

    document.getElementById('printCustomerInfo').innerHTML = infoHTML;

    const printBody = document.getElementById('printBody');
    printBody.innerHTML = '';

    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        let rowHTML = `
            <tr>
                <td>${item.name}</td>
                <td class="num">${item.qty}</td>
                <td class="num">${subtotal.toLocaleString('vi-VN')}</td>
            </tr>
        `;
        if (item.note && item.note.trim() !== '') {
            rowHTML += `<tr><td colspan="3" class="receipt-note">└> Ghi chú: ${item.note.trim()}</td></tr>`;
        }
        printBody.innerHTML += rowHTML;
    });

    const printDiscountBlock = document.getElementById('printDiscountBlock');
    if (discountPercent > 0) {
        document.getElementById('printSubTotal').innerText = subtotalTotal.toLocaleString('vi-VN');
        document.getElementById('printDiscountPercent').innerText = discountPercent;
        document.getElementById('printDiscountVal').innerText = discountAmount.toLocaleString('vi-VN');
        printDiscountBlock.style.display = 'block';
    } else {
        printDiscountBlock.style.display = 'none';
    }

    document.getElementById('printTotal').innerText = finalTotal.toLocaleString('vi-VN');

    // In hóa đơn dạng Bitmap Tiếng Việt chữ to & nét qua Bluetooth
    await printOrderAsBitmap(orderRecord);

    closeOrderTab(activeOrderIndex);
    renderHistory();
    switchTab('menu');
}

async function deleteOrder(orderId) {
    if (confirm('Bạn có chắc muốn xóa hóa đơn này khỏi Supabase?')) {
        const { error } = await db.from('sales_history').delete().eq('id', orderId).eq('user_id', currentUser.id);
        if (!error) {
            salesHistory = salesHistory.filter(o => o.id !== orderId);
            renderHistory();
        }
    }
}

// --- 5. HÀM XỬ LÝ GIAO DIỆN & BLUETOOTH ---
function toggleOrderFields() {
    const orderType = document.getElementById('orderType').value;
    const addressRow = document.getElementById('addressRow');
    const pickupTimeRow = document.getElementById('pickupTimeRow');

    const typeObj = storeOrderTypes.find(t => t.name === orderType);

    if (typeObj) {
        addressRow.style.display = typeObj.require_address ? 'flex' : 'none';
        pickupTimeRow.style.display = typeObj.require_time ? 'flex' : 'none';
    } else {
        addressRow.style.display = 'none';
        pickupTimeRow.style.display = 'none';
    }
}

function filterMenu() {
    const keyword = removeVietnameseTones(document.getElementById('searchInput').value.trim().toLowerCase());
    const filteredMenu = menu.filter(item => removeVietnameseTones(item.name).toLowerCase().includes(keyword));
    renderMenu(filteredMenu);
}

async function connectBluetooth() {
    if (!navigator.bluetooth) {
        alert('Trình duyệt chưa hỗ trợ Web Bluetooth trực tiếp. Trên iPhone, bạn dùng máy in qua AirPrint hoặc tải trình duyệt "Blueify".');
        return;
    }

    try {
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb', '49535343-fe7d-4113-a44d-42580275f783']
        });

        const server = await bluetoothDevice.gatt.connect();
        const services = await server.getPrimaryServices();

        for (let service of services) {
            const characteristics = await service.getCharacteristics();
            for (let c of characteristics) {
                if (c.properties.write || c.properties.writeWithoutResponse) {
                    printCharacteristic = c;
                    break;
                }
            }
        }

        if (printCharacteristic) {
            alert('Đã kết nối thành công với máy in: ' + bluetoothDevice.name);
        } else {
            alert('Kết nối thành công nhưng không tìm thấy cổng in!');
        }
    } catch (error) {
        console.error(error);
        alert('Lỗi kết nối Bluetooth: ' + error.message);
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    document.getElementById('tab-' + tabName).classList.add('active');
    document.getElementById('nav-' + tabName).classList.add('active');

    const stickyBar = document.getElementById('cartStickyBar');
    if (tabName === 'menu' && cart.length > 0) {
        stickyBar.style.display = 'flex';
    } else {
        stickyBar.style.display = 'none';
    }

    // Select the first category by default
    if (categories.length > 0) {
        selectCategory(categories[0]);
    }
}

async function loadOrderTypesFromSupabase() {
    const { data, error } = await db.from('order_types').select('*').eq('user_id', currentUser.id).order('id', { ascending: true });

    if (error) {
        console.error('Error fetching order types:', error);
        return;
    }

    if (data && data.length > 0) {
        storeOrderTypes = data;
    } else {
        await db.from('order_types').insert(defaultOrderTypes.map(item => ({ ...item, user_id: currentUser.id })));
        const { data: newData } = await db.from('order_types').select('*').eq('user_id', currentUser.id).order('id', { ascending: true });
        if (newData) storeOrderTypes = newData;
    }

    const orderTypeSelect = document.getElementById('orderType');
    orderTypeSelect.innerHTML = '';
    storeOrderTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.name;
        option.innerText = type.name;
        orderTypeSelect.appendChild(option);
    });

    toggleOrderFields(); // Update UI based on the first selected type
}

function selectCategory(category) {
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`.cat-btn[onclick="selectCategory('${category}')"]`);
    if (btn) btn.classList.add('active');
    renderMenu(category);
}

function addToCart(index) {
    const item = menu[index];
    const existing = cart.find(c => c.name === item.name);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1, note: '' });
    }
    renderCart();
}

function updateQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    renderCart();
}

function updateNote(index, value) {
    cart[index].note = value;
}

function clearCart() {
    parkedOrders[activeOrderIndex] = {
        cart: [], type: 'SHIP MANG VỀ', customer: '', phone: '', address: '', pickupTime: '', discount: ''
    };
    loadOrderState(activeOrderIndex);
    editingOrderId = null;
}
// KHỞI TẠO DỮ LIỆU TỪ SUPABASE
initAuth();
cart = parkedOrders[0].cart;
