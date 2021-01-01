import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  password: "020302",
  host: "localhost",
  port: 5432,
  database: "todo_list",
});

export default pool;
