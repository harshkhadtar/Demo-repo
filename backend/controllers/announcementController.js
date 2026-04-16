const db = require('../config/db');

exports.createAnnouncement = (req, res) => {
    const { title, body, type } = req.body;
    const adminId = req.userId;

    console.log("👉 ANNOUNCEMENT:", { title, body, adminId });

    if (!title || !body) {
        return res.status(400).json({ message: 'Title and body required' });
    }

    let mediaUrl = null;
    if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
    }

    db.run(
        'INSERT INTO announcements (admin_id, type, title, body, media_url) VALUES (?, ?, ?, ?, ?)',
        [adminId, type || 'text', title, body, mediaUrl],
        function (err) {
            if (err) {
                console.error("❌ ANN DB ERROR:", err.message);
                return res.status(500).json({ message: err.message });
            }

            res.json({ message: 'Created', id: this.lastID });
        }
    );
};

exports.getAllAnnouncements = (req, res) => {
    db.all(
        'SELECT * FROM announcements ORDER BY created_at DESC',
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json(rows);
        }
    );
};

exports.deleteAnnouncement = (req, res) => {
    const { id } = req.params;

    db.run(
        'DELETE FROM announcements WHERE id = ?',
        [id],
        function (err) {
            if (err) return res.status(500).json({ message: err.message });

            res.json({ message: 'Deleted' });
        }
    );
};
