import "@/db/prisma.js";
import { parse } from 'cookie';

export default function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
    const { name } = req.body;
    const cookies = parse(req.headers.cookie || '');
    const wallet_address = cookies.walletAddress;

    if (!wallet_address) {
      return res.status(400).json({ error: 'Missing walletAddress cookie' });
    }
  
    prisma.user.create({
      data: {
        name,
        wallet_address,
        // ...more fields if needed
      },
    })
    .then(user => {
      if (!user) {
        res.status(404).json({ error: "User not added" });
      }
      else
        res.json({ message: `User set to ${name} for wallet address ${wallet_address}` });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    });
  }