const jwt = require('jsonwebtoken');
const User = require('../models/Admin');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await User.findById(decoded.id).select('-password');
    if (!req.admin) return res.status(401).json({ message: 'Invalid token admin not found' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
