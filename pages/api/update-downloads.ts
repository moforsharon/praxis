//update page visits
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import queryString from 'query-string';

// Initialize the CORS middleware
const cors = Cors({
  methods: ['POST', 'HEAD'],
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600,
});

// Helper function to run middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: (req: NextApiRequest, res: NextApiResponse, callback: (err?: Error) => void) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

async function createConnection() {
  return await mysql.createConnection({
    host: '161.35.31.233',
    user: 'root',
    password: 'rootpassword', // Keep this secure
    database: 'praxis',
    port: 3306,
    // ssl: {
    //   rejectUnauthorized: false, // Use this setting for SSL enforcement
    // },
  });
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Run CORS middleware
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Pediatrician code is required' });
  }



  try {
    const connection = await createConnection();

    await connection.execute(
      'UPDATE pediatricians SET numberOfPageVisits = numberOfPageVisits + 1 WHERE code = ?',
      [code],
    );

    await connection.end();

    res.status(200).json({ message: 'Download count updated successfully' });
  } catch (error) {
    console.error('Error updating download count:', error);
    res.status(500).json({ error: 'Error updating download count' });
  }
};

export default handler;
