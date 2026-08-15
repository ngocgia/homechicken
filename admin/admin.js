// =========================================================================
// ⚙️ CẤU HÌNH SUPABASE
// =========================================================================
const SUPABASE_URL = 'https://pxixtrwfvyzlvfnkszrm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mbWkuvRJYm0U1u5Ngfkulw_W_wVVS-o'; // Dán key của bạn vào đây

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let allUsers = [];
let currentStoreForMenu = null;
let currentStoreMenu = [];

let currentStoreForTypes = null;
let currentStoreTypes = [];

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
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="btn btn-secondary btn-sm" onclick="editUser('${user.id}')">✏️ Sửa</button>
                    <button class="btn btn-primary btn-sm" style="background: var(--primary);" onclick="openMenuManager('${user.id}', '${safeStoreName}')">🍔 QL Menu</button>
                    <button class="btn btn-primary btn-sm" style="background: #eab308; color: #000;" onclick="openOrderTypeManager('${user.id}', '${safeStoreName}')">📦 QL Loại Đơn</button>
                    <button class="btn btn-primary btn-sm" style="background: var(--error);" onclick="deleteUser('${user.id}', '${user.username.replace(/'/g, "\\'")}')">🗑️ Xóa</button>
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
        store_fb
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
        currentStoreMenu = data;
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
            currentStoreMenu = newData;
        }
        renderMenuTable();
    }
}

function renderMenuTable() {
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
            <td>${item.price.toLocaleString('vi-VN')} đ</td>
            <td>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="btn btn-secondary btn-sm" onclick="editMenu('${item.id}')">✏️ Sửa</button>
                    <button class="btn btn-primary btn-sm" style="background: var(--error);" onclick="deleteMenu('${item.id}', '${safeName}')">🗑️ Xóa</button>
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
    document.getElementById('modalMenuPrice').value = item.price;
    
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
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="btn btn-secondary btn-sm" onclick="editOrderType('${item.id}')">✏️ Sửa</button>
                    <button class="btn btn-primary btn-sm" style="background: var(--error);" onclick="deleteOrderType('${item.id}', '${safeName}')">🗑️ Xóa</button>
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
// 🔔 UTILS
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
