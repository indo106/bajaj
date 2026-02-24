const express = require('express'); // 1. Sabse pehle express lao
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express(); // 2. App yahan banna chahiye

// 3. Middlewares
app.use(cors()); // CORS ab sahi jagah hai
app.use(express.json());

// Manual headers (Safe side ke liye rakhte hain)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// 4. Routes
const loanRoutes = require('./routes/loans.cjs');
const exportRoutes = require('./routes/export.cjs');

app.use('/api/loans', loanRoutes);
app.use('/api', exportRoutes);

// 5. Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

// 6. DB Connection & Listen
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});