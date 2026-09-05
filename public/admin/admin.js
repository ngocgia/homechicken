// =========================================================================
// ⚙️ CẤU HÌNH API
// Tự động nhận diện host: nếu chạy cùng domain hoặc localhost thì dùng relative '/api' hoặc origin, fallback production
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? (window.location.port === '3000' || window.location.port === '' ? '/api' : 'http://localhost:3000/api')
    : (window.location.protocol.startsWith('http') ? `${window.location.origin}/api` : 'https://giavdn.pro.vn/api');

const db = createApiClient(API_BASE);

// Hàm định dạng tiền tệ VNĐ chuẩn (xử lý an toàn cả số và chuỗi từ database)
function formatMoney(amount) {
    const num = Number(amount) || 0;
    return Math.round(num).toLocaleString('vi-VN');
}

let currentUser = null;
let allUsers = [];
let currentStoreForMenu = null;
let currentStoreMenu = [];

let currentStoreForTypes = null;
let currentStoreTypes = [];

let currentStoreForLanding = null;
let currentStoreLandingInfo = null;
let currentStoreUsername = null;

// =========================================================================
// 🚀 INIT & AUTH
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});

async function initAuth() {
    const savedUser = localStorage.getItem('pos_current_user');
    if (!savedUser) {
        alert('Bạn chưa đăng nhập! Vui lòng đăng nhập ở trang POS trước.');
        window.location.href = '../index.html';
        return;
    }
    
    currentUser = JSON.parse(savedUser);
    
    // Kiểm tra quyền Super Admin
    if (currentUser.username !== 'admin') {
        alert('Bạn không có quyền truy cập trang Super Admin!');
        window.location.href = '../index.html';
        return;
    }
    
    document.getElementById('headerUsername').innerText = currentUser.username;
    
    loadUsers();
}

// =========================================================================
// 👥 QUẢN LÝ NGƯỜI DÙNG (CỬA HÀNG)
// =========================================================================
async function loadUsers() {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Đang tải dữ liệu...</td></tr>';
    
    const { data, error } = await db.from('users').select('*').order('id', { ascending: true });
    
    if (error) {
        console.error('Error fetching users:', error);
        showToast('Lỗi tải danh sách cửa hàng!', 'error');
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: red;">Lỗi tải dữ liệu</td></tr>';
        return;
    }
    
    allUsers = data;
    renderUserTable();
}

