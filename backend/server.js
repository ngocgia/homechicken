const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Xác định thư mục public chứa giao diện (hỗ trợ cả khi chạy từ root hoặc trong thư mục backend)
const publicDir = fs.existsSync(path.join(__dirname, 'public'))
  ? path.join(__dirname, 'public')
  : path.join(__dirname, '..', 'public');

// Phục vụ các tài nguyên tĩnh (css, js, images, html...)
app.use(express.static(publicDir));
app.use('/admin', express.static(path.join(publicDir, 'admin')));

// --- Authentication & Users ---

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query(
      `SELECT id, username, full_name, role, store_name, store_phone, store_address, store_fb, store_fb_url, created_at 
       FROM users WHERE username = $1 AND password = $2`,
      [username, password]
    );
    if (result.rows.length > 0) {
      res.json({ data: result.rows });
    } else {
      res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { username, password, full_name, role, store_name, store_phone, store_address, store_fb, store_fb_url } = req.body;
  try {
    const exist = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    if (exist.rows.length > 0) {
      return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại!' });
    }
    const result = await db.query(
      `INSERT INTO users (username, password, full_name, role, store_name, store_phone, store_address, store_fb, store_fb_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING id, username, full_name, role, store_name, store_phone, store_address, store_fb, store_fb_url, created_at`,
      [username, password, full_name || null, role || 'user', store_name || null, store_phone || null, store_address || null, store_fb || null, store_fb_url || null]
    );
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, username, full_name, role, store_name, store_phone, store_address, store_fb, store_fb_url, created_at 
       FROM users ORDER BY id ASC`
    );
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password, full_name, role, store_name, store_phone, store_address, store_fb, store_fb_url } = req.body;
  try {
    const updates = [];
    const values = [];
    let idx = 1;
    if (username !== undefined) { updates.push(`username = $${idx++}`); values.push(username); }
    if (password !== undefined && password.trim() !== '') { updates.push(`password = $${idx++}`); values.push(password); }
    if (full_name !== undefined) { updates.push(`full_name = $${idx++}`); values.push(full_name); }
    if (role !== undefined) { updates.push(`role = $${idx++}`); values.push(role); }
    if (store_name !== undefined) { updates.push(`store_name = $${idx++}`); values.push(store_name); }
    if (store_phone !== undefined) { updates.push(`store_phone = $${idx++}`); values.push(store_phone); }
    if (store_address !== undefined) { updates.push(`store_address = $${idx++}`); values.push(store_address); }
    if (store_fb !== undefined) { updates.push(`store_fb = $${idx++}`); values.push(store_fb); }
    if (store_fb_url !== undefined) { updates.push(`store_fb_url = $${idx++}`); values.push(store_fb_url); }
    
    if (updates.length === 0) return res.json({ data: [] });
    
    values.push(id);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx} RETURNING id, username, full_name, role, store_name, store_phone, store_address, store_fb, store_fb_url, created_at`;
    const result = await db.query(query, values);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Menu ---

app.get('/api/menu', async (req, res) => {
  const { user_id } = req.query;
  try {
    const result = await db.query('SELECT * FROM menu WHERE user_id = $1 ORDER BY id ASC', [user_id]);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/menu', async (req, res) => {
  const payload = req.body;
  try {
    const items = Array.isArray(payload) ? payload : [payload];
    if (items.length === 0) return res.json({ data: [] });
    
    const inserted = [];
    for (let item of items) {
      const r = await db.query(
        'INSERT INTO menu (user_id, category, name, price) VALUES ($1, $2, $3, $4) RETURNING *', 
        [item.user_id, item.category, item.name, item.price]
      );
      if (r.rows[0]) inserted.push(r.rows[0]);
    }
    res.json({ success: true, data: inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, category, name, price } = req.body;
  try {
    const query = user_id
      ? 'UPDATE menu SET category=$1, name=$2, price=$3 WHERE id=$4 AND user_id=$5 RETURNING *'
      : 'UPDATE menu SET category=$1, name=$2, price=$3 WHERE id=$4 RETURNING *';
    const params = user_id
      ? [category, name, price, id, user_id]
      : [category, name, price, id];
    const result = await db.query(query, params);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;
  try {
    if (user_id) {
      await db.query('DELETE FROM menu WHERE id = $1 AND user_id = $2', [id, user_id]);
    } else {
      await db.query('DELETE FROM menu WHERE id = $1', [id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Stock ---

app.get('/api/stock', async (req, res) => {
  const { user_id } = req.query;
  try {
    const result = await db.query('SELECT * FROM stock WHERE user_id = $1 ORDER BY date DESC, id DESC', [user_id]);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stock', async (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [req.body];
  try {
    const inserted = [];
    for (let item of items) {
      const r = await db.query(
        'INSERT INTO stock (user_id, date, name, unit, qty, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [item.user_id, item.date, item.name, item.unit, item.qty, item.price]
      );
      if (r.rows[0]) inserted.push(r.rows[0]);
    }
    res.json({ success: true, data: inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/stock/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, date, name, unit, qty, price } = req.body;
  try {
    const query = user_id
      ? 'UPDATE stock SET date=$1, name=$2, unit=$3, qty=$4, price=$5 WHERE id=$6 AND user_id=$7 RETURNING *'
      : 'UPDATE stock SET date=$1, name=$2, unit=$3, qty=$4, price=$5 WHERE id=$6 RETURNING *';
    const params = user_id
      ? [date, name, unit, qty, price, id, user_id]
      : [date, name, unit, qty, price, id];
    const result = await db.query(query, params);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/stock/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;
  try {
    if (user_id) {
      await db.query('DELETE FROM stock WHERE id = $1 AND user_id = $2', [id, user_id]);
    } else {
      await db.query('DELETE FROM stock WHERE id = $1', [id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Sales History ---

const handleGetSales = async (req, res) => {
  const { user_id } = req.query;
  try {
    const result = await db.query('SELECT * FROM sales_history WHERE user_id = $1 ORDER BY created_at DESC', [user_id]);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handlePostSales = async (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [req.body];
  try {
    const inserted = [];
    for (let item of items) {
      const r = await db.query(
        `INSERT INTO sales_history (user_id, order_id, time, customer, phone, address, pickup_time, subtotal, discount_percent, discount_amount, total, type, items) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [
          item.user_id,
          item.order_id || null,
          item.time || null,
          item.customer || 'Khách vãng lai',
          item.phone || null,
          item.address || null,
          item.pickup_time || null,
          item.subtotal !== undefined ? item.subtotal : 0,
          item.discount_percent !== undefined ? item.discount_percent : 0,
          item.discount_amount !== undefined ? item.discount_amount : 0,
          item.total !== undefined ? item.total : 0,
          item.type || null,
          JSON.stringify(item.items || [])
        ]
      );
      if (r.rows[0]) inserted.push(r.rows[0]);
    }
    res.json({ success: true, data: inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handlePutSales = async (req, res) => {
  const { id } = req.params;
  const { user_id, order_id, time, customer, phone, address, pickup_time, subtotal, discount_percent, discount_amount, total, type, items } = req.body;
  try {
    const updates = [];
    const values = [];
    let idx = 1;

    if (order_id !== undefined) { updates.push(`order_id = $${idx++}`); values.push(order_id); }
    if (time !== undefined) { updates.push(`time = $${idx++}`); values.push(time); }
    if (customer !== undefined) { updates.push(`customer = $${idx++}`); values.push(customer); }
    if (phone !== undefined) { updates.push(`phone = $${idx++}`); values.push(phone); }
    if (address !== undefined) { updates.push(`address = $${idx++}`); values.push(address); }
    if (pickup_time !== undefined) { updates.push(`pickup_time = $${idx++}`); values.push(pickup_time); }
    if (subtotal !== undefined) { updates.push(`subtotal = $${idx++}`); values.push(subtotal); }
    if (discount_percent !== undefined) { updates.push(`discount_percent = $${idx++}`); values.push(discount_percent); }
    if (discount_amount !== undefined) { updates.push(`discount_amount = $${idx++}`); values.push(discount_amount); }
    if (total !== undefined) { updates.push(`total = $${idx++}`); values.push(total); }
    if (type !== undefined) { updates.push(`type = $${idx++}`); values.push(type); }
    if (items !== undefined) { updates.push(`items = $${idx++}`); values.push(JSON.stringify(items)); }

    if (updates.length === 0) return res.json({ data: [] });

    values.push(id);
    let query = `UPDATE sales_history SET ${updates.join(', ')} WHERE id = $${idx}`;
    if (user_id) {
      values.push(user_id);
      query += ` AND user_id = $${idx + 1}`;
    }
    query += ' RETURNING *';

    const result = await db.query(query, values);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleDeleteSales = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;
  try {
    if (user_id) {
      await db.query('DELETE FROM sales_history WHERE id = $1 AND user_id = $2', [id, user_id]);
    } else {
      await db.query('DELETE FROM sales_history WHERE id = $1', [id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Route chính: /api/sales
app.get('/api/sales', handleGetSales);
app.post('/api/sales', handlePostSales);
app.put('/api/sales/:id', handlePutSales);
app.delete('/api/sales/:id', handleDeleteSales);

// Alias routes: /api/sales_history (tương thích cả 2 chuẩn gọi)
app.get('/api/sales_history', handleGetSales);
app.post('/api/sales_history', handlePostSales);
app.put('/api/sales_history/:id', handlePutSales);
app.delete('/api/sales_history/:id', handleDeleteSales);

// --- Order Types ---

app.get('/api/order_types', async (req, res) => {
  const { user_id } = req.query;
  try {
    const result = await db.query('SELECT * FROM order_types WHERE user_id = $1 ORDER BY id ASC', [user_id]);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/order_types', async (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [req.body];
  try {
    const inserted = [];
    for (let item of items) {
      const r = await db.query(
        'INSERT INTO order_types (user_id, name, require_address, require_time) VALUES ($1, $2, $3, $4) RETURNING *',
        [item.user_id, item.name, !!item.require_address, !!item.require_time]
      );
      if (r.rows[0]) inserted.push(r.rows[0]);
    }
    res.json({ success: true, data: inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/order_types/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, name, require_address, require_time } = req.body;
  try {
    const updates = [];
    const values = [];
    let idx = 1;
    if (name !== undefined) { updates.push(`name = $${idx++}`); values.push(name); }
    if (require_address !== undefined) { updates.push(`require_address = $${idx++}`); values.push(!!require_address); }
    if (require_time !== undefined) { updates.push(`require_time = $${idx++}`); values.push(!!require_time); }
    if (user_id !== undefined) { updates.push(`user_id = $${idx++}`); values.push(user_id); }
    
    if (updates.length === 0) return res.json({ data: [] });
    values.push(id);
    
    const query = `UPDATE order_types SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`;
    const result = await db.query(query, values);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/order_types/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;
  try {
    if (user_id) {
      await db.query('DELETE FROM order_types WHERE id = $1 AND user_id = $2', [id, user_id]);
    } else {
      await db.query('DELETE FROM order_types WHERE id = $1', [id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Landing Pages ---

app.get('/api/landing_pages', async (req, res) => {
  const { user_id } = req.query;
  try {
    const result = await db.query('SELECT * FROM landing_pages WHERE user_id = $1 LIMIT 1', [user_id]);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/landing_pages', async (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [req.body];
  try {
    const inserted = [];
    for (let item of items) {
      const r = await db.query(
        `INSERT INTO landing_pages (user_id, title, description, hero_image, opening_hours, logo_url, theme_color) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         ON CONFLICT (user_id) DO UPDATE SET 
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           hero_image = EXCLUDED.hero_image,
           opening_hours = EXCLUDED.opening_hours,
           logo_url = EXCLUDED.logo_url,
           theme_color = EXCLUDED.theme_color
         RETURNING *`,
        [
          item.user_id,
          item.title || null,
          item.description || null,
          item.hero_image || item.logo_url || null,
          item.opening_hours || null,
          item.logo_url || item.hero_image || null,
          item.theme_color || '#f97316'
        ]
      );
      if (r.rows[0]) inserted.push(r.rows[0]);
    }
    res.json({ success: true, data: inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/landing_pages/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, hero_image, opening_hours, logo_url, theme_color } = req.body;
  try {
    const updates = [];
    const values = [];
    let idx = 1;
    if (title !== undefined) { updates.push(`title = $${idx++}`); values.push(title); }
    if (description !== undefined) { updates.push(`description = $${idx++}`); values.push(description); }
    if (hero_image !== undefined) { updates.push(`hero_image = $${idx++}`); values.push(hero_image); }
    if (opening_hours !== undefined) { updates.push(`opening_hours = $${idx++}`); values.push(opening_hours); }
    if (logo_url !== undefined) { updates.push(`logo_url = $${idx++}`); values.push(logo_url); }
    if (theme_color !== undefined) { updates.push(`theme_color = $${idx++}`); values.push(theme_color); }

    if (updates.length === 0) return res.json({ data: [] });
    values.push(id);

    const query = `UPDATE landing_pages SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`;
    const result = await db.query(query, values);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/landing_pages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM landing_pages WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- Frontend Routes ---

// Route trang chủ POS
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Route trang quản trị Admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(publicDir, 'admin', 'index.html'));
});

// Route trang cửa hàng dành cho khách
app.get('/store', (req, res) => {
  res.sendFile(path.join(publicDir, 'store.html'));
});

// Fallback: Mọi route khác (ngoại trừ /api/*) chuyển hướng về giao diện chính
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint API không tồn tại' });
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
