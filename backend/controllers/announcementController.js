const db = require('../config/db');

exports.createAnnouncement = async (req, res) => {
    const { title, body, type } = req.body;
    const adminId = req.userId;
    let mediaUrl = null;

    if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
    }

    if (!title || !body) {
        return res.status(400).json({ message: 'Title and body are required.' });
    }

    try {
        const result = db.prepare(
            'INSERT INTO announcements (admin_id, type, title, body, media_url) VALUES (?, ?, ?, ?, ?)'
        ).run(adminId, type || 'text', title, body, mediaUrl);

        res.status(201).json({ message: 'Announcement created successfully', announcementId: result.lastInsertRowid });
    } catch (error) {
        console.error('[createAnnouncement]', error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
};

exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = db.prepare('SELECT * FROM announcements ORDER BY created_at DESC').all();
        res.json(announcements);
    } catch (error) {
        console.error('[getAllAnnouncements]', error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    const { id } = req.params;
    try {
        const result = db.prepare('DELETE FROM announcements WHERE id = ?').run(id);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Announcement not found.' });
        }
        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('[deleteAnnouncement]', error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
};
