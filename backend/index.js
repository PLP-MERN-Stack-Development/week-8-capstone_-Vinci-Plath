require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const contactsRouter = require('./routes/contacts');
const sosRouter = require('./routes/sos');
const checkinRouter = require('./routes/checkin');
app.use(express.json());
app.use('/api/contacts', contactsRouter);
app.use('/api/sos', sosRouter);
app.use('/api/checkin', checkinRouter);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Only start server if run directly, not when imported for tests
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;