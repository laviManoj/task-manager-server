const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');
const crypto = require('crypto');
const helmet = require('helmet'); // Use helmet for security headers

connectDB();

const app = express();

let corsConfig = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "*",
};

app.use(cors(corsConfig));

// Use helmet to set multiple security headers
app.use(helmet());

// Middleware to set COOP and CORP headers specifically
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    next();
});

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
