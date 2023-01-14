import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  password: 'root',
  host: 'localhost',
  database: 'test',
  port: 5432,
});

export default pool;
