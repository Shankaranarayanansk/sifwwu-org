const express = require('express');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { validate, schemas } = require('../middleware/validation');
const { authorize, auditLog } = require('../middleware/auth');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

const router = express.Router();

// Configure multer for CSV uploads
const upload = multer({
  dest: 'uploads/temp/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || path.extname(file.originalname) === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users with pagination and filtering
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [super_admin, admin, moderator, user]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, suspended, pending]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       403:
 *         description: Insufficient permissions
 */
router.get('/', 
  authorize('super_admin', 'admin'), 
  validate(schemas.paginationQuery, 'query'),
  auditLog('READ', 'users'),
  async (req, res) => {
    try {
      const { page, limit, search, role, status, sort, order } = req.query;
      
      // Build filter
      const filter = {};
      if (role) filter.role = role;
      if (status) filter.status = status;
      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort
      const sortObj = {};
      sortObj[sort] = order === 'asc' ? 1 : -1;

      // Execute query
      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        User.find(filter)
          .select('-password -emailVerificationToken -passwordResetToken')
          .sort(sortObj)
          .skip(skip)
          .limit(limit)
          .populate('metadata.createdBy', 'firstName lastName email')
          .populate('metadata.updatedBy', 'firstName lastName email'),
        User.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      logger.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users'
      });
    }
  }
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/:id', 
  authorize('super_admin', 'admin', 'moderator'),
  auditLog('READ', 'user'),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select('-password -emailVerificationToken -passwordResetToken')
        .populate('metadata.createdBy', 'firstName lastName email')
        .populate('metadata.updatedBy', 'firstName lastName email');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Get user activity logs
      const activityLogs = await AuditLog.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('action resource createdAt ipAddress success');

      res.json({
        success: true,
        data: {
          user,
          activityLogs
        }
      });
    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user'
      });
    }
  }
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [super_admin, admin, moderator, user]
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended, pending]
 *               phone:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post('/', 
  authorize('super_admin', 'admin'),
  validate(schemas.userRegistration),
  auditLog('CREATE', 'user'),
  async (req, res) => {
    try {
      const { email, password, firstName, lastName, role, status, phone, department } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Role validation - only super_admin can create super_admin users
      if (role === 'super_admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to create super admin user'
        });
      }

      const user = new User({
        email,
        password,
        firstName,
        lastName,
        role: role || 'user',
        status: status || 'active',
        phone,
        department,
        emailVerified: true, // Admin created users are pre-verified
        metadata: {
          createdBy: req.user._id,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { user }
      });
    } catch (error) {
      logger.error('Create user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create user'
      });
    }
  }
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [super_admin, admin, moderator, user]
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended, pending]
 *               phone:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/:id', 
  authorize('super_admin', 'admin'),
  validate(schemas.userUpdate),
  auditLog('UPDATE', 'user'),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Store original data for audit
      const originalData = user.toObject();

      // Role validation
      if (req.body.role && req.body.role === 'super_admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to assign super admin role'
        });
      }

      // Prevent users from modifying their own role/status
      if (user._id.toString() === req.user._id.toString()) {
        delete req.body.role;
        delete req.body.status;
      }

      // Update user
      Object.assign(user, req.body);
      user.metadata.updatedBy = req.user._id;
      await user.save();

      // Store audit changes
      req.auditChanges = {
        before: originalData,
        after: user.toObject()
      };

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user }
      });
    } catch (error) {
      logger.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user'
      });
    }
  }
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Cannot delete own account
 */
router.delete('/:id', 
  authorize('super_admin', 'admin'),
  auditLog('DELETE', 'user'),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Prevent users from deleting their own account
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }

      // Prevent deletion of super admin by non-super admin
      if (user.role === 'super_admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to delete super admin user'
        });
      }

      await User.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      logger.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user'
      });
    }
  }
);

/**
 * @swagger
 * /api/users/bulk:
 *   post:
 *     summary: Bulk operations on users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *               - ids
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [delete, activate, deactivate, export]
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *               options:
 *                 type: object
 *     responses:
 *       200:
 *         description: Bulk operation completed successfully
 *       400:
 *         description: Invalid request
 */
