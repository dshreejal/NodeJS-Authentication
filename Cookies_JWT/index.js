const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./db');

// Connect to MongoDB
connectDB();

const PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/register', require('./routes/register'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/refresh', require('./routes/refresh'));
app.use('/api/logout', require('./routes/logout'));

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
