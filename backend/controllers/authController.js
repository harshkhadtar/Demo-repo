const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = (req, res) => {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    email = email.trim().toLowerCase();

    db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        if (row) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        db.run(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, hashedPassword],
            function (err) {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }

                res.status(201).json({
                    message: 'User registered successfully!',
                    userId: this.lastID
                });
            }
        );
    });
};
exports.login = (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    email = email.trim().toLowerCase();

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }

        console.log("👤 User from DB:", user); // DEBUG

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        if (!user.password_hash) {
            return res.status(500).json({ message: 'Password hash missing in DB' });
        }

        const isMatch = bcrypt.compareSync(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
};

exports.getMe = (req, res) => {
    db.get(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [req.userId],
        (err, user) => {
            if (err) {
                console.error('[getMe]', err);
                return res.status(500).json({ message: err.message });
            }

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            res.json(user);
        }
    );
};
