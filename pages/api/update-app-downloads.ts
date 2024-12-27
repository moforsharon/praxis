//update number of downloads
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

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
  });
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // Run CORS middleware
    await runMiddleware(req, res, cors);
  
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { code, isAndroidLinkClicked, isIosLinkClicked } = req.body;
  
    if (!code) {
      return res.status(400).json({ error: 'Pediatrician code is required' });
    }
  
    if (typeof isAndroidLinkClicked !== 'boolean' || typeof isIosLinkClicked !== 'boolean') {
      return res.status(400).json({ error: 'isAndroidLinkClicked and isIosLinkClicked must be boolean values' });
    }
  
    try {
      const connection = await createConnection();
  
      if (isAndroidLinkClicked) {
        await connection.execute(
          'UPDATE pediatricians SET numberOfAndroidDownloads = numberOfAndroidDownloads + 1 WHERE code = ?',
          [code],
        );
      }
  
      if (isIosLinkClicked) {
        await connection.execute(
          'UPDATE pediatricians SET numberOfIosDownloads = numberOfIosDownloads + 1 WHERE code = ?',
          [code],
        );
      }
  
      await connection.end();
  
      res.status(200).json({ message: 'Download count updated successfully' });
    } catch (error) {
      console.error('Error updating download count:', error);
      res.status(500).json({ error: 'Error updating download count' });
    }
  };
  
  export default handler;