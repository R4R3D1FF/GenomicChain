import express from 'express';
import db from './config/database.js'; 
import profileRoutes from './routes/profile.js'; 
import requestRoutes from './routes/request.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Middleware
app.use(express.json());
app.use(
  cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
  })
);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
}
);
// Profile routes
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/request', requestRoutes);

// connecting to the database
db.connect();