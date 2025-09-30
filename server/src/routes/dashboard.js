const express = require('express');
const User = require('../models/User');
const Content = require('../models/Content');
const AuditLog = require('../models/AuditLog');
const SystemConfig = require('../models/SystemConfig');
const { authorize } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 */
router.get('/stats', authorize('super_admin', 'admin', 'moderator'), async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalContent,
      publishedContent,
      recentActivity,
      usersByRole,
      usersByStatus,
      contentByType,
      monthlyUserGrowth,
      systemHealth
    ] = await Promise.all([
      // Basic counts
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      Content.countDocuments(),
      Content.countDocuments({ status: 'published' }),
      
      // Recent activity
      AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('userId', 'firstName lastName email'),
      
      // User distribution
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      
      User.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      // Content distribution
      Content.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      
      // Monthly user growth (last 12 months)
      User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      
      // System health check
      getSystemHealth()
    ]);

    // Calculate growth percentages
    const lastMonthUsers = await User.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
      }
    });

    const previousMonthUsers = await User.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 2)),
        $lt: new Date(new Date().setMonth(new Date().getMonth() - 1))
      }
    });

    const userGrowthRate = previousMonthUsers > 0 
      ? ((lastMonthUsers - previousMonthUsers) / previousMonthUsers * 100).toFixed(2)
      : 0;

    // Format data for charts
    const userRoleChart = usersByRole.map(item => ({
      label: item._id,
      value: item.count
    }));

    const userStatusChart = usersByStatus.map(item => ({
      label: item._id,
      value: item.count
    }));

    const contentTypeChart = contentByType.map(item => ({
      label: item._id,
      value: item.count
    }));

    const growthChart = monthlyUserGrowth.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      users: item.count
    }));

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          totalContent,
          publishedContent,
          userGrowthRate: parseFloat(userGrowthRate)
        },
        charts: {
          usersByRole: userRoleChart,
          usersByStatus: userStatusChart,
          contentByType: contentTypeChart,
          monthlyGrowth: growthChart
        },
        recentActivity: recentActivity.map(log => ({
          id: log._id,
          user: log.userId ? {
            name: `${log.userId.firstName} ${log.userId.lastName}`,
            email: log.userId.email
          } : null,
          action: log.action,
          resource: log.resource,
          timestamp: log.createdAt,
          success: log.success
        })),
        systemHealth
      }
    });
  } catch (error) {
    logger.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard statistics'
    });
  }
});

/**
 * @swagger
 * /api/dashboard/analytics:
 *   get:
 *     summary: Get detailed analytics data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 */
