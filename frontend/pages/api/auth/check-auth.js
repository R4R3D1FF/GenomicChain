import {parse} from 'cookie';
import jwt from 'jsonwebtoken';

console.log('cookie import:', parse);

export default async function handler(req, res) {
    const cookies = req.headers.cookie;
  
    if (!cookies) {
      return res.status(401).json({ authenticated: false, reason: 'No cookies' });
    }
  
    const parsedCookies = parse(cookies);
    // const parsedCookies = cookie.parse("jwt=bar; equation=E%3Dmc%5E2");
    console.log(parsedCookies.jwt);
    const token = parsedCookies.jwt;
  
    if (!token) {
      return res.status(401).json({ authenticated: false, reason: 'JWT not found' });
    }
  
    // (Optional) Validate the token here (e.g., with jsonwebtoken.verify)
    // If valid:
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        return res.status(200).json({ name: decoded.name, email: decoded.email });
    }
    catch(err) {
        console.log(err);
        return res.status(403).json({message: "Invalid token."});
    }
  
    // If invalid:
    // return res.status(401).json({ authenticated: false, reason: 'Invalid token' });
  }