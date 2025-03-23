const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/event-booking';

async function checkAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the User model
    const User = require('./models/User');

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin_bits1@admin.com' });
    
    if (adminUser) {
      console.log('Admin user found:', {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        password: adminUser.password.substring(0, 20) + '...' // Show part of hashed password
      });
    } else {
      console.log('Admin user not found');
    }

  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Run the function
checkAdminUser(); 