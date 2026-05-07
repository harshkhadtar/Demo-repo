const db = require('../config/db');

exports.createComplaint = async (req, res) => {
    const { title, category, location, description } = req.body;
    const userId = req.userId;
    let imageUrl = null;

    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!title || !category || !location || !description) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const result = db.prepare(
            'INSERT INTO complaints (user_id, title, category, location, description, image_url) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(userId, title, category, location, description, imageUrl);

        res.status(201).json({ message: 'Complaint created successfully', complaintId: result.lastInsertRowid });
    } catch (error) {
        console.error('[createComplaint]', error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
};

exports.getMyComplaints = async (req, res) => {
    const userId = req.userId;
    try {
        const complaints = db.prepare('SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC').all(userId);
        res.json(complaints);
    } catch (error) {
        console.error('[getMyComplaints]', error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
};

exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = db.prepare(`
      SELECT c.*, u.name as user_name, u.email as user_email
      FROM complaints c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `).all();
        res.json(complaints);
    } catch (error) {
        console.error('[getAllComplaints]', error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
};

exports.updateComplaintStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Rejected', 'In Progress', 'Completed'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    // If marking as Completed, a proof image is required
    if (status === 'Completed') {
        if (!req.file) {
            return res.status(400).json({
                message: 'A completion proof image is required when marking as Completed.'
            });
        }
    }

    try {
        let result;
        if (status === 'Completed' && req.file) {
            const completionImageUrl = `/uploads/${req.file.filename}`;
            result = db.prepare(
                'UPDATE complaints SET status = ?, completion_image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
            ).run(status, completionImageUrl, id);
        } else {
            result = db.prepare(
                'UPDATE complaints SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
            ).run(status, id);
        }

        if (result.changes === 0) {
            return res.status(404).json({ message: 'Complaint not found.' });
        }
        res.json({ message: 'Complaint status updated successfully' });
    } catch (error) {
        console.error('[updateComplaintStatus]', error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
};

exports.deleteComplaint = async (req, res) => {
    const { id } = req.params;
    try {
        const result = db.prepare('DELETE FROM complaints WHERE id = ?').run(id);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Complaint not found.' });
        }
        res.json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        console.error('[deleteComplaint]', error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
};
