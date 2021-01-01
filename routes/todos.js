import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const todos = await pool.query(`SELECT * FROM todos`);
    res.json(todos.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todos = await pool.query(`SELECT * FROM todos WHERE id = ${id}`);
    if (todos.rowCount === 0) {
      return res.status(404).json({
        message: `there's no todo with id ${id}`,
      });
    }
    res.json(todos);
  } catch (error) {
    console.error(error.message);
  }
});

router.post("/", async (req, res) => {
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

    // res.json([title, description, status]);
    res.json({
      status: "success",
      message: "new todo added",
      todo: newTodo.rows[0],
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    // const updateTodo = await pool.query(`
    //   UPDATE todo
    //   SET
    //     title = ${title},
    //     description = ${description},
    //     status = ${status}
    //   WHERE id = ${id}
    //   RETURNING *
    // `);

    // const updateTodo = await pool.query(
    //   `
    //   UPDATE todos
    //   SET
    //     title = $1,
    //     description = $2,
    //     status = $3
    //   WHERE id = $4
    //   RETURNING *
    // `,
    //   [title, description, status, id]
    // );

    // res.json({
    //   status: "success",
    //   message: "todo updated",
    //   todo: updateTodo.rows[0],
    // });
    res.send(id);
  } catch (error) {
    console.error(error.message);
  }
});

export default router;
