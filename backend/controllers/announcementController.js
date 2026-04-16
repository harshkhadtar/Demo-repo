const db = require('../config/db');

// ✅ CREATE
exports.createAnnouncement = (req, res) => {
    const { title, body, type } = req.body;
    const adminId = req.userId;

    let mediaUrl = null;
    if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
    }

    db.run(
        'INSERT INTO announcements (admin_id, type, title, body, media_url) VALUES (?, ?, ?, ?, ?)',
        [adminId, type || 'text', title, body, mediaUrl],
        function (err) {
            if (err) {
                console.error("INSERT ERROR:", err);
                return res.status(500).json({ message: err.message });
            }

            res.json({ message: 'Created', id: this.lastID });
        }
    );
};

// ✅ GET ALL
exports.getAllAnnouncements = (req, res) => {
    db.all(
        'SELECT * FROM announcements ORDER BY created_at DESC',
        [],
        (err, rows) => {
            if (err) {
                console.error("FETCH ERROR:", err);
                return res.status(500).json({ message: err.message });
            }

            res.json(rows); // ✅ MUST be array
        }
    );
};

// ✅ DELETE
exports.deleteAnnouncement = (req, res) => {
    const { id } = req.params;

    db.run(
        'DELETE FROM announcements WHERE id = ?',
        [id],
        function (err) {
            if (err) {
                console.error("DELETE ERROR:", err);
                return res.status(500).json({ message: err.message });
            }

            res.json({ message: 'Deleted' });
        }
    );
};
