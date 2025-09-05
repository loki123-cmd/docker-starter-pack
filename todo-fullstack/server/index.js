import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'todo',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

// Ensure todos table exists
async function ensureTodosTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE
  )`);
}

ensureTodosTable().catch(err => {
  console.error('Error creating todos table:', err);
  process.exit(1);
});

app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/todos', async (req, res) => {
  const { text } = req.body;
  try {
    const result = await pool.query('INSERT INTO todos (text) VALUES ($1) RETURNING *', [text]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
