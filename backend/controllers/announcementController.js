process.on('uncaughtException', err => {
    console.error('💥 UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', err => {
    console.error('💥 UNHANDLED REJECTION:', err);
});

const db = require('../config/db');

// CREATE
exports.createAnnouncement = (req, res) => {
    const { title, body, type } = req.body;
    const adminId = req.userId;

    let mediaUrl = null;
    if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
    }

    if (!title || !body) {
        return res.status(400).json({ message: 'Title and body required' });
    }


    console.log("👉 ANNOUNCEMENT HIT");
console.log("BODY:", req.body);
console.log("FILE:", req.file);
    db.run(
        'INSERT INTO announcements (admin_id, type, title, body, media_url) VALUES (?, ?, ?, ?, ?)',
        [adminId, type || 'text', title, body, mediaUrl],
        function (err) {
            if (err) {
                console.error("❌ ANNOUNCEMENT ERROR:", err);
                return res.status(500).json({ message: err.message });
            }

            res.json({
                message: 'Announcement created',
                id: this.lastID
            });
        }
    );
};

// GET ALL
exports.getAllAnnouncements = (req, res) => {

    console.log("👉 ANNOUNCEMENT HIT");
console.log("BODY:", req.body);
console.log("FILE:", req.file);
    db.all(
        'SELECT * FROM announcements ORDER BY created_at DESC',
        [],
        (err, rows) => {
            if (err) {
                console.error("❌ FETCH ANNOUNCEMENTS ERROR:", err);
                return res.status(500).json({ message: err.message });
            }

            res.json(rows);
        }
    );
};

// DELETE
exports.deleteAnnouncement = (req, res) => {
    console.log("👉 ANNOUNCEMENT HIT");
console.log("BODY:", req.body);
console.log("FILE:", req.file);
    
    const { id } = req.params;

    db.run(
        'DELETE FROM announcements WHERE id = ?',
        [id],
        function (err) {
            if (err) {
                console.error("❌ DELETE ANNOUNCEMENT ERROR:", err);
                return res.status(500).json({ message: err.message });
            }

            res.json({ message: 'Deleted' });
        }
    );
};
