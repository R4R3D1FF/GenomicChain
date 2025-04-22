import "@/db/prisma.js";
import { parse } from 'cookie';

export default function handler(req, res) {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
    const cookies = parse(req.headers.cookie || '');
    const wallet_address = cookies.walletAddress;

    if (!wallet_address) {
      return res.status(400).json({ error: 'Missing walletAddress cookie' });
    }
  
    prisma.user.findUnique({
      where: {
        wallet_address,
      },
    })
    .then(user => {
      if (!user) {
        res.status(404).json({ error: "User not found" });
      }
      else
        res.json({ name: user.name });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    });
  }