router.get('/analytics', authorize('super_admin', 'admin'), async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case '1y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 30));
    }

    const [
      userRegistrations,
      userLogins,
      contentCreation,
      topActions,
      errorRates,
      performanceMetrics
    ] = await Promise.all([
      // User registrations over time
      User.aggregate([
        {
          $match: { createdAt: { $gte: startDate } }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // User logins over time
      AuditLog.aggregate([
        {
          $match: {
            action: 'LOGIN',
            createdAt: { $gte: startDate },
            success: true
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Content creation over time
      Content.aggregate([
        {
          $match: { createdAt: { $gte: startDate } }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Top actions
      AuditLog.aggregate([
        {
          $match: { createdAt: { $gte: startDate } }
        },
        {
          $group: {
            _id: '$action',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      // Error rates
      AuditLog.aggregate([
        {
          $match: { createdAt: { $gte: startDate } }
        },
        {
          $group: {
            _id: '$success',
            count: { $sum: 1 }
          }
        }
      ]),

      // Performance metrics (average response times)
      AuditLog.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            duration: { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: '$resource',
            avgDuration: { $avg: '$duration' },
            count: { $sum: 1 }
          }
        },
        { $sort: { avgDuration: -1 } },
        { $limit: 10 }
      ])
    ]);

    // Calculate error rate percentage
    const totalRequests = errorRates.reduce((sum, item) => sum + item.count, 0);
    const errorCount = errorRates.find(item => item._id === false)?.count || 0;
    const errorRatePercentage = totalRequests > 0 ? (errorCount / totalRequests * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        period,
        dateRange: {
          start: startDate,
          end: new Date()
        },
        metrics: {
          userRegistrations: userRegistrations.map(item => ({
            date: item._id,
            count: item.count
          })),
          userLogins: userLogins.map(item => ({
            date: item._id,
            count: item.count
          })),
          contentCreation: contentCreation.map(item => ({
            date: item._id,
            count: item.count
          })),
          topActions: topActions.map(item => ({
            action: item._id,
            count: item.count
          })),
          errorRate: parseFloat(errorRatePercentage),
          performance: performanceMetrics.map(item => ({
            resource: item._id,
            avgResponseTime: Math.round(item.avgDuration),
            requestCount: item.count
          }))
        }
      }
    });
  } catch (error) {
    logger.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics data'
    });
  }
});

/**
 * @swagger
 * /api/dashboard/system-health:
 *   get:
 *     summary: Get system health status
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System health status retrieved successfully
 */
router.get('/system-health', authorize('super_admin', 'admin'), async (req, res) => {
  try {
    const health = await getSystemHealth();
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    logger.error('System health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system health status'
    });
  }
});

// Helper function to get system health
async function getSystemHealth() {
  try {
    const [
      dbStatus,
      memoryUsage,
      diskUsage,
      uptime,
      activeConnections,
      errorRate
    ] = await Promise.all([
      // Database status
      checkDatabaseHealth(),
      
      // Memory usage
      process.memoryUsage(),
      
      // Disk usage (simplified)
      getDiskUsage(),
      
      // System uptime
      process.uptime(),
      
      // Active connections (simplified)
      getActiveConnections(),
      
      // Recent error rate
      getRecentErrorRate()
    ]);

    return {
      status: dbStatus.connected ? 'healthy' : 'unhealthy',
      database: dbStatus,
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        usage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100) // %
      },
      disk: diskUsage,
      uptime: Math.round(uptime),
      connections: activeConnections,
      errorRate: errorRate,
      timestamp: new Date()
    };
  } catch (error) {
    logger.error('System health check failed:', error);
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date()
    };
  }
}

async function checkDatabaseHealth() {
  try {
    const mongoose = require('mongoose');
    const isConnected = mongoose.connection.readyState === 1;
    
    if (isConnected) {
      // Test database with a simple query
      await User.findOne().limit(1);
      return {
        connected: true,
        status: 'healthy',
        responseTime: Date.now() // Simplified
      };
    } else {
      return {
        connected: false,
        status: 'disconnected'
      };
    }
  } catch (error) {
    return {
      connected: false,
      status: 'error',
      error: error.message
    };
  }
}

function getDiskUsage() {
  // Simplified disk usage check
  // In production, you might want to use a proper disk usage library
  return {
    used: 0,
    total: 0,
    usage: 0
  };
}

function getActiveConnections() {
  // Simplified active connections count
  // In production, you might want to track this more accurately
  return {
    current: 0,
    max: 100
  };
}

async function getRecentErrorRate() {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const [totalRequests, errorRequests] = await Promise.all([
      AuditLog.countDocuments({ createdAt: { $gte: oneHourAgo } }),
      AuditLog.countDocuments({ 
        createdAt: { $gte: oneHourAgo },
        success: false 
      })
    ]);

    const errorRate = totalRequests > 0 ? (errorRequests / totalRequests * 100).toFixed(2) : 0;
    
    return {
      rate: parseFloat(errorRate),
      total: totalRequests,
      errors: errorRequests,
      period: '1h'
    };
  } catch (error) {
    return {
      rate: 0,
      error: error.message
    };
  }
}

module.exports = router;