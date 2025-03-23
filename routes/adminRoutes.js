const express = require('express');
const router = express.Router();
const { adminLogin, createAdmin } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/login', adminLogin);

// Protected routes (Admin only)
router.post('/register', protect, authorize('admin'), createAdmin);

module.exports = router; 