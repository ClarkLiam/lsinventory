import mysql, { type PoolConnection, type PoolOptions, type QueryResult } from "mysql2/promise";

const parsePoolNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const poolConfig: PoolOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: parsePoolNumber(process.env.DB_CONNECTION_LIMIT, 10),
  queueLimit: parsePoolNumber(process.env.DB_QUEUE_LIMIT, 0),
};

const pool = mysql.createPool(poolConfig);

/**
 * Execute a parameterized SQL query.
 */
export const query = async <T extends QueryResult = QueryResult>(
  sql: string,
  params: unknown[] = [],
): Promise<T> => {
  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();
    const [result] = await connection.query<T>(sql, params);
    return result;
  } catch (error) {
    console.error("MySQL query failed", error);
    throw error;
  } finally {
    connection?.release();
  }
};

export const testConnection = async (): Promise<void> => {
  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();
    await connection.ping();
  } finally {
    connection?.release();
  }
};

export default pool;
