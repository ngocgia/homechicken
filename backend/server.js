const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// --- Authentication & Users ---

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
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
  const { username, password } = req.body;
  try {
    const exist = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (exist.rows.length > 0) {
      return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại!' });
    }
    const result = await db.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password]);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY id ASC');
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password, full_name, role } = req.body;
  try {
    // Basic dynamic update
    const updates = [];
    const values = [];
    let idx = 1;
    if (username !== undefined) { updates.push(`username = $${idx++}`); values.push(username); }
    if (password !== undefined) { updates.push(`password = $${idx++}`); values.push(password); }
    if (full_name !== undefined) { updates.push(`full_name = $${idx++}`); values.push(full_name); }
    if (role !== undefined) { updates.push(`role = $${idx++}`); values.push(role); }
    
    if (updates.length === 0) return res.json({ data: [] });
    
    values.push(id);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`;
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
  // payload could be array (bulk insert) or single object
  try {
    const items = Array.isArray(payload) ? payload : [payload];
    if (items.length === 0) return res.json({ data: [] });
    
    // Simple loop for insert (for large bulks, use pg-format, but here it's fine)
    for (let item of items) {
      await db.query('INSERT INTO menu (user_id, category, name, price) VALUES ($1, $2, $3, $4)', 
        [item.user_id, item.category, item.name, item.price]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, category, name, price } = req.body;
  try {
    const result = await db.query('UPDATE menu SET category=$1, name=$2, price=$3 WHERE id=$4 AND user_id=$5 RETURNING *',
      [category, name, price, id, user_id]);
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
    const result = await db.query('SELECT * FROM stock WHERE user_id = $1 ORDER BY date DESC', [user_id]);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stock', async (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [req.body];
  try {
    for (let item of items) {
      await db.query('INSERT INTO stock (user_id, date, name, unit, qty, price) VALUES ($1, $2, $3, $4, $5, $6)',
        [item.user_id, item.date, item.name, item.unit, item.qty, item.price]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/stock/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, date, name, unit, qty, price } = req.body;
  try {
    const result = await db.query('UPDATE stock SET date=$1, name=$2, unit=$3, qty=$4, price=$5 WHERE id=$6 AND user_id=$7 RETURNING *',
      [date, name, unit, qty, price, id, user_id]);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/stock/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;
  try {
    await db.query('DELETE FROM stock WHERE id = $1 AND user_id = $2', [id, user_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Sales History ---

app.get('/api/sales', async (req, res) => {
  const { user_id } = req.query;
  try {
    const result = await db.query('SELECT * FROM sales_history WHERE user_id = $1 ORDER BY created_at DESC', [user_id]);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sales', async (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [req.body];
  try {
    for (let item of items) {
      await db.query('INSERT INTO sales_history (user_id, order_id, total, type, items) VALUES ($1, $2, $3, $4, $5)',
        [item.user_id, item.order_id, item.total, item.type, JSON.stringify(item.items)]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/sales/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, order_id, total, type, items } = req.body;
  try {
    const result = await db.query('UPDATE sales_history SET order_id=$1, total=$2, type=$3, items=$4 WHERE id=$5 AND user_id=$6 RETURNING *',
      [order_id, total, type, JSON.stringify(items), id, user_id]);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/sales/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;
  try {
    await db.query('DELETE FROM sales_history WHERE id = $1 AND user_id = $2', [id, user_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
    for (let item of items) {
      await db.query('INSERT INTO order_types (user_id, name) VALUES ($1, $2)',
        [item.user_id, item.name]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/order_types/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, name } = req.body; // user_id might not be passed if admin updates it, but we'll accept name
  try {
    const updates = [];
    const values = [];
    let idx = 1;
    if (name !== undefined) { updates.push(`name = $${idx++}`); values.push(name); }
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
    for (let item of items) {
      await db.query('INSERT INTO landing_pages (user_id, title, description, logo_url, theme_color) VALUES ($1, $2, $3, $4, $5)',
        [item.user_id, item.title, item.description, item.logo_url, item.theme_color]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/landing_pages/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, logo_url, theme_color } = req.body;
  try {
    const result = await db.query('UPDATE landing_pages SET title=$1, description=$2, logo_url=$3, theme_color=$4 WHERE id=$5 RETURNING *',
      [title, description, logo_url, theme_color, id]);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
