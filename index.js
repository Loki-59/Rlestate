const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/saved-searches', require('./routes/savedSearches'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/user', require('./routes/user'));

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
