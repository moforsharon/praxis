import { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'

async function createConnection() {
  return await mysql.createConnection({
    host: 'praxis-do-user-16095394-0.d.db.ondigitalocean.com',
    user: 'doadmin',
    password: 'AVNS_aBKf84x3JpreaoK9Bj4', // Keep this secure
    database: 'defaultdb',
    port: 25060,
    ssl: {
      rejectUnauthorized: false, // Use this setting for SSL enforcement
    },
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const connection = await createConnection()

    const [rows] = await connection.execute(
      'SELECT code, praxisname1Namen, straße, plz, stadt, pathToPediatricianQRCodeImage, numberOfDownloads FROM pediatricians'
    )

    await connection.end()

    res.status(200).json(rows)
  } catch (error) {
    console.error('Error fetching pediatricians:', error)
    res.status(500).json({ error: 'Error fetching pediatricians' })
  }
}

