const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password, isAdminLogin } = req.body;
    console.log('Login attempt:', { email, isAdminLogin });

    // TEMPORARY: For admin login
    if (isAdminLogin) {
      // Check if admin user already exists
      let adminUser = await User.findOne({ email: 'admin@example.com' });
      
      if (!adminUser) {
        // Create a new admin user in the database
        const hashedPassword = await bcrypt.hash('admin123', 10);
        adminUser = await User.create({
          name: 'Admin User',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'admin',
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: adminUser._id, role: adminUser.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return res.json({
        user: {
          _id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          createdAt: adminUser.createdAt
        },
        token
      });
    }

    // Regular user login continues as normal
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await user.matchPassword(password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 