router.post('/bulk', 
  authorize('super_admin', 'admin'),
  validate(schemas.bulkOperation),
  auditLog('BULK_OPERATION', 'users'),
  async (req, res) => {
    try {
      const { action, ids, options } = req.body;

      // Prevent bulk operations on own account
      const userIdString = req.user._id.toString();
      if (ids.includes(userIdString)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot perform bulk operations on your own account'
        });
      }

      let result;
      switch (action) {
        case 'delete':
          // Prevent deletion of super admins by non-super admins
          if (req.user.role !== 'super_admin') {
            const superAdmins = await User.find({ 
              _id: { $in: ids }, 
              role: 'super_admin' 
            });
            if (superAdmins.length > 0) {
              return res.status(403).json({
                success: false,
                message: 'Cannot delete super admin users'
              });
            }
          }
          result = await User.deleteMany({ _id: { $in: ids } });
          break;

        case 'activate':
          result = await User.updateMany(
            { _id: { $in: ids } },
            { status: 'active', 'metadata.updatedBy': req.user._id }
          );
          break;

        case 'deactivate':
          result = await User.updateMany(
            { _id: { $in: ids } },
            { status: 'inactive', 'metadata.updatedBy': req.user._id }
          );
          break;

        case 'export':
          const users = await User.find({ _id: { $in: ids } })
            .select('-password -emailVerificationToken -passwordResetToken');
          
          const csvWriter = createCsvWriter({
            path: `uploads/exports/users_${Date.now()}.csv`,
            header: [
              { id: '_id', title: 'ID' },
              { id: 'email', title: 'Email' },
              { id: 'firstName', title: 'First Name' },
              { id: 'lastName', title: 'Last Name' },
              { id: 'role', title: 'Role' },
              { id: 'status', title: 'Status' },
              { id: 'phone', title: 'Phone' },
              { id: 'department', title: 'Department' },
              { id: 'createdAt', title: 'Created At' },
              { id: 'lastLogin', title: 'Last Login' }
            ]
          });

          await csvWriter.writeRecords(users);
          
          return res.json({
            success: true,
            message: 'Export completed successfully',
            data: {
              exportedCount: users.length,
              downloadUrl: `/api/users/download/users_${Date.now()}.csv`
            }
          });

        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid bulk action'
          });
      }

      res.json({
        success: true,
        message: `Bulk ${action} completed successfully`,
        data: {
          affectedCount: result.modifiedCount || result.deletedCount || 0
        }
      });
    } catch (error) {
      logger.error('Bulk operation error:', error);
      res.status(500).json({
        success: false,
        message: 'Bulk operation failed'
      });
    }
  }
);

/**
 * @swagger
 * /api/users/import:
 *   post:
 *     summary: Import users from CSV
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Import completed successfully
 *       400:
 *         description: Invalid file or format
 */
router.post('/import', 
  authorize('super_admin', 'admin'),
  upload.single('file'),
  auditLog('IMPORT', 'users'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'CSV file is required'
        });
      }

      const results = [];
      const errors = [];
      let lineNumber = 1;

      // Parse CSV file
      fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (data) => {
          lineNumber++;
          try {
            // Validate required fields
            if (!data.email || !data.firstName || !data.lastName) {
              errors.push({
                line: lineNumber,
                error: 'Missing required fields (email, firstName, lastName)'
              });
              return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
              errors.push({
                line: lineNumber,
                error: 'Invalid email format'
              });
              return;
            }

            results.push({
              email: data.email.toLowerCase().trim(),
              firstName: data.firstName.trim(),
              lastName: data.lastName.trim(),
              role: data.role || 'user',
              status: data.status || 'active',
              phone: data.phone?.trim(),
              department: data.department?.trim(),
              password: data.password || Math.random().toString(36).slice(-8) // Generate random password if not provided
            });
          } catch (error) {
            errors.push({
              line: lineNumber,
              error: error.message
            });
          }
        })
        .on('end', async () => {
          try {
            // Clean up temp file
            fs.unlinkSync(req.file.path);

            if (errors.length > 0) {
              return res.status(400).json({
                success: false,
                message: 'CSV validation failed',
                errors
              });
            }

            // Check for duplicate emails in CSV
            const emails = results.map(r => r.email);
            const duplicateEmails = emails.filter((email, index) => emails.indexOf(email) !== index);
            if (duplicateEmails.length > 0) {
              return res.status(400).json({
                success: false,
                message: 'Duplicate emails found in CSV',
                duplicates: duplicateEmails
              });
            }

            // Check for existing users
            const existingUsers = await User.find({ 
              email: { $in: emails } 
            }).select('email');
            
            if (existingUsers.length > 0) {
              return res.status(400).json({
                success: false,
                message: 'Some users already exist',
                existingEmails: existingUsers.map(u => u.email)
              });
            }

            // Create users
            const usersToCreate = results.map(userData => ({
              ...userData,
              emailVerified: true,
              metadata: {
                createdBy: req.user._id,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
              }
            }));

            const createdUsers = await User.insertMany(usersToCreate);

            res.json({
              success: true,
              message: 'Users imported successfully',
              data: {
                importedCount: createdUsers.length,
                users: createdUsers.map(u => ({
                  id: u._id,
                  email: u.email,
                  name: u.fullName
                }))
              }
            });
          } catch (error) {
            logger.error('Import processing error:', error);
            res.status(500).json({
              success: false,
              message: 'Import processing failed'
            });
          }
        })
        .on('error', (error) => {
          // Clean up temp file
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          
          logger.error('CSV parsing error:', error);
          res.status(400).json({
            success: false,
            message: 'Invalid CSV file format'
          });
        });
    } catch (error) {
      // Clean up temp file
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      logger.error('Import error:', error);
      res.status(500).json({
        success: false,
        message: 'Import failed'
      });
    }
  }
);

/**
 * @swagger
 * /api/users/{id}/activity:
 *   get:
 *     summary: Get user activity logs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/:id/activity', 
  authorize('super_admin', 'admin', 'moderator'),
  validate(schemas.paginationQuery, 'query'),
  async (req, res) => {
    try {
      const { page, limit } = req.query;
      const skip = (page - 1) * limit;

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const [logs, total] = await Promise.all([
        AuditLog.find({ userId: req.params.id })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        AuditLog.countDocuments({ userId: req.params.id })
      ]);

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          logs,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      logger.error('Get user activity error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user activity'
      });
    }
  }
);

module.exports = router;