const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/announcements', announcementRoutes);

// Health check: test DB connection
app.get('/api/test-db', async (req, res) => {
    try {
        db.get('SELECT 1', [], (err, row) => {
        if (err) {
            return res.status(500).json({ status: 'ERROR', error: err.message });
        }
        res.json({ status: 'OK', message: 'Database connected successfully!' });
    } catch (err) {
        res.status(500).json({ status: 'ERROR', error: err.message });
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n✅ Server running on http://localhost:${PORT}`);
    console.log(`   Database: SQLite (database/app.db)`);
    console.log(`   Test DB connection: http://localhost:${PORT}/api/test-db\n`);
});
