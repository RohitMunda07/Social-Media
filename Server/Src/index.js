// // Server/Src/index.js — Serverless entry for Vercel
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import connectDB from '../DataBase/index.js';
// import { app } from './app.js';


// /**
//  * Ensure DB is connected and reuse connection across invocations.
//  * Mongoose readyState: 0 = disconnected, 1 = connected
//  */
// async function ensureDb() {
//   if (mongoose.connection.readyState === 1) return;
//   // connectDB logs and exits on failure — cache the Promise to avoid racing
//   if (!global.__dbConnectPromise) {
//     global.__dbConnectPromise = connectDB();
//   }
//   await global.__dbConnectPromise;
// }

// /**
//  * Vercel Node (serverless) handler — delegate to your Express app.
//  * Export a default function that receives (req, res).
//  */
// export default async function handler(req, res) {
//   try {
//     console.log("🚀 Serverless function invoked");
//     await ensureDb();
//     // Express app is a request handler — call it directly
//     console.log("✅ DB ensured");
//     return app(req, res);
//   } catch (err) {
//     console.error('Serverless handler error:', err);
//     res.statusCode = 500;
//     res.json({ success: false, message: 'Internal Server Error' });
//   }
// }

import { app } from "../Server/src/app.js";
import connectDB from "../Server/DataBase/index.js";

let connected = false;

export default async function handler(req, res) {
  try {
    if (!connected) {
      await connectDB();
      connected = true;
    }
    return app(req, res);
  } catch (err) {
    console.error("DB error:", err);
    return res.status(500).json({ error: err.message });
  }
}
