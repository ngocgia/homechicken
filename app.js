// =========================================================================
// ⚙️ CẤU HÌNH SUPABASE (Dán URL và Key của bạn vào đây)
// =========================================================================
const SUPABASE_URL = 'https://pxixtrwfvyzlvfnkszrm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mbWkuvRJYm0U1u5Ngfkulw_W_wVVS-o'; 

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

const todayStr = new Date().toISOString().split('T')[0];
document.getElementById('stockDate').value = todayStr;

// --- 1. QUẢN LÝ THỰC ĐƠN (SUPABASE & MENU 3 CHẤM) ---
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
    document.querySelectorAll('.menu-dropdown').forEach(el => {
        if (el.id !== `dropdown-${id}`) el.classList.remove('show');
    });

    const currentDropdown = document.getElementById(`dropdown-${id}`);
    if (currentDropdown) currentDropdown.classList.toggle('show');
}

// Bấm ra ngoài khoảng trống sẽ đóng các menu 3 chấm đang mở
document.addEventListener('click', function(e) {
    if (!e.target.classList.contains('menu-dots-btn')) {
        document.querySelectorAll('.menu-dropdown').forEach(el => el.classList.remove('show'));
    }
});

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

// --- 2. HÓA ĐƠN & SỬA GIÁ TRỰC TIẾP KHI BẤM 2 LẦN ---
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

// --- 3. QUẢN LÝ KHO NGUYÊN LIỆU (SUPABASE) ---
async function loadStockFromSupabase() {
    const { data, error } = await db.from('stock').select('*');
    if (error) console.error('Lỗi tải kho:', error);
    else stockList = data || [];
    renderStock();
}

async function addStockItem() {
    const date = document.getElementById('stockDate').value || todayStr;
    const name = document.getElementById('stockName').value.trim();
    const unit = document.getElementById('stockUnit').value.trim() || 'đơn vị';
    const qty = parseFloat(document.getElementById('stockQty').value) || 0;
    const price = parseInt(document.getElementById('stockPrice').value) || 0;

    if (!name) {
        alert('Vui lòng nhập tên nguyên liệu!');
        return;
    }

    const newItem = { id: Date.now(), date, name, unit, qty, price };
    const { error } = await db.from('stock').insert([newItem]);
    if (error) {
        alert('Lỗi lưu Supabase: ' + error.message);
    } else {
        stockList.push(newItem);
        document.getElementById('stockName').value = '';
        document.getElementById('stockUnit').value = '';
        document.getElementById('stockQty').value = '';
        document.getElementById('stockPrice').value = '';
        renderStock();
    }
}

async function updateStockQty(index, delta) {
    stockList[index].qty += delta;
    if (stockList[index].qty < 0) stockList[index].qty = 0;

    const { error } = await db.from('stock').update({ qty: stockList[index].qty }).eq('id', stockList[index].id);
    if (error) console.error(error);
    renderStock();
}

async function deleteStockItem(index) {
    if (confirm('Bạn có chắc muốn xóa nguyên liệu này khỏi kho?')) {
        const { error } = await db.from('stock').delete().eq('id', stockList[index].id);
        if (!error) {
            stockList.splice(index, 1);
            renderStock();
        }
    }
}

