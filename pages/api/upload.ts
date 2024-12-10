// import { NextApiRequest, NextApiResponse } from 'next'
// import formidable, { IncomingForm } from 'formidable';
// import fs from 'fs/promises'
// import path from 'path'
// import xlsx from 'xlsx'
// import QRCode from 'qrcode'
// import mysql from 'mysql2/promise'
// import AES from 'crypto-js/aes';
// import Utf8 from 'crypto-js/enc-utf8';
// import slugify from 'slugify';

// export const config = {
// api: {
// bodyParser: false,
// },
// }

// const uploadDir = path.join('/tmp', 'qr-codes');
// await fs.mkdir(uploadDir, { recursive: true }); // Ensure the directory exists


// async function createConnection() {
//   return await mysql.createConnection({
//     host: '161.35.31.233',
//     user: 'root',
//     password: 'rootpassword', // Keep this secure
//     database: 'praxis',
//     port: 3306,
//     // ssl: {
//     //   rejectUnauthorized: false, // Use this setting for SSL enforcement
//     // },
//   });
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// if (req.method !== 'POST') {
// return res.status(405).json({ error: 'Method not allowed' })
// }

// try {
// const form = new IncomingForm();
// const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
// form.parse(req, (err, fields, files) => {
// if (err) reject(err)
// resolve([fields, files])
// })
// })

// // const file = files.file as formidable.File
// // @ts-ignore
// const file = (files.file as formidable.File[] | undefined)[0];
// if (!file) {
// return res.status(400).json({ error: 'No file uploaded' })
// }

// const workbook = xlsx.readFile(file.filepath)
// const sheetName = workbook.SheetNames[0]
// const sheet = workbook.Sheets[sheetName]
// const data = xlsx.utils.sheet_to_json(sheet)

// const connection = await createConnection()
// console.log('\n\nDatabase connection established\n\n\n')

// for (const row of data.slice(0, 10)) {
// const { Code,
// 'Praxisname 1 - Namen': praxisname1Namen,
// Straße: straße,
// Plz: plz,
// Stadt: stadt, } = row as any
// if (!Code) {
// throw new Error('Code is required');
// }
// const stringCode = Code.toString()
// if (!stringCode || typeof stringCode !== 'string') {
// throw new Error('stringCode must be a valid string');
// }

// // @ts-ignore
// // const encryptedCode = AES.encrypt(stringCode, process.env.ENCRYPTION_SECRET).toString();
// // const sanitizedCode = slugify(encryptedCode);
// const qrCodePath = `/qr-codes/${Code}.png`
// await QRCode.toFile(path.join(uploadDir, `${Code}.png`), `https://feverapp.info/?code=${Code}`)


// await connection.execute(
// 'INSERT INTO pediatricians (code, praxisname1Namen, straße, plz, stadt, pathToPediatricianQRCodeImage, numberOfDownloads, encryptedCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
// [Code, praxisname1Namen, straße, plz, stadt, qrCodePath, 0, Code]
// )
// }

// await connection.end()

// res.status(200).json({ message: 'File processed successfully' })
// } catch (error) {
// console.error('Error processing file:', error)
// res.status(500).json({ error: 'Error processing file' })
// }
// }


import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm } from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import xlsx from 'xlsx';
import QRCode from 'qrcode';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize Supabase client
const supabase = createClient('https://uirqajedejyiwblszdha.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcnFhamVkZWp5aXdibHN6ZGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4MjY3OTYsImV4cCI6MjA0OTQwMjc5Nn0.dYi9ommN_qv05Y5PEZoSuHlrLF70asvNyORYbrN_pIw');

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
    // Parse form data
    const form = new IncomingForm();
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Get uploaded file
    const file = (files.file as formidable.File[] | undefined)?.[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse Excel file
    const workbook = xlsx.readFile(file.filepath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const connection = await createConnection();
    console.log('\n\nDatabase connection established\n\n\n');

    for (const row of data.slice(0, 10)) {
      const {
        Code,
        'Praxisname 1 - Namen': praxisname1Namen,
        Straße: straße,
        Plz: plz,
        Stadt: stadt,
      } = row as any;

      if (!Code) {
        throw new Error('Code is required');
      }

      // Generate QR code
      const stringCode = Code.toString();
      const tempFilePath = path.join('/tmp', `${stringCode}.png`);
      await QRCode.toFile(tempFilePath, `https://feverapp.info/?code=${stringCode}`);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('qr-codes') // Replace with your Supabase storage bucket name
        .upload(`qr-codes/${stringCode}.png`, await fs.readFile(tempFilePath), {
          contentType: 'image/png',
        });

      if (uploadError) {
        throw new Error(`Failed to upload QR code to Supabase: ${uploadError.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('qr-codes')
        .getPublicUrl(`qr-codes/${stringCode}.png`);
      const qrCodeUrl = publicUrlData?.publicUrl;

      // Update MySQL database
      await connection.execute(
        'INSERT INTO pediatricians (code, praxisname1Namen, straße, plz, stadt, pathToPediatricianQRCodeImage, numberOfDownloads, encryptedCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [Code, praxisname1Namen, straße, plz, stadt, qrCodeUrl, 0, Code]
      );

      // Clean up temporary file
      await fs.unlink(tempFilePath);
    }

    await connection.end();
    res.status(200).json({ message: 'File processed successfully' });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
}
