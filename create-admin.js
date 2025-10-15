const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://Juicebokx:n4omijoel@carz.raspx.mongodb.net/?retryWrites=true&');

    const adminExists = await User.findOne({ email: 'admin@homescapers.com' });
    if (adminExists) {
      console.log('Admin already exists:', {
        name: adminExists.name,
        email: adminExists.email,
        role: adminExists.role
      });
      return;
    }

    const admin = new User({
      name: 'Admin User',
      email: 'admin@homescapers.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin account created successfully!');
    console.log('Admin Details:');
    console.log('Name: Admin User');
    console.log('Email: admin@homescapers.com');
    console.log('Password: admin123');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.connection.close();
  }
}

createAdmin();
