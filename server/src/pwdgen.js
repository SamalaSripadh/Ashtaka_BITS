const mongoose = require('mongoose');
require('dotenv').config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event_management');
        console.log('MongoDB Connected...');

        // Import the User model
        const User = require('../models/User');

        const adminData = {
            name: 'admin_bits1',
            email: 'admin_bits1@admin.com',
            password: 'admin@bits',  // Will be hashed by the User model pre-save hook
            role: 'admin'
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            await User.deleteOne({ email: adminData.email });
            console.log('Existing admin user deleted');
        }

        // Create new admin user
        const admin = await User.create(adminData);
        console.log('Admin user created successfully:');
        console.log({
            name: admin.name,
            email: admin.email,
            role: admin.role
        });

        // Verify the admin can log in
        const user = await User.findOne({ email: adminData.email });
        const isValidPassword = await user.matchPassword('admin@bits');
        console.log('Password verification test:', isValidPassword ? 'PASSED' : 'FAILED');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

createAdmin(); 