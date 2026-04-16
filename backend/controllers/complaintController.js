const db = require('../config/db');

// CREATE
exports.createComplaint = (req, res) => {
    const { title, category, location, description } = req.body;
    const userId = req.userId;

    let imageUrl = null;
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!title || !category || !location || !description) {
        return res.status(400).json({ message: 'All fields required' });
    }

    db.run(
        'INSERT INTO complaints (user_id, title, category, location, description, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, title, category, location, description, imageUrl],
        function (err) {
            if (err) {
                console.error("❌ CREATE ERROR:", err);
                return res.status(500).json({ message: err.message });
            }

            res.json({ message: 'Created', id: this.lastID });
        }
    );
};

// GET ALL
exports.getAllComplaints = (req, res) => {
    db.all(
        `SELECT c.*, u.name as user_name, u.email as user_email
         FROM complaints c
         JOIN users u ON c.user_id = u.id`,
        [],
        (err, rows) => {
            if (err) {
                console.error("❌ FETCH ERROR:", err);
                return res.status(500).json({ message: err.message });
            }

            res.json(rows);
        }
    );
};

// UPDATE STATUS
exports.updateComplaintStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    db.run(
        'UPDATE complaints SET status = ? WHERE id = ?',
        [status, id],
        function (err) {
            if (err) {
                console.error("❌ UPDATE ERROR:", err);
                return res.status(500).json({ message: err.message });
            }

            res.json({ message: 'Updated successfully' });
        }
    );
};

// DELETE
exports.deleteComplaint = (req, res) => {
    const { id } = req.params;

    db.run(
        'DELETE FROM complaints WHERE id = ?',
        [id],
        function (err) {
            if (err) {
                console.error("❌ DELETE ERROR:", err);
                return res.status(500).json({ message: err.message });
            }

            res.json({ message: 'Deleted' });
        }
    );
};
