const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/product'); // For products once setup

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.log('MongoDB connection error:', err));

// Handle user signup and save details to MongoDB
app.post('/api/signup', async (req, res) => {
  try {
    const { uid, firstName, lastName, email, city, province, phoneNumber } = req.body;

    // Create a new user in MongoDB
    const newUser = new User({
      uid,
      firstName,
      lastName,
      email,
      city,
      province,
      phoneNumber,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully in MongoDB' });
  } catch (error) {
    console.error('Error saving user to MongoDB:', error);
    res.status(500).json({ error: 'Failed to save user in MongoDB' });
  }
});

// Get user information for Profile page
app.get('/api/user/:uid', async (req, res) => {
    try {
      const user = await User.findOne({ uid: req.params.uid });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

// Update user information if edited on profile page
app.put('/api/user/:uid', async (req, res) => {
    try {
      const updates = req.body;
      const updatedUser = await User.findOneAndUpdate({ uid: req.params.uid }, updates, { new: true });
      if (!updatedUser) return res.status(404).json({ error: 'User not found' });
      res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

// Default route to check server status
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));