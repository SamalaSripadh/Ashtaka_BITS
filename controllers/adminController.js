const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate admin token
const generateAdminToken = (userId) => {
  return jwt.sign(
    { id: userId, role: 'admin' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Admin login attempt:', { email });

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if user exists and is an admin
    const admin = await User.findOne({ email, role: 'admin' }).select('+password');
    console.log('Found admin user:', admin ? { 
      id: admin._id,
      email: admin.email,
      role: admin.role,
      hasPassword: !!admin.password 
    } : 'No admin found');

    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Check password
    const isMatch = await admin.matchPassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Create token
    const token = generateAdminToken(admin._id);
    console.log('Generated token for admin');

    res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Admin Account
// @route   POST /api/admin/register
// @access  Private (Super Admin only)
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if admin already exists
    let admin = await User.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create admin user
    admin = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: error.message });
  }
}; 