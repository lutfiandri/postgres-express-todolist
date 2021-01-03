import express from 'express';
import pool from '../db.js';

const router = express.Router();

const isAvailable = (res, rowCount, id) => {
  if (rowCount === 0) {
    return res.status(404).json({
      message: `there's no todo with id ${id}`,
    });
  }
};

router.get('/', async (req, res) => {
  try {
    const todos = await pool.query(`SELECT * FROM todos ORDER BY id`);
    res.json(todos.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todos = await pool.query(`SELECT * FROM todos WHERE id = ${id}`);

    isAvailable(res, todos.rowCount, id);
    res.json(todos.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const newTodo = await pool.query(
      `
      INSERT INTO todos
        (title, description, status)
      VALUES
        ($1, $2, $3)
      RETURNING *
    `,
      [title, description, status]
    );

    res.json({
      status: 'success',
      message: 'new todo added',
      todo: newTodo.rows[0],
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const updateTodo = await pool.query(
      `
      UPDATE todos
      SET
        title = $2,
        description = $3,
        status = $4
      WHERE id = $1
      RETURNING *
    `,
      [id, title, description, status]
    );
    res.json({
      status: 'success',
      message: 'todo updated',
      todo: updateTodo.rows[0],
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updateStatus = await pool.query(
      `UPDATE todos SET status = $2 WHERE id = $1 RETURNING *`,
      [id, status]
    );
    isAvailable(res, updateStatus.rowCount, id);
    res.json({
      message: 'status updted',
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      `
      DELETE FROM todos
      WHERE id = $1
      RETURNING *
    `,
      [id]
    );
    isAvailable(res, deleteTodo.rowCount, id);
    res.json({
      status: 'success',
      message: `todo with id ${id} was deleted`,
    });
  } catch (error) {
    console.error(error.message);
  }
});

export default router;
