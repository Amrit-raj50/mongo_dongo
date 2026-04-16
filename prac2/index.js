// src/index.js

require('dotenv').config();       // Must be the very first line

const app       = require('./src/App');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();              // Connect to DB first

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();