function renderStock() {
    const stockContainer = document.getElementById('stockContainer');
    stockContainer.innerHTML = '';
    let totalValAll = 0;

    const dates = [...new Set(stockList.map(item => item.date || todayStr))].sort().reverse();

    if (dates.length === 0) {
        stockContainer.innerHTML = '<div style="text-align: center; color: #8e8e93; padding: 15px;">Chưa có nguyên liệu nào trong kho!</div>';
        document.getElementById('totalStockValue').innerText = "0 đ";
        return;
    }

    dates.forEach(d => {
        const itemsInDate = stockList.filter(item => (item.date || todayStr) === d);
        let dayTotal = 0;

        const dateParts = d.split('-');
        const displayDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        let dayHTML = `
            <div style="background: #f8f9fa; padding: 6px 10px; border-radius: 6px; margin: 10px 0 4px 0; font-weight: bold; font-size: 13px; display: flex; justify-content: space-between; border-left: 3px solid #34c759;">
                <span>📅 Ngày: ${displayDate}</span>
                <span id="dayTotal-${d}" style="color: #27ae60;">0 đ</span>
            </div>
            <table class="stock-table">
                <thead>
                    <tr>
                        <th style="width: 32%;">Tên NL</th>
                        <th style="width: 28%; text-align: center;">Tồn kho</th>
                        <th style="width: 25%; text-align: right;">Giá nhập</th>
                        <th style="width: 15%; text-align: center;">Xóa</th>
                    </tr>
                </thead>
                <tbody>
        `;

        itemsInDate.forEach(item => {
            const globalIndex = stockList.findIndex(s => s.id === item.id);
            const itemTotal = item.qty * item.price;
            dayTotal += itemTotal;
            totalValAll += itemTotal;

            dayHTML += `
                <tr>
                    <td>
                        <div><b>${item.name}</b></div>
                        <div style="font-size: 10px; color: #7f8c8d;">ĐVT: ${item.unit}</div>
                    </td>
                    <td style="text-align: center;">
                        <div class="qty-control">
                            <button class="qty-btn" onclick="updateStockQty(${globalIndex}, -1)">-</button>
                            <span class="qty-number">${item.qty}</span>
                            <button class="qty-btn" onclick="updateStockQty(${globalIndex}, 1)">+</button>
                        </div>
                    </td>
                    <td style="text-align: right; font-weight: 500;">${item.price.toLocaleString('vi-VN')} đ</td>
                    <td style="text-align: center;">
                        <button class="btn btn-danger btn-sm" onclick="deleteStockItem(${globalIndex})">Xóa</button>
                    </td>
                </tr>
            `;
        });

        dayHTML += `</tbody></table>`;
        stockContainer.innerHTML += dayHTML;
        
        setTimeout(() => {
            const dayElem = document.getElementById(`dayTotal-${d}`);
            if (dayElem) dayElem.innerText = "Tổng: " + dayTotal.toLocaleString('vi-VN') + " đ";
        }, 10);
    });

    document.getElementById('totalStockValue').innerText = totalValAll.toLocaleString('vi-VN') + " đ";
}

// --- 4. BÁO CÁO DOANH THU & IN HÓA ĐƠN SUPABASE ---
async function loadSalesHistoryFromSupabase() {
    const { data, error } = await db.from('sales_history').select('*');
    if (error) console.error('Lỗi tải báo cáo:', error);
    else salesHistory = data || [];
    renderHistory();
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
        id: Date.now(),
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

    const { error } = await db.from('sales_history').insert([orderRecord]);
    if (error) console.error('Lỗi lưu đơn hàng:', error);
    else salesHistory.push(orderRecord);

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

function renderHistory() {
    const historyBody = document.getElementById('historyBody');
    historyBody.innerHTML = '';

    let grandTotalDaily = 0;
    const reversedHistory = [...salesHistory].reverse();

    reversedHistory.forEach((order) => {
        grandTotalDaily += order.total;
        let subDetail = order.type || '';
        if (order.pickup_time) subDetail += ` (${order.pickup_time})`;

        historyBody.innerHTML += `
            <tr>
                <td><b>${order.time}</b></td>
                <td>
                    <div><b>${order.customer}</b></div>
                    <div style="font-size: 10px; color: #7f8c8d;">${subDetail}</div>
                </td>
                <td style="text-align: right; font-weight: bold; color: #d35400;">${order.total.toLocaleString('vi-VN')} đ</td>
                <td style="text-align: center;">
                    <button class="btn btn-danger btn-sm" onclick="deleteOrder(${order.id})">Xóa</button>
                </td>
            </tr>
        `;
    });

    document.getElementById('dailyOrderCount').innerText = salesHistory.length + " đơn";
    document.getElementById('dailyTotalAmount').innerText = grandTotalDaily.toLocaleString('vi-VN') + " đ";
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

async function resetDailySales() {
    if (confirm('Bạn có chắc muốn xóa TOÀN BỘ lịch sử đơn hàng trên Supabase để bắt đầu ngày làm việc mới?')) {
        const { error } = await db.from('sales_history').delete().neq('id', 0);
        if (!error) {
            salesHistory = [];
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