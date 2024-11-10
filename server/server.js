// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const User = require('./models/User');
// const Product = require('./models/product'); // For products once setup

// // Load environment variables
// dotenv.config();

// const app = express();
// const PORT = 3001;

// // Middleware to parse JSON requests
// app.use(express.json());

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.log('MongoDB connection error:', err));

// // Handle user signup and save details to MongoDB
// app.post('/api/signup', async (req, res) => {
//   try {
//     const { uid, firstName, lastName, email, city, province, phoneNumber } = req.body;

//     // Create a new user in MongoDB
//     const newUser = new User({
//       uid,
//       firstName,
//       lastName,
//       email,
//       city,
//       province,
//       phoneNumber,
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'User created successfully in MongoDB' });
//   } catch (error) {
//     console.error('Error saving user to MongoDB:', error);
//     res.status(500).json({ error: 'Failed to save user in MongoDB' });
//   }
// });

// // Get user information for Profile page
// app.get('/api/user/:uid', async (req, res) => {
//     try {
//       const user = await User.findOne({ uid: req.params.uid });
//       if (!user) return res.status(404).json({ error: 'User not found' });
//       res.json(user);
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       res.status(500).json({ error: 'Failed to fetch user' });
//     }
//   });

// // Update user information if edited on profile page
// app.put('/api/user/:uid', async (req, res) => {
//     try {
//       const updates = req.body;
//       const updatedUser = await User.findOneAndUpdate({ uid: req.params.uid }, updates, { new: true });
//       if (!updatedUser) return res.status(404).json({ error: 'User not found' });
//       res.json({ message: 'User updated successfully', user: updatedUser });
//     } catch (error) {
//       console.error('Error updating user:', error);
//       res.status(500).json({ error: 'Failed to update user' });
//     }
//   });

// // Create a new product associated with a user
// app.post('/api/products', async (req, res) => {
//   try {
//     const { title, description, price, imageUrl, location, userId } = req.body;

//     const newProduct = new Product({
//       title,
//       description,
//       price,
//       imageUrl,
//       location,
//       userId // Associate with user
//     });

//     await newProduct.save();
//     res.status(201).json({ message: 'Product created successfully', product: newProduct });
//   } catch (error) {
//     console.error('Error creating product:', error);
//     res.status(500).json({ error: 'Failed to create product' });
//   }
// });

// // Retrieve products for a specific user
// app.get('/api/products', async (req, res) => {
//   const userId = req.query.userId; // Get userId from query params

//   try {
//     const products = await Product.find({ userId }); // Fetch only products for this user
//     res.json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Failed to fetch products' });
//   }
// });
  

// // Default route to check server status
// app.get('/', (req, res) => {
//   res.send('Server is running');
// });

// // Start the server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const User = require('./models/User');
const Product = require('./models/Product');

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware to parse JSON requests
app.use(express.json());

// // MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.log('MongoDB connection error:', err));

// User signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { uid, firstName, lastName, email, city, province, phoneNumber } = req.body;

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

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to upload products with image
app.post('/api/products', upload.single('image'), async (req, res) => {
  const { title, description, price, location, userId } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image provided' });
  }

  const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

  const newProduct = new Product({
    title,
    description,
    price,
    location,
    userId,
    imageUrl,
  });

  try {
    await newProduct.save();
    res.status(201).json({ success: true, message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ success: false, error: 'Failed to add product' });
  }
});

// Retrieve products for a specific user
app.get('/api/products', async (req, res) => {
  const userId = req.query.userId; // Get userId from query params

  try {
    const products = await Product.find({ userId }); // Fetch only products for this user
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Default route to check server status
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));