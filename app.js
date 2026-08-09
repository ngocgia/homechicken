// =========================================================================
// ⚙️ CẤU HÌNH SUPABASE
// =========================================================================
const SUPABASE_URL = 'https://pxixtrwfvyzlvfnkszrm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mbWkuvRJYm0U1u5Ngfkulw_W_wVVS-o'; // Dán key của bạn vào đây

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    { category: "Món Thêm", name: "Phí ship", price: 1000 }
];

let menu = [];
let cart = [];
let salesHistory = [];
let stockList = [];
let bluetoothDevice = null;
let printCharacteristic = null;
let editingOrderId = null; // Biến ghi nhớ ID đơn hàng đang được sửa

const todayStr = new Date().toISOString().split('T')[0];

document.getElementById('stockDate').value = todayStr;
document.getElementById('stockFilterStartDate').value = todayStr;
document.getElementById('stockFilterEndDate').value = todayStr;
document.getElementById('filterStartDate').value = todayStr;
document.getElementById('filterEndDate').value = todayStr;

// Đóng popup khi chạm ra ngoài
document.addEventListener('click', function(e) {
    if (!e.target.classList.contains('menu-dots-btn') && 
        !e.target.classList.contains('action-dots-btn') && 
        !e.target.classList.contains('stock-dots-btn')) {
        document.querySelectorAll('.menu-dropdown, .action-dropdown, .stock-dropdown').forEach(el => el.classList.remove('show'));
    }
});

