import { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

async function createConnection() {
  return await mysql.createConnection({
    host: '209.74.89.164',
    user: 'root',
    password: 'rootpassword', // Keep this secure
    database: 'praxis',
    port: 3306,
  });
}

interface StatisticsRow extends RowDataPacket {
  total: number | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const connection = await createConnection();

    // Query to fetch total number of pediatricians
    const [totalPediatriciansRows] = await connection.execute<StatisticsRow[]>(
      'SELECT COUNT(*) as total FROM pediatricians'
    );

    // Query to fetch total page visits
    const [totalPageVisitsRows] = await connection.execute<StatisticsRow[]>(
      'SELECT SUM(numberOfPageVisits) as total FROM pediatricians'
    );

    // Query to fetch total page visits of pediatricians with hasCode = true
    const [totalPageVisitsWithCodeRows] = await connection.execute<StatisticsRow[]>(
      'SELECT SUM(numberOfPageVisits) as total FROM pediatricians WHERE hasCodes = TRUE'
    );

    // Query to fetch total page visits of pediatricians with hasCode = false
    const [totalPageVisitsWithoutCodeRows] = await connection.execute<StatisticsRow[]>(
      'SELECT SUM(numberOfPageVisits) as total FROM pediatricians WHERE hasCodes = FALSE'
    );

    // Query to fetch total download links clicked (android)
    const [totalAndroidDownloadLinksClickedRows] = await connection.execute<StatisticsRow[]>(
      'SELECT SUM(numberOfAndroidDownloads) as total FROM pediatricians'
    );

    // Query to fetch total download links clicked (ios)
    const [totalIosDownloadLinksClickedRows] = await connection.execute<StatisticsRow[]>(
      'SELECT SUM(numberOfIosDownloads) as total FROM pediatricians'
    );

    // Query to fetch total download links clicked (android)
    const [totalAndroidDownloadWithCodeLinksClickedRows] = await connection.execute<StatisticsRow[]>(
      'SELECT SUM(numberOfAndroidDownloads) as total FROM pediatricians  WHERE hasCodes = TRUE'
    );

    // Query to fetch total download links clicked (android)
    const [totalAndroidDownloadWithoutCodeLinksClickedRows] = await connection.execute<StatisticsRow[]>(
      'SELECT SUM(numberOfAndroidDownloads) as total FROM pediatricians  WHERE hasCodes = FALSE'
    );

    // Query to fetch total download links clicked (ios)
    const [totalIosDownloadWithCodeLinksClickedRows] = await connection.execute<StatisticsRow[]>(
      'SELECT SUM(numberOfIosDownloads) as total FROM pediatricians  WHERE hasCodes = TRUE'
    );

    // Query to fetch total download links clicked (ios)
    const [totalIosDownloadWithoutCodeLinksClickedRows] = await connection.execute<StatisticsRow[]>(
      'SELECT SUM(numberOfIosDownloads) as total FROM pediatricians  WHERE hasCodes = FALSE'
    );
    await connection.end();

    // Safely access the first row of each result
    const totalPediatricians = totalPediatriciansRows[0]?.total || 0;
    const totalPageVisits = totalPageVisitsRows[0]?.total || 0;
    const totalPageVisitsWithCode = totalPageVisitsWithCodeRows[0]?.total || 0;
    const totalPageVisitsWithoutCode = totalPageVisitsWithoutCodeRows[0]?.total || 0;
    const totalAndroidDownload = totalAndroidDownloadLinksClickedRows[0]?.total || 0;
    const totalIosDownloads = totalIosDownloadLinksClickedRows[0]?.total || 0;
    const totalAndroidDownloadWithCode = totalAndroidDownloadWithCodeLinksClickedRows[0]?.total || 0;
    const totalAndroidDownloadWithoutCode = totalAndroidDownloadWithoutCodeLinksClickedRows[0]?.total || 0;
    const totalIosDownloadWithCode = totalIosDownloadWithCodeLinksClickedRows[0]?.total || 0;
    const totalIosDownloadWithoutCode = totalIosDownloadWithoutCodeLinksClickedRows[0]?.total || 0;

    res.status(200).json({
      totalPediatricians,
      totalPageVisits,
      totalPageVisitsWithCode,
      totalPageVisitsWithoutCode,
      totalAndroidDownload,
      totalIosDownloads,
      totalAndroidDownloadWithCode,
      totalAndroidDownloadWithoutCode,
      totalIosDownloadWithCode,
      totalIosDownloadWithoutCode,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
}
