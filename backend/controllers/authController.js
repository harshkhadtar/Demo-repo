const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
    let { name, email, password } = req.body;

    console.log("📥 Incoming data:", req.body);

    if (!name || !email || !password) {
        console.log("❌ Missing fields");
        return res.status(400).json({ message: 'All fields are required.' });
    }

    email = email.trim().toLowerCase();

    try {
        console.log("🔍 Checking email:", email);

        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

        console.log("🔎 Existing result:", existing);

        if (existing) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const result = db.prepare(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
        ).run(name, email, hashedPassword);

        console.log("✅ User inserted:", result);

        res.status(201).json({
            message: 'User registered successfully!',
            userId: result.lastInsertRowid
        });

    } catch (error) {
        console.error('[register error]', error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = bcrypt.compareSync(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('[login]', error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(user);
    } catch (error) {
        console.error('[getMe]', error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
};
