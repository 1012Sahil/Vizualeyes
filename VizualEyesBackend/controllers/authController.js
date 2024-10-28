const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Function to create JWT token
const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expiration time
  });
};

// Login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create and send token
    const token = createToken(user);
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Logout function
exports.logout = (req, res) => {
  // Since JWT is stateless, there's no server-side logout
  // You can instruct the client to delete the token
  res.status(200).json({ message: 'Logged out successfully' });
};
