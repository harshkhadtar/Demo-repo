const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Citizen routes
router.post('/', verifyToken, upload.single('image'), complaintController.createComplaint);
router.get('/my', verifyToken, complaintController.getMyComplaints);

// Public route for data dashboard
router.get('/all', complaintController.getAllComplaints);

// Admin routes
router.patch('/:id/status', verifyToken, isAdmin, complaintController.updateComplaintStatus);
router.delete('/:id', verifyToken, isAdmin, complaintController.deleteComplaint);

module.exports = router;
