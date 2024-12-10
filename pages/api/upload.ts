// import { NextApiRequest, NextApiResponse } from 'next'
// import formidable, { IncomingForm } from 'formidable';
// import fs from 'fs/promises'
// import path from 'path'
// import xlsx from 'xlsx'
// import QRCode from 'qrcode'
// import mysql from 'mysql2/promise'
// import AES from 'crypto-js/aes';
// import Utf8 from 'crypto-js/enc-utf8';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

// const uploadDir = path.join(process.cwd(), 'public', 'qr-codes')

// async function createConnection() {
//   return await mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//   })
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' })
//   }

//   try {
//     const form = new IncomingForm();
//     const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
//       form.parse(req, (err, fields, files) => {
//         if (err) reject(err)
//         resolve([fields, files])
//       })
//     })

//     // const file = files.file as formidable.File
//     const file = (files.file as formidable.File[] | undefined)[0];


//     if (!file) {
//       return res.status(400).json({ error: 'No file uploaded' })
//     }

//     const workbook = xlsx.readFile(file.filepath)
//     const sheetName = workbook.SheetNames[0]
//     const sheet = workbook.Sheets[sheetName]
//     const data = xlsx.utils.sheet_to_json(sheet)

//     const connection = await createConnection()
//     console.log('\n\nDatabase connection established\n\n\n')

//     for (const row of data.slice(0, 10)) {
//       const {     Code,
//         'Praxisname 1 - Namen': praxisname1Namen,
//         Straße: straße,
//         Plz: plz,
//         Stadt: stadt, } = row as any
//       if (!Code) {
//         throw new Error('Code is required');
//       }
//       const qrCodePath = `/qr-codes/${Code}.png`
//       await QRCode.toFile(path.join(uploadDir, `${Code}.png`), `https://feverapp.info/?code=${Code}`)
    

//       await connection.execute(
//         'INSERT INTO pediatricians (code, praxisname1Namen, straße, plz, stadt, pathToPediatricianQRCodeImage, numberOfDownloads) VALUES (?, ?, ?, ?, ?, ?, ?)',
//         [Code, praxisname1Namen, straße, plz, stadt, qrCodePath, 0]
//       )
//     }

//     await connection.end()

//     res.status(200).json({ message: 'File processed successfully' })
//   } catch (error) {
//     console.error('Error processing file:', error)
//     res.status(500).json({ error: 'Error processing file' })
//   }
// }

import { NextApiRequest, NextApiResponse } from 'next'
import formidable, { IncomingForm } from 'formidable';
import fs from 'fs/promises'
import path from 'path'
import xlsx from 'xlsx'
import QRCode from 'qrcode'
import mysql from 'mysql2/promise'
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import slugify from 'slugify';

export const config = {
api: {
bodyParser: false,
},
}

const uploadDir = path.join(process.cwd(), 'public', 'qr-codes')

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' })
}

try {
const form = new IncomingForm();
const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
form.parse(req, (err, fields, files) => {
if (err) reject(err)
resolve([fields, files])
})
})

// const file = files.file as formidable.File
// @ts-ignore
const file = (files.file as formidable.File[] | undefined)[0];
if (!file) {
return res.status(400).json({ error: 'No file uploaded' })
}

const workbook = xlsx.readFile(file.filepath)
const sheetName = workbook.SheetNames[0]
const sheet = workbook.Sheets[sheetName]
const data = xlsx.utils.sheet_to_json(sheet)

const connection = await createConnection()
console.log('\n\nDatabase connection established\n\n\n')

for (const row of data.slice(0, 10)) {
const { Code,
'Praxisname 1 - Namen': praxisname1Namen,
Straße: straße,
Plz: plz,
Stadt: stadt, } = row as any
if (!Code) {
throw new Error('Code is required');
}
const stringCode = Code.toString()
if (!stringCode || typeof stringCode !== 'string') {
throw new Error('stringCode must be a valid string');
}

// @ts-ignore
const encryptedCode = AES.encrypt(stringCode, process.env.ENCRYPTION_SECRET).toString();
const sanitizedCode = slugify(encryptedCode);
const qrCodePath = `/qr-codes/${sanitizedCode}.png`
await QRCode.toFile(path.join(uploadDir, `${sanitizedCode}.png`), `https://feverapp.info/?code=${encryptedCode}`)


await connection.execute(
'INSERT INTO pediatricians (code, praxisname1Namen, straße, plz, stadt, pathToPediatricianQRCodeImage, numberOfDownloads, encryptedCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
[Code, praxisname1Namen, straße, plz, stadt, qrCodePath, 0, encryptedCode]
)
}

await connection.end()

res.status(200).json({ message: 'File processed successfully' })
} catch (error) {
console.error('Error processing file:', error)
res.status(500).json({ error: 'Error processing file' })
}
}
