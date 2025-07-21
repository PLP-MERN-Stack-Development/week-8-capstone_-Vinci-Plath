const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  
  // Check for token in Authorization header or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Get token from cookie
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized to access this route' 
    });
  }

  try {
    // Verify token
    console.log('Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded || !decoded.id) {
      console.error('Invalid token payload:', decoded);
      throw new Error('Invalid token payload');
    }
    
    console.log('Token verified, finding user with ID:', decoded.id);
    // Get user from the token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.error('User not found with ID:', decoded.id);
      throw new Error('User not found');
    }
    
    req.user = user;
    console.log('User authenticated:', { id: user._id, email: user.email });
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    console.error('Error details:', error);
    
    let errorMessage = 'Not authorized, token failed';
    if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Invalid token';
    } else if (error.name === 'TokenExpiredError') {
      errorMessage = 'Token expired';
    }
    
    return res.status(401).json({ 
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Middleware to authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