// --- 1. QUẢN LÝ THỰC ĐƠN (SUPABASE) ---
async function loadMenuFromSupabase() {
    const { data, error } = await db.from('menu').select('*').order('id', { ascending: true });
    if (error) {
        console.error('Lỗi tải menu:', error);
        menu = defaultMenu;
    } else if (data.length === 0) {
        await db.from('menu').insert(defaultMenu);
        const { data: newData } = await db.from('menu').select('*').order('id', { ascending: true });
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
        const { error } = await db.from('menu').update({ category, name, price }).eq('id', editId);
        if (error) alert('Lỗi sửa món: ' + error.message);
        else alert('Đã cập nhật món thành công!');
    } else {
        const { error } = await db.from('menu').insert([{ category, name, price }]);
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
        const { error } = await db.from('menu').delete().eq('id', id);
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

// --- 3. QUẢN LÝ KHO NGUYÊN LIỆU (LỌC, ẨN/HIỆN NGÀY & SỬA/XÓA/XEM - SỐ LƯỢNG TĨNH) ---
async function loadStockFromSupabase() {
    const { data, error } = await db.from('stock').select('*').order('date', { ascending: false });
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
        const { error } = await db.from('stock').update({ date, name, unit, qty, price }).eq('id', editId);
        if (error) {
            alert('Lỗi cập nhật nguyên liệu: ' + error.message);
        } else {
            alert('Đã cập nhật nguyên liệu thành công!');
            cancelEditStock();
            loadStockFromSupabase();
        }
    } else {
        const newItem = { id: Date.now(), date, name, unit, qty, price };
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
        const { error } = await db.from('stock').delete().eq('id', id);
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

// --- 4. BÁO CÁO DOANH THU & IN HÓA ĐƠN ---
async function loadSalesHistoryFromSupabase() {
    const { data, error } = await db.from('sales_history').select('*').order('created_at', { ascending: false });
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

async function rePrintOrder(orderId) {
    const order = salesHistory.find(o => o.id === orderId);
    if (!order) {
        alert('Không tìm thấy dữ liệu đơn hàng để in!');
        return;
    }

    const orderType = order.type || 'HÓA ĐƠN';
    const customerName = order.customer || 'Khách vãng lai';
    const customerPhone = order.phone || '';
    const customerAddress = order.address || '';
    const pickupTime = order.pickup_time || '';
    const orderItems = order.items || [];
    const discountPercent = order.discount_percent || 0;
    const discountAmount = order.discount_amount || 0;
    const subtotalTotal = order.subtotal || order.total;
    const finalTotal = order.total || 0;

    let printText = `    HOME CHICKEN\n01 Cao Thang - Quang Ngai\nDT: 0392 375 906\n--------------------------------\n[ ${orderType} - IN LẠI ]\nKhach: ${customerName}\n`;
    if (customerPhone) printText += `SDT: ${customerPhone}\n`;
    if (customerAddress) printText += `DC: ${customerAddress}\n`;
    if (pickupTime) printText += `Gio hen lay: ${pickupTime}\n`;
    printText += `--------------------------------\n`;

    orderItems.forEach(item => {
        const subtotal = item.price * item.qty;
        printText += `${item.name}\n  ${item.qty} x ${item.price.toLocaleString('vi-VN')} = ${subtotal.toLocaleString('vi-VN')} d\n`;
        if (item.note && item.note.trim() !== '') {
            printText += `  * Note: ${item.note.trim()}\n`;
        }
    });

    if (discountPercent > 0) {
        printText += `--------------------------------\nTam tinh: ${subtotalTotal.toLocaleString('vi-VN')} d\nGiam gia (${discountPercent}%): -${discountAmount.toLocaleString('vi-VN')} d\n`;
    }

    printText += `--------------------------------\nTONG CONG: ${finalTotal.toLocaleString('vi-VN')} d\n--------------------------------\n  Cam on quy khach & Hen gap lai!\n\n\n`;

    document.getElementById('printOrderType').innerText = "[ " + orderType + " - IN LẠI ]";
    let infoHTML = `<b>Khách:</b> ${customerName}<br>`;
    if (customerPhone) infoHTML += `<b>SĐT:</b> ${customerPhone}<br>`;
    if (customerAddress) infoHTML += `<b>Địa chỉ ship:</b> ${customerAddress}<br>`;
    if (pickupTime) infoHTML += `<b>Giờ tới lấy:</b> ${pickupTime}<br>`;
    document.getElementById('printCustomerInfo').innerHTML = infoHTML;

    const printBody = document.getElementById('printBody');
    printBody.innerHTML = '';

    orderItems.forEach(item => {
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

    await printBluetooth(printText);
}

function editOrder(orderId) {
    const order = salesHistory.find(o => o.id === orderId);
    if (!order) return;

    if (confirm(`Bạn có muốn nạp đơn hàng của khách "${order.customer}" vào giỏ để chỉnh sửa không?`)) {
        editingOrderId = order.id; // Ghi nhớ ID của đơn hàng đang sửa
        
        cart = JSON.parse(JSON.stringify(order.items || []));
        document.getElementById('orderType').value = order.type || 'SHIP MANG VỀ';
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

    const orderRecord = {
        time: timeStr,
        type: orderType,
        customer: customerName,
        phone: customerPhone,
        address: orderType === 'SHIP MANG VỀ' ? customerAddress : '',
        pickup_time: orderType === 'KHÁCH TỚI LẤY' ? pickupTime : '',
        subtotal: subtotalTotal,
        discount_percent: discountPercent,
        discount_amount: discountAmount,
        total: finalTotal,
        items: cart
    };

    // Kiểm tra đang sửa đơn cũ hay thêm mới
    if (editingOrderId) {
        const { error } = await db.from('sales_history').update(orderRecord).eq('id', editingOrderId);
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

    let printText = `    HOME CHICKEN\n01 Cao Thang - Quang Ngai\nDT: 0392 375 906\n--------------------------------\n[ ${orderType} ]\nKhach: ${customerName}\n`;
    if (customerPhone) printText += `SDT: ${customerPhone}\n`;
    if (orderType === 'SHIP MANG VỀ' && customerAddress) {
        printText += `DC: ${customerAddress}\n`;
    } else if (orderType === 'KHÁCH TỚI LẤY' && pickupTime) {
        printText += `Gio hen lay: ${pickupTime}\n`;
    }
    printText += `--------------------------------\n`;

    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        printText += `${item.name}\n  ${item.qty} x ${item.price.toLocaleString('vi-VN')} = ${subtotal.toLocaleString('vi-VN')} d\n`;
        if (item.note && item.note.trim() !== '') {
            printText += `  * Note: ${item.note.trim()}\n`;
        }
    });

    if (discountPercent > 0) {
        printText += `--------------------------------\nTam tinh: ${subtotalTotal.toLocaleString('vi-VN')} d\nGiam gia (${discountPercent}%): -${discountAmount.toLocaleString('vi-VN')} d\n`;
    }

    printText += `--------------------------------\nTONG CONG: ${finalTotal.toLocaleString('vi-VN')} d\n--------------------------------\n  Cam on quy khach & Hen gap lai!\n\n\n`;

    document.getElementById('printOrderType').innerText = "[ " + orderType + " ]";
    let infoHTML = `<b>Khách:</b> ${customerName}<br>`;
    if (customerPhone) infoHTML += `<b>SĐT:</b> ${customerPhone}<br>`;
    if (orderType === 'SHIP MANG VỀ' && customerAddress) {
        infoHTML += `<b>Địa chỉ ship:</b> ${customerAddress}<br>`;
    } else if (orderType === 'KHÁCH TỚI LẤY' && pickupTime) {
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

    await printBluetooth(printText);

    clearCart();
    renderHistory();
    switchTab('menu');
}

async function deleteOrder(orderId) {
    if (confirm('Bạn có chắc muốn xóa hóa đơn này khỏi Supabase?')) {
        const { error } = await db.from('sales_history').delete().eq('id', orderId);
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

    if (orderType === 'SHIP MANG VỀ') {
        addressRow.style.display = 'flex';
        pickupTimeRow.style.display = 'none';
    } else {
        addressRow.style.display = 'none';
        pickupTimeRow.style.display = 'flex';
    }
}

function removeVietnameseTones(str) {
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'D')
              .toLowerCase();
}

function filterMenu() {
    const keyword = removeVietnameseTones(document.getElementById('searchInput').value.trim());
    const filteredMenu = menu.filter(item => removeVietnameseTones(item.name).includes(keyword));
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

async function printBluetooth(textData) {
    if (!printCharacteristic) {
        window.print();
        return;
    }

    try {
        const encoder = new TextEncoder();
        const initCmd = new Uint8Array([0x1B, 0x40]);
        const cutCmd = new Uint8Array([0x1D, 0x56, 0x41, 0x00]);
        
        await printCharacteristic.writeValue(initCmd);
        
        const data = encoder.encode(textData);
        const CHUNK_SIZE = 50;
        for (let i = 0; i < data.length; i += CHUNK_SIZE) {
            const chunk = data.slice(i, i + CHUNK_SIZE);
            await printCharacteristic.writeValue(chunk);
        }

        await printCharacteristic.writeValue(cutCmd);
    } catch (err) {
        alert('Không thể gửi lệnh in Bluetooth: ' + err.message);
        window.print();
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
    cart = [];
    editingOrderId = null; // Xóa trạng thái ghi nhớ sửa đơn
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('pickupTime').value = '';
    document.getElementById('discountInput').value = '';
    renderCart();
}

// KHỞI TẠO DỮ LIỆU TỪ SUPABASE
loadMenuFromSupabase();
loadStockFromSupabase();
loadSalesHistoryFromSupabase();