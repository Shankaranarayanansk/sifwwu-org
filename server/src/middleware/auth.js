const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active.'
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      // Log unauthorized access attempt
      AuditLog.logActivity({
        userId: req.user._id,
        action: 'UNAUTHORIZED_ACCESS',
        resource: req.originalUrl,
        details: {
          requiredRoles: roles,
          userRole: req.user.role
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        success: false,
        errorMessage: 'Insufficient permissions'
      });

      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions.'
      });
    }

    next();
  };
};

const auditLog = (action, resource) => {
  return async (req, res, next) => {
    const startTime = Date.now();
    
    // Store original json method
    const originalJson = res.json;
    
    // Override json method to capture response
    res.json = function(data) {
      const duration = Date.now() - startTime;
      const success = res.statusCode < 400;
      
      // Log the activity
      if (req.user) {
        AuditLog.logActivity({
          userId: req.user._id,
          action,
          resource,
          resourceId: req.params.id || req.body.id,
          details: {
            method: req.method,
            url: req.originalUrl,
            body: req.method !== 'GET' ? req.body : undefined,
            query: req.query
          },
          changes: req.auditChanges,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          success,
          errorMessage: success ? undefined : data.message,
          duration
        });
      }
      
      // Call original json method
      originalJson.call(this, data);
    };
    
    next();
  };
};

module.exports = { auth, authorize, auditLog };