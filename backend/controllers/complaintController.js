const db = require('../config/db');

// ✅ CREATE
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
                return res.status(500).json({ message: err.message });
            }

            res.json({
                message: 'Complaint created',
                complaintId: this.lastID
            });
        }
    );
};

// ✅ GET MY COMPLAINTS (FIXED)
exports.getMyComplaints = (req, res) => {
    const userId = req.userId;

    db.all(
        'SELECT * FROM complaints WHERE user_id = ?',
        [userId],
        (err, rows) => {
            console.log("DB DATA:", rows); // 🔥 DEBUG

            if (err) return res.status(500).json({ message: err.message });

            res.json(rows);
        }
    );
};

// ✅ GET ALL
exports.getAllComplaints = (req, res) => {
    db.all(
  `SELECT c.*, u.name as user_name, u.email as user_email
   FROM complaints c
   JOIN users u ON c.user_id = u.id`,
  [],
  (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  }
);
};

// ✅ UPDATE
exports.updateComplaintStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    console.log("🔥 UPDATE STATUS:", id, status);

    const allowedStatuses = ['Pending', 'Rejected', 'In Progress', 'Completed'];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    db.run(
        'UPDATE complaints SET status = ? WHERE id = ?',
        [status, id],
        function (err) {
            if (err) {
                console.error("❌ UPDATE ERROR:", err); // 👈 IMPORTANT
                return res.status(500).json({ message: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({ message: 'Complaint not found' });
            }

            res.json({ message: 'Status updated successfully' });
        }
    );
};

// ✅ DELETE
exports.deleteComplaint = (req, res) => {
    const { id } = req.params;

    db.run(
        'DELETE FROM complaints WHERE id = ?',
        [id],
        function (err) {
            if (err) return res.status(500).json({ message: err.message });

            if (this.changes === 0) {
                return res.status(404).json({ message: 'Not found' });
            }

            res.json({ message: 'Deleted' });
        }
    );
};