function renderUserTable() {
    cleanupDropdowns();
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';
    
    if (allUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Chưa có dữ liệu</td></tr>';
        return;
    }
    
    allUsers.forEach(user => {
        // Không cho phép sửa/xóa tài khoản admin gốc
        const isRootAdmin = user.username === 'admin';
        const safeStoreName = (user.store_name || user.username).replace(/'/g, "\\'");
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${user.username}</strong></td>
            <td>${isRootAdmin ? '******' : user.password}</td>
            <td>${user.store_name || '-'}</td>
            <td>${user.store_phone || '-'}</td>
            <td>
                ${isRootAdmin ? '<span style="color: gray; font-size: 12px;">Root</span>' : `
                <div class="dropdown">
                    <button class="btn btn-secondary btn-sm dropbtn" onclick="toggleDropdown('drop-user-${user.id}', event)">
                        Hành động ▾
                    </button>
                    <div id="drop-user-${user.id}" class="dropdown-content">
                        <a href="#" onclick="event.preventDefault(); editUser('${user.id}')">✏️ Sửa thông tin</a>
                        <a href="#" onclick="event.preventDefault(); openMenuManager('${user.id}', '${safeStoreName}')" style="color: var(--primary);">🍔 Quản lý Menu</a>
                        <a href="#" onclick="event.preventDefault(); openOrderTypeManager('${user.id}', '${safeStoreName}')" style="color: #eab308;">📦 Quản lý Loại Đơn</a>
                        <a href="#" onclick="event.preventDefault(); openLandingManager('${user.id}', '${safeStoreName}')" style="color: #10b981;">🌐 QL Landing Page</a>
                        <a href="#" onclick="event.preventDefault(); deleteUser('${user.id}', '${user.username.replace(/'/g, "\\'")}')" style="color: var(--error);">🗑️ Xóa cửa hàng</a>
                    </div>
                </div>
                `}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// =========================================================================
// 🪟 MODAL LOGIC
// =========================================================================
function openUserModal() {
    document.getElementById('modalTitle').innerText = 'Thêm Cửa Hàng Mới';
    document.getElementById('editUserId').value = '';
    document.getElementById('modalUsername').value = '';
    document.getElementById('modalPassword').value = '';
    document.getElementById('modalStoreName').value = '';
    document.getElementById('modalStorePhone').value = '';
    document.getElementById('modalStoreAddress').value = '';
    document.getElementById('modalStoreFb').value = '';
    document.getElementById('modalStoreFbUrl').value = '';
    
    document.getElementById('userModal').classList.remove('hidden');
}

function closeUserModal() {
    document.getElementById('userModal').classList.add('hidden');
}

function editUser(id) {
    const user = allUsers.find(u => u.id == id);
    if (!user) return;
    
    document.getElementById('modalTitle').innerText = 'Cập Nhật Cửa Hàng';
    document.getElementById('editUserId').value = user.id;
    document.getElementById('modalUsername').value = user.username;
    document.getElementById('modalPassword').value = user.password;
    document.getElementById('modalStoreName').value = user.store_name || '';
    document.getElementById('modalStorePhone').value = user.store_phone || '';
    document.getElementById('modalStoreAddress').value = user.store_address || '';
    document.getElementById('modalStoreFb').value = user.store_fb || '';
    document.getElementById('modalStoreFbUrl').value = user.store_fb_url || '';
    
    document.getElementById('userModal').classList.remove('hidden');
}

async function saveUser() {
    const editId = document.getElementById('editUserId').value;
    
    const username = document.getElementById('modalUsername').value.trim();
    const password = document.getElementById('modalPassword').value.trim();
    const store_name = document.getElementById('modalStoreName').value.trim();
    const store_phone = document.getElementById('modalStorePhone').value.trim();
    const store_address = document.getElementById('modalStoreAddress').value.trim();
    const store_fb = document.getElementById('modalStoreFb').value.trim();
    const store_fb_url = document.getElementById('modalStoreFbUrl').value.trim();
    
    if (!username || !password) {
        showToast('Tên đăng nhập và mật khẩu không được bỏ trống!', 'error');
        return;
    }
    
    const btn = document.getElementById('btnSaveUser');
    const spinner = btn.querySelector('.btn-spinner');
    const span = btn.querySelector('span');
    
    spinner.classList.remove('hidden');
    span.classList.add('hidden');
    btn.disabled = true;
    
    const payload = {
        username,
        password,
        store_name,
        store_phone,
        store_address,
        store_fb,
        store_fb_url
    };
    
    try {
        if (editId) {
            // Kiểm tra trùng username (nếu username đổi)
            const existing = allUsers.find(u => u.username === username && u.id != editId);
            if (existing) {
                showToast('Tên đăng nhập này đã tồn tại!', 'error');
                return;
            }
            
            // Cập nhật
            const { error } = await db.from('users').update(payload).eq('id', editId);
            if (error) throw error;
            showToast('Cập nhật thành công!', 'success');
        } else {
            // Kiểm tra trùng username
            const existing = allUsers.find(u => u.username === username);
            if (existing) {
                showToast('Tên đăng nhập này đã tồn tại!', 'error');
                return;
            }
            
            // Thêm mới
            const { error } = await db.from('users').insert([payload]);
            if (error) throw error;
            showToast('Thêm cửa hàng thành công!', 'success');
        }
        
        closeUserModal();
        loadUsers();
        
    } catch (error) {
        console.error('Lỗi khi lưu cửa hàng:', error);
        showToast('Lỗi: ' + error.message, 'error');
    } finally {
        spinner.classList.add('hidden');
        span.classList.remove('hidden');
        btn.disabled = false;
    }
}

async function deleteUser(id, username) {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}"?\nMọi dữ liệu liên quan của cửa hàng này có thể sẽ mất!`)) {
        return;
    }
    
    try {
        const { error } = await db.from('users').delete().eq('id', id);
        if (error) throw error;
        
        showToast('Đã xóa cửa hàng!', 'success');
        loadUsers();
    } catch (error) {
        console.error('Lỗi khi xóa cửa hàng:', error);
        showToast('Lỗi xóa: ' + error.message, 'error');
    }
}

// =========================================================================
// 🍔 QUẢN LÝ THỰC ĐƠN (MENU)
// =========================================================================
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

function openMenuManager(userId, storeName) {
    currentStoreForMenu = isNaN(userId) ? userId : parseInt(userId, 10);
    document.getElementById('menuStoreTitle').innerText = 'Thực đơn: ' + storeName;
    
    // Switch Tabs
    document.getElementById('tab-users').classList.add('hidden');
    document.getElementById('tab-users').style.display = 'none';
    
    document.getElementById('tab-menu').classList.remove('hidden');
    document.getElementById('tab-menu').style.display = 'block';
    
    loadStoreMenu();
}

function backToUsers() {
    currentStoreForMenu = null;
    currentStoreForTypes = null;
    
    document.getElementById('tab-menu').classList.add('hidden');
    document.getElementById('tab-menu').style.display = 'none';
    
    document.getElementById('tab-ordertypes').classList.add('hidden');
    document.getElementById('tab-ordertypes').style.display = 'none';

    document.getElementById('tab-landing').classList.add('hidden');
    document.getElementById('tab-landing').style.display = 'none';
    
    document.getElementById('tab-users').classList.remove('hidden');
    document.getElementById('tab-users').style.display = 'block';
}

async function loadStoreMenu() {
    const tbody = document.getElementById('menuTableBody');
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Đang tải dữ liệu...</td></tr>';
    
    const { data, error } = await db.from('menu').select('*').eq('user_id', currentStoreForMenu).order('id', { ascending: true });
    
    if (error) {
        console.error('Error fetching menu:', error);
        showToast('Lỗi tải thực đơn!', 'error');
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: red;">Lỗi tải dữ liệu</td></tr>';
        return;
    }
    
    if (data && data.length > 0) {
        currentStoreMenu = data.map(item => ({ ...item, price: Number(item.price) || 0 }));
        renderMenuTable();
    } else {
        // Tạo menu mặc định nếu cửa hàng chưa có món nào (vừa tạo xong)
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Khởi tạo menu mặc định...</td></tr>';
        const { error: insertErr } = await db.from('menu').insert(
            defaultMenu.map(item => ({ ...item, user_id: currentStoreForMenu }))
        );
        
        if (insertErr) {
            console.error('Error seeding default menu:', insertErr);
            showToast('Lỗi tạo menu mặc định!', 'error');
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Cửa hàng này chưa có món nào</td></tr>';
            currentStoreMenu = [];
            return;
        }
        
        // Load lại
        const { data: newData, error: fetchErr } = await db.from('menu').select('*').eq('user_id', currentStoreForMenu).order('id', { ascending: true });
        if (fetchErr) {
            currentStoreMenu = [];
        } else {
            currentStoreMenu = (newData || []).map(item => ({ ...item, price: Number(item.price) || 0 }));
        }
        renderMenuTable();
    }
}

function renderMenuTable() {
    cleanupDropdowns();
    const tbody = document.getElementById('menuTableBody');
    tbody.innerHTML = '';
    
    if (currentStoreMenu.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Cửa hàng này chưa có món nào</td></tr>';
        return;
    }
    
    currentStoreMenu.forEach(item => {
        const safeName = item.name.replace(/'/g, "\\'");
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.category}</td>
            <td><strong>${item.name}</strong></td>
            <td>${formatMoney(item.price)} đ</td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-secondary btn-sm dropbtn" onclick="toggleDropdown('drop-menu-${item.id}', event)">
                        Hành động ▾
                    </button>
                    <div id="drop-menu-${item.id}" class="dropdown-content">
                        <a href="#" onclick="event.preventDefault(); editMenu('${item.id}')">✏️ Sửa món</a>
                        <a href="#" onclick="event.preventDefault(); deleteMenu('${item.id}', '${safeName}')" style="color: var(--error);">🗑️ Xóa món</a>
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openMenuModal() {
    document.getElementById('modalMenuTitle').innerText = 'Thêm Món Mới';
    document.getElementById('editMenuId').value = '';
    document.getElementById('modalMenuCategory').value = '';
    document.getElementById('modalMenuName').value = '';
    document.getElementById('modalMenuPrice').value = '';
    
    document.getElementById('menuModal').classList.remove('hidden');
}

function closeMenuModal() {
    document.getElementById('menuModal').classList.add('hidden');
}

function editMenu(id) {
    const item = currentStoreMenu.find(m => m.id == id);
    if (!item) return;
    
    document.getElementById('modalMenuTitle').innerText = 'Cập Nhật Món';
    document.getElementById('editMenuId').value = item.id;
    document.getElementById('modalMenuCategory').value = item.category;
    document.getElementById('modalMenuName').value = item.name;
    document.getElementById('modalMenuPrice').value = Math.round(Number(item.price) || 0);
    
    document.getElementById('menuModal').classList.remove('hidden');
}

async function saveMenu() {
    const editId = document.getElementById('editMenuId').value;
    const category = document.getElementById('modalMenuCategory').value.trim();
    const name = document.getElementById('modalMenuName').value.trim();
    const priceVal = document.getElementById('modalMenuPrice').value;
    
    if (!category || !name || !priceVal) {
        showToast('Vui lòng điền đủ thông tin món!', 'error');
        return;
    }
    
    const price = parseInt(priceVal);
    
    const btn = document.getElementById('btnSaveMenu');
    const spinner = btn.querySelector('.btn-spinner');
    const span = btn.querySelector('span');
    
    spinner.classList.remove('hidden');
    span.classList.add('hidden');
    btn.disabled = true;
    
    const payload = {
        category,
        name,
        price,
        user_id: currentStoreForMenu
    };
    
    try {
        if (editId) {
            const { error } = await db.from('menu').update(payload).eq('id', editId);
            if (error) throw error;
            showToast('Cập nhật món thành công!', 'success');
        } else {
            const { error } = await db.from('menu').insert([payload]);
            if (error) throw error;
            showToast('Thêm món thành công!', 'success');
        }
        
        closeMenuModal();
        loadStoreMenu();
    } catch (error) {
        console.error('Lỗi lưu món:', error);
        showToast('Lỗi: ' + error.message, 'error');
    } finally {
        spinner.classList.add('hidden');
        span.classList.remove('hidden');
        btn.disabled = false;
    }
}

async function deleteMenu(id, name) {
    if (!confirm(`Bạn có chắc chắn muốn xóa món "${name}"?`)) {
        return;
    }
    
    try {
        const { error } = await db.from('menu').delete().eq('id', id);
        if (error) throw error;
        
        showToast('Đã xóa món!', 'success');
        loadStoreMenu();
    } catch (error) {
        console.error('Lỗi xóa món:', error);
        showToast('Lỗi: ' + error.message, 'error');
    }
}

// =========================================================================
// 📦 QUẢN LÝ LOẠI ĐƠN (ORDER TYPES)
// =========================================================================
const defaultOrderTypes = [
    { name: "🛵 SHIP MANG VỀ", require_address: true, require_time: false },
    { name: "🍽️ ĂN TẠI QUÁN", require_address: false, require_time: false },
    { name: "🛍️ KHÁCH TỚI LẤY", require_address: false, require_time: true }
];

function openOrderTypeManager(userId, storeName) {
    currentStoreForTypes = isNaN(userId) ? userId : parseInt(userId, 10);
    document.getElementById('typeStoreTitle').innerText = 'Loại Đơn: ' + storeName;
    
    // Switch Tabs
    document.getElementById('tab-users').classList.add('hidden');
    document.getElementById('tab-users').style.display = 'none';
    
    document.getElementById('tab-menu').classList.add('hidden');
    document.getElementById('tab-menu').style.display = 'none';
    
    document.getElementById('tab-ordertypes').classList.remove('hidden');
    document.getElementById('tab-ordertypes').style.display = 'block';
    
    loadStoreTypes();
}

async function loadStoreTypes() {
    const tbody = document.getElementById('typeTableBody');
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Đang tải dữ liệu...</td></tr>';
    
    const { data, error } = await db.from('order_types').select('*').eq('user_id', currentStoreForTypes).order('id', { ascending: true });
    
    if (error) {
        console.error('Error fetching order types:', error);
        showToast('Lỗi tải loại đơn!', 'error');
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: red;">Lỗi tải dữ liệu</td></tr>';
        return;
    }
    
    if (data && data.length > 0) {
        currentStoreTypes = data;
        renderTypeTable();
    } else {
        // Tạo loại đơn mặc định nếu cửa hàng chưa có
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Khởi tạo loại đơn mặc định...</td></tr>';
        const { error: insertErr } = await db.from('order_types').insert(
            defaultOrderTypes.map(item => ({ ...item, user_id: currentStoreForTypes }))
        );
        
        if (insertErr) {
            console.error('Error seeding default order types:', insertErr);
            showToast('Lỗi tạo loại đơn mặc định!', 'error');
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Cửa hàng này chưa cấu hình loại đơn</td></tr>';
            currentStoreTypes = [];
            return;
        }
        
        // Load lại
        const { data: newData, error: fetchErr } = await db.from('order_types').select('*').eq('user_id', currentStoreForTypes).order('id', { ascending: true });
        if (fetchErr) {
            currentStoreTypes = [];
        } else {
            currentStoreTypes = newData;
        }
        renderTypeTable();
    }
}

function renderTypeTable() {
    cleanupDropdowns();
    const tbody = document.getElementById('typeTableBody');
    tbody.innerHTML = '';
    
    if (currentStoreTypes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Chưa có loại đơn nào</td></tr>';
        return;
    }
    
    currentStoreTypes.forEach(item => {
        const safeName = item.name.replace(/'/g, "\\'");
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td>${item.require_address ? '✅ Có' : '❌ Không'}</td>
            <td>${item.require_time ? '✅ Có' : '❌ Không'}</td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-secondary btn-sm dropbtn" onclick="toggleDropdown('drop-type-${item.id}', event)">
                        Hành động ▾
                    </button>
                    <div id="drop-type-${item.id}" class="dropdown-content">
                        <a href="#" onclick="event.preventDefault(); editOrderType('${item.id}')">✏️ Sửa loại đơn</a>
                        <a href="#" onclick="event.preventDefault(); deleteOrderType('${item.id}', '${safeName}')" style="color: var(--error);">🗑️ Xóa loại đơn</a>
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openOrderTypeModal() {
    document.getElementById('modalTypeTitle').innerText = 'Thêm Loại Đơn Mới';
    document.getElementById('editTypeId').value = '';
    document.getElementById('modalTypeName').value = '';
    document.getElementById('modalTypeRequireAddress').checked = false;
    document.getElementById('modalTypeRequireTime').checked = false;
    
    document.getElementById('typeModal').classList.remove('hidden');
}

function closeOrderTypeModal() {
    document.getElementById('typeModal').classList.add('hidden');
}

function editOrderType(id) {
    const item = currentStoreTypes.find(m => m.id == id);
    if (!item) return;
    
    document.getElementById('modalTypeTitle').innerText = 'Cập Nhật Loại Đơn';
    document.getElementById('editTypeId').value = item.id;
    document.getElementById('modalTypeName').value = item.name;
    document.getElementById('modalTypeRequireAddress').checked = item.require_address;
    document.getElementById('modalTypeRequireTime').checked = item.require_time;
    
    document.getElementById('typeModal').classList.remove('hidden');
}

async function saveOrderType() {
    const editId = document.getElementById('editTypeId').value;
    const name = document.getElementById('modalTypeName').value.trim();
    const reqAddress = document.getElementById('modalTypeRequireAddress').checked;
    const reqTime = document.getElementById('modalTypeRequireTime').checked;
    
    if (!name) {
        showToast('Vui lòng điền tên loại đơn!', 'error');
        return;
    }
    
    const btn = document.getElementById('btnSaveType');
    const spinner = btn.querySelector('.btn-spinner');
    const span = btn.querySelector('span');
    
    spinner.classList.remove('hidden');
    span.classList.add('hidden');
    btn.disabled = true;
    
    const payload = {
        name,
        require_address: reqAddress,
        require_time: reqTime,
        user_id: currentStoreForTypes
    };
    
    try {
        if (editId) {
            const { error } = await db.from('order_types').update(payload).eq('id', editId);
            if (error) throw error;
            showToast('Cập nhật thành công!', 'success');
        } else {
            const { error } = await db.from('order_types').insert([payload]);
            if (error) throw error;
            showToast('Thêm mới thành công!', 'success');
        }
        
        closeOrderTypeModal();
        loadStoreTypes();
    } catch (error) {
        console.error('Lỗi lưu loại đơn:', error);
        showToast('Lỗi: ' + error.message, 'error');
    } finally {
        spinner.classList.add('hidden');
        span.classList.remove('hidden');
        btn.disabled = false;
    }
}

async function deleteOrderType(id, name) {
    if (!confirm(`Bạn có chắc chắn muốn xóa loại đơn "${name}"?`)) {
        return;
    }
    
    try {
        const { error } = await db.from('order_types').delete().eq('id', id);
        if (error) throw error;
        
        showToast('Đã xóa loại đơn!', 'success');
        loadStoreTypes();
    } catch (error) {
        console.error('Lỗi xóa loại đơn:', error);
        showToast('Lỗi: ' + error.message, 'error');
    }
}

// =========================================================================
// 🌐 LANDING PAGE MANAGEMENT
// =========================================================================
async function openLandingManager(userId, storeName) {
    currentStoreForLanding = isNaN(userId) ? userId : parseInt(userId, 10);
    const user = allUsers.find(u => u.id == userId);
    currentStoreUsername = user ? user.username : '';
    
    document.getElementById('landingStoreTitle').innerText = 'Landing Page: ' + storeName;
    
    // Switch Tabs
    document.getElementById('tab-users').classList.add('hidden');
    document.getElementById('tab-users').style.display = 'none';
    
    document.getElementById('tab-menu').classList.add('hidden');
    document.getElementById('tab-menu').style.display = 'none';
    
    document.getElementById('tab-ordertypes').classList.add('hidden');
    document.getElementById('tab-ordertypes').style.display = 'none';
    
    document.getElementById('tab-landing').classList.remove('hidden');
    document.getElementById('tab-landing').style.display = 'block';

    const basePath = window.location.pathname.replace(/\/admin(\/index\.html)?\/?$/, '');
    const link = `${window.location.origin}${basePath}/store.html?u=${encodeURIComponent(currentStoreUsername)}`;
    document.getElementById('landingPreviewLink').innerText = link;
    document.getElementById('landingPreviewLink').href = link;

    await loadLandingInfo();
}

async function loadLandingInfo() {
    document.getElementById('lpImgPreview').innerText = 'Đang tải...';
    document.getElementById('lpDescPreview').innerText = 'Đang tải...';
    document.getElementById('lpHoursPreview').innerText = 'Đang tải...';
    document.getElementById('lpColorPreview').innerText = 'Đang tải...';

    const { data, error } = await db.from('landing_pages').select('*').eq('user_id', currentStoreForLanding).limit(1);
    
    if (error) {
        console.error('Error fetching landing page:', error);
        showToast('Lỗi tải Landing Page!', 'error');
        return;
    }
    
    if (data && data.length > 0) {
        currentStoreLandingInfo = data[0];
    } else {
        currentStoreLandingInfo = null;
    }
    
    renderLandingPreview();
}

function renderLandingPreview() {
    if (!currentStoreLandingInfo) {
        document.getElementById('lpImgPreview').innerText = '- Chưa cấu hình -';
        document.getElementById('lpDescPreview').innerText = '- Chưa cấu hình -';
        document.getElementById('lpHoursPreview').innerText = '- Chưa cấu hình -';
        document.getElementById('lpColorPreview').innerText = '- Chưa cấu hình -';
        return;
    }

    const info = currentStoreLandingInfo;
    document.getElementById('lpImgPreview').innerHTML = info.hero_image ? `<img src="${info.hero_image}" style="max-height: 50px; border-radius: 8px;">` : 'Không có';
    document.getElementById('lpDescPreview').innerText = info.description || 'Không có';
    document.getElementById('lpHoursPreview').innerText = info.opening_hours || 'Không có';
    document.getElementById('lpColorPreview').innerHTML = info.theme_color ? `<div style="display:flex; align-items:center; gap:5px;"><div style="width:20px;height:20px;border-radius:4px;background:${info.theme_color};"></div>${info.theme_color}</div>` : 'Mặc định';
}

function openLandingModal() {
    document.getElementById('modalLandingTitle').innerText = currentStoreLandingInfo ? 'Chỉnh Sửa Landing Page' : 'Khởi Tạo Landing Page';
    
    document.getElementById('editLandingId').value = currentStoreLandingInfo ? currentStoreLandingInfo.id : '';
    document.getElementById('modalLandingImg').value = currentStoreLandingInfo?.hero_image || '';
    document.getElementById('modalLandingDesc').value = currentStoreLandingInfo?.description || '';
    document.getElementById('modalLandingHours').value = currentStoreLandingInfo?.opening_hours || '';
    document.getElementById('modalLandingColor').value = currentStoreLandingInfo?.theme_color || '#f97316';
    
    document.getElementById('landingModal').classList.remove('hidden');
}

function closeLandingModal() {
    document.getElementById('landingModal').classList.add('hidden');
}

async function saveLandingPage() {
    const editId = document.getElementById('editLandingId').value;
    const hero_image = document.getElementById('modalLandingImg').value.trim();
    const description = document.getElementById('modalLandingDesc').value.trim();
    const opening_hours = document.getElementById('modalLandingHours').value.trim();
    const theme_color = document.getElementById('modalLandingColor').value.trim();
    
    const payload = {
        user_id: currentStoreForLanding,
        hero_image,
        description,
        opening_hours,
        theme_color
    };
    
    const btn = document.getElementById('btnSaveLanding');
    btn.classList.add('loading');
    btn.disabled = true;
    
    try {
        if (editId) {
            const { error } = await db.from('landing_pages').update(payload).eq('id', editId);
            if (error) throw error;
            showToast('Đã cập nhật Landing Page!', 'success');
        } else {
            const { error } = await db.from('landing_pages').insert([payload]);
            if (error) throw error;
            showToast('Đã khởi tạo Landing Page!', 'success');
        }
        
        closeLandingModal();
        await loadLandingInfo();
        
    } catch (error) {
        console.error('Lỗi lưu Landing Page:', error);
        showToast('Lỗi: ' + error.message, 'error');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

function copyLandingLink() {
    const link = document.getElementById('landingPreviewLink').href;
    navigator.clipboard.writeText(link).then(() => {
        showToast('Đã copy link!', 'success');
    });
}

// =========================================================================
// 🛠️ UTILS
// =========================================================================
let toastTimeout;
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.innerHTML = type === 'success' ? `✅ ${message}` : `❌ ${message}`;
    toast.className = `toast show ${type}`;
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Dropdown Logic
let activeDropdown = null;

function cleanupDropdowns() {
    if (activeDropdown) {
        activeDropdown.style.display = 'none';
        activeDropdown = null;
    }
    // Remove any dropdowns that were appended to body
    document.querySelectorAll('body > .dropdown-content').forEach(el => el.remove());
}

function toggleDropdown(id, event) {
    if (event) {
        event.stopPropagation();
    }
    
    // Đóng dropdown cũ nếu có
    if (activeDropdown && activeDropdown.id !== id) {
        activeDropdown.style.display = 'none';
        activeDropdown = null;
    }
    
    const dropdownMenu = document.getElementById(id);
    if (!dropdownMenu) return;
    
    const button = event.currentTarget;
    
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
        activeDropdown = null;
        return;
    }
    
    // Đưa dropdown ra ngoài body để không bị cắt bới overflow:hidden
    document.body.appendChild(dropdownMenu);
    
    dropdownMenu.style.display = 'block';
    dropdownMenu.classList.add('show-dropdown');
    
    // Tính toán vị trí
    const rect = button.getBoundingClientRect();
    const menuWidth = dropdownMenu.offsetWidth || 180;
    
    let left = rect.right - menuWidth;
    let top = rect.bottom + window.scrollY + 5;
    
    if (left < 0) left = 10; // Không cho tràn viền trái
    
    dropdownMenu.style.position = 'absolute';
    dropdownMenu.style.top = top + 'px';
    dropdownMenu.style.left = left + 'px';
    dropdownMenu.style.right = 'auto'; // override css
    
    activeDropdown = dropdownMenu;
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        if (activeDropdown) {
            activeDropdown.style.display = 'none';
            activeDropdown = null;
        }
    }
}
