const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Import the User model

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.log('MongoDB connection error:', err));

// Route to handle user signup and save details to MongoDB
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

// Default route to check server status
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));