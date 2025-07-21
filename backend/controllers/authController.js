const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      phone
    });

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      keyValue: error.keyValue,
      errors: error.errors
    });
    
    // More specific error messages based on error type
    let errorMessage = 'Server error during registration';
    let statusCode = 500;
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      statusCode = 400;
      errorMessage = 'Email already in use';
    } 
    // Handle validation errors
    else if (error.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = Object.values(error.errors).map(err => err.message).join('. ');
    }
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack.split('\n').map(line => line.trim())
      } : undefined
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    console.log('Login attempt with data:', { email: req.body.email });
    const { email, password } = req.body;

    if (!email || !password) {
      console.error('Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Check for user
    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.error('No user found with email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    console.log('Checking password for user:', user._id);
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.error('Invalid password for user:', user._id);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    console.log('Generating token for user:', user._id);
    const token = generateToken(user._id);

    // Set cookie
    console.log('Setting cookie for user:', user._id);
    setTokenCookie(res, token);

    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone
    };

    console.log('Login successful for user:', userResponse);
    res.json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error.message);
    console.error('Error details:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('No user in request or missing user ID');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    console.log('Fetching user with ID:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      console.error('User not found with ID:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('Successfully fetched user:', { id: user._id, email: user.email });
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error.message);
    console.error('Error details:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error getting user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Set token cookie
const setTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000 // 30 days
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('token', token, cookieOptions);
};
