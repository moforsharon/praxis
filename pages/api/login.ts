import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

async function createConnection() {
  return await mysql.createConnection({
    host: '161.35.31.233',
    user: 'root',
    password: 'rootpassword', // Keep this secure
    database: 'praxis',
    port: 3306,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const connection = await createConnection();

    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    await connection.end();

    // Assert rows as an array of objects
    if ((rows as any[]).length > 0) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
}
