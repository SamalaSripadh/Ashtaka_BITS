const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/event-booking';

// Admin user data
const adminData = {
  name: 'Admin User',
  email: 'admin_bits1@admin.com',
  password: 'admin@bits',
  role: 'admin'
};

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the User model
    const User = require('./models/User');

    // Drop the username index if it exists
    try {
      await mongoose.connection.db.collection('users').dropIndex('username_1');
      console.log('Dropped username index');
    } catch (error) {
      console.log('No username index found or already dropped');
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const adminUser = await User.create({
      ...adminData,
      password: hashedPassword
    });

    console.log('Admin user created successfully:', {
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Run the function
createAdminUser(); 