const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const SystemConfig = require('../models/SystemConfig');
const Content = require('../models/Content');
const logger = require('../utils/logger');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB for seeding');

    // Clear existing data (optional - comment out in production)
    if (process.env.NODE_ENV === 'development') {
      await User.deleteMany({});
      await SystemConfig.deleteMany({});
      await Content.deleteMany({});
      logger.info('Cleared existing data');
    }

    // Create Super Admin User
    const superAdminExists = await User.findOne({ role: 'super_admin' });
    if (!superAdminExists) {
      const superAdmin = new User({
        email: process.env.ADMIN_EMAIL || 'admin@sifwwu.org',
        password: process.env.ADMIN_PASSWORD || 'SifwWU@2025!',
        firstName: 'Super',
        lastName: 'Administrator',
        role: 'super_admin',
        status: 'active',
        emailVerified: true,
        department: 'Administration'
      });
      await superAdmin.save();
      logger.info('✓ Super admin user created');
    }

    // Create sample admin users
    const sampleUsers = [
      {
        email: 'admin1@sifwwu.org',
        password: 'Admin123!',
        firstName: 'John',
        lastName: 'Admin',
        role: 'admin',
        status: 'active',
        emailVerified: true,
        department: 'Content Management'
      },
      {
        email: 'moderator1@sifwwu.org',
        password: 'Mod123!',
        firstName: 'Jane',
        lastName: 'Moderator',
        role: 'moderator',
        status: 'active',
        emailVerified: true,
        department: 'Community Management'
      },
      {
        email: 'user1@sifwwu.org',
        password: 'User123!',
        firstName: 'Regular',
        lastName: 'User',
        role: 'user',
        status: 'active',
        emailVerified: true,
        department: 'Film Production'
      }
    ];

    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        logger.info(`✓ Sample user created: ${userData.email}`);
      }
    }

    // Create system configurations
    const systemConfigs = [
      {
        key: 'site_name',
        value: 'SIFWWU Admin Panel',
        type: 'string',
        category: 'general',
        description: 'Website name displayed in the header',
        isPublic: true,
        updatedBy: (await User.findOne({ role: 'super_admin' }))._id
      },
      {
        key: 'site_description',
        value: 'South Indian Film Workers Welfare Union - Admin Panel',
        type: 'string',
        category: 'general',
        description: 'Website description for SEO',
        isPublic: true,
        updatedBy: (await User.findOne({ role: 'super_admin' }))._id
      },
      {
        key: 'maintenance_mode',
        value: false,
        type: 'boolean',
        category: 'system',
        description: 'Enable maintenance mode to restrict access',
        isPublic: false,
        updatedBy: (await User.findOne({ role: 'super_admin' }))._id
      },
      {
        key: 'registration_enabled',
        value: true,
        type: 'boolean',
        category: 'auth',
        description: 'Allow new user registrations',
        isPublic: true,
        updatedBy: (await User.findOne({ role: 'super_admin' }))._id
      },
      {
        key: 'email_verification_required',
        value: true,
        type: 'boolean',
        category: 'auth',
        description: 'Require email verification for new accounts',
        isPublic: false,
        updatedBy: (await User.findOne({ role: 'super_admin' }))._id
      },
      {
        key: 'max_login_attempts',
        value: 5,
        type: 'number',
        category: 'security',
        description: 'Maximum login attempts before account lockout',
        isPublic: false,
        updatedBy: (await User.findOne({ role: 'super_admin' }))._id
      },
      {
        key: 'session_timeout',
        value: 24,
        type: 'number',
        category: 'security',
        description: 'Session timeout in hours',
        isPublic: false,
        updatedBy: (await User.findOne({ role: 'super_admin' }))._id
      },
      {
        key: 'contact_email',
        value: 'southindianfilmtrust@gmail.com',
        type: 'string',
        category: 'contact',
        description: 'Primary contact email address',
        isPublic: true,
        updatedBy: (await User.findOne({ role: 'super_admin' }))._id
      },
      {
        key: 'contact_phone',
        value: '+91 9445799389',
        type: 'string',
        category: 'contact',
        description: 'Primary contact phone number',
        isPublic: true,
        updatedBy: (await User.findOne({ role: 'super_admin' }))._id
      },
      {
        key: 'social_media',
        value: {
          facebook: 'https://facebook.com/sifwwu',
          twitter: 'https://twitter.com/sifwwu',
          instagram: 'https://instagram.com/sifwwu',
          youtube: 'https://youtube.com/sifwwu'
        },
        type: 'object',
        category: 'social',
        description: 'Social media links',
        isPublic: true,
        updatedBy: (await User.findOne({ role: 'super_admin' }))._id
      },
      {
        key: 'file_upload_limits',
        value: {
          maxSize: 5242880, // 5MB
          allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          maxFiles: 10
        },
        type: 'object',
        category: 'uploads',
        description: 'File upload restrictions',
        isPublic: false,
        updatedBy: (await User.findOne({ role: 'super_admin' }))._id
      },
      {
        key: 'email_templates',
        value: {
          welcome: {
            subject: 'Welcome to SIFWWU!',
            enabled: true
          },
          verification: {
            subject: 'Verify Your Email Address',
            enabled: true
          },
          passwordReset: {
            subject: 'Reset Your Password',
            enabled: true
          }
        },
        type: 'object',
        category: 'email',
        description: 'Email template configurations',
        isPublic: false,
        updatedBy: (await User.findOne({ role: 'super_admin' }))._id
      }
    ];

    for (const config of systemConfigs) {
      await SystemConfig.findOneAndUpdate(
        { key: config.key },
        config,
        { upsert: true, new: true }
      );
    }
    logger.info('✓ System configurations seeded');

    // Create sample content
    const adminUser = await User.findOne({ role: 'admin' });
    const sampleContent = [
      {
        title: 'Welcome to SIFWWU',
        slug: 'welcome-to-sifwwu',
        type: 'page',
        content: '<h1>Welcome to South Indian Film Workers Welfare Union</h1><p>A dedicated platform for South Indian film industry professionals. Our mission is to support, protect, and uplift all those working in the film industry, from producers to technicians.</p>',
        excerpt: 'Welcome to the South Indian Film Workers Welfare Union community.',
        status: 'published',
        featured: true,
        author: adminUser._id,
        publishedAt: new Date(),
        tags: ['welcome', 'introduction', 'sifwwu']
      },
      {
        title: 'New Government Scheme for Film Workers',
        slug: 'new-government-scheme-film-workers',
        type: 'news',
        content: '<h2>Government Announces New Welfare Scheme</h2><p>The Tamil Nadu government has announced a comprehensive welfare scheme for film industry workers, providing financial assistance, healthcare benefits, and skill development programs.</p>',
        excerpt: 'Government announces new welfare scheme for film industry professionals.',
        status: 'published',
        featured: true,
        author: adminUser._id,
        publishedAt: new Date(),
        tags: ['government', 'welfare', 'scheme', 'benefits']
      },
      {
        title: 'Film Industry Support Services',
        slug: 'film-industry-support-services',
        type: 'service',
        content: '<h2>Comprehensive Support for Film Professionals</h2><p>We provide a wide range of support services including legal assistance, career guidance, skill development, and networking opportunities for all film industry professionals.</p>',
        excerpt: 'Comprehensive support services for film industry professionals.',
        status: 'published',
        author: adminUser._id,
        publishedAt: new Date(),
        tags: ['services', 'support', 'assistance']
      }
    ];

    for (const contentData of sampleContent) {
      const existingContent = await Content.findOne({ slug: contentData.slug });
      if (!existingContent) {
        const content = new Content(contentData);
        await content.save();
        logger.info(`✓ Sample content created: ${contentData.title}`);
      }
    }

    logger.info('🎉 Database seeding completed successfully!');
    
    // Display login credentials
    console.log('\n' + '='.repeat(60));
    console.log('🔐 DEFAULT LOGIN CREDENTIALS');
    console.log('='.repeat(60));
    console.log(`Super Admin: ${process.env.ADMIN_EMAIL || 'admin@sifwwu.org'}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'SifwWU@2025!'}`);
    console.log('='.repeat(60));
    console.log('📝 Additional test accounts created:');
    console.log('Admin: admin1@sifwwu.org / Admin123!');
    console.log('Moderator: moderator1@sifwwu.org / Mod123!');
    console.log('User: user1@sifwwu.org / User123!');
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;