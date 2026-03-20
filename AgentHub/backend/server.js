const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const agentRoutes = require('./routes/agentRoutes');
const aiRoutes = require('./routes/aiRoutes');


// Import models to ensure relations are registered
require('./models/agentModel');
require('./models/reviewModel');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }) // Creates tables if not exist
  .then(() => {
    console.log('Connected to MySQL and Synced Data');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MySQL connection error:', err));

// Global error handlers to prevent silent crashes
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION! Shutting down...', reason);
});
