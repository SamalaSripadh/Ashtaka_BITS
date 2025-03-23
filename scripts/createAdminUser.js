const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/event-booking';

// Admin user data
const adminData = {
  name: "Admin User",
  email: "admin@admin.com",
  password: "admin123",
  role: "admin"
};

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the User model
    const User = require('../models/User');

    // Delete any existing admin users
    await User.deleteMany({ role: 'admin' });
    console.log('Deleted existing admin users');

    // Create the admin user (password will be hashed by the pre-save middleware)
    const admin = await User.create(adminData);

    console.log('Admin user created successfully!');
    console.log('Admin details:', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });

    // Verify the password works
    const testPassword = await admin.matchPassword('admin123');
    console.log('Password verification test:', testPassword ? 'PASSED' : 'FAILED');

    // Find the admin user to verify it was saved correctly
    const savedAdmin = await User.findOne({ email: adminData.email }).select('+password');
    console.log('Saved admin user:', {
      id: savedAdmin._id,
      name: savedAdmin.name,
      email: savedAdmin.email,
      role: savedAdmin.role,
      hasPassword: !!savedAdmin.password
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

createAdminUser(); 