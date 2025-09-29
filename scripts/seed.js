require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'CommonJS',
    moduleResolution: 'node',
    esModuleInterop: true,
    target: 'ES2019'
  }
});
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Admin = require('../lib/models/Admin').default;
const ContentSection = require('../lib/models/ContentSection').default;
const Service = require('../lib/models/Service').default;
const Leader = require('../lib/models/Leader').default;
const Achievement = require('../lib/models/Achievement').default;

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Seeding data...');

    // Create default admin user
    const adminExists = await Admin.findOne({ email: 'admin@sifwwu.org' });
    if (!adminExists) {
      const admin = new Admin({
        email: 'admin@sifwwu.org',
        password: 'SifwWU@2025!',
        name: 'Super Administrator',
        role: 'superadmin',
      });
      await admin.save();
      console.log('✓ Default admin user created');
    }

    // Seed content sections
    const contentSections = [
      {
        key: 'home-hero',
        title: 'Welcome to SIFWWU',
        content: 'Welcome to South Indian Film Workers Welfare Union — A dedicated platform for South Indian film industry professionals! Our mission is to support, protect, and uplift all those working in the film industry, from producers to technicians.',
      },
      {
        key: 'about-who-we-are',
        title: 'Who We Are?',
        content: 'The South Indian Film Workers Welfare Union is an organization dedicated to supporting professionals in the film industry. We work tirelessly to ensure the welfare, rights, and development of all film industry workers across South India.',
      },
      {
        key: 'about-why-we-started',
        title: 'Why We Started?',
        content: 'Our union was formed not as a competition or opposition to anyone, but to bring positive change to the film industry. We believe in unity, progress, and creating opportunities for everyone involved in filmmaking.',
      },
      {
        key: 'ott-platform',
        title: 'A2S OTT Platform',
        content: 'A2S OTT Platform features: Support Small-Scale Producers, Skill Development, Job Opportunities, Career Guidance, Scholarships, Exposure, Internships. Join our platform to grow your career in the film industry.',
      },
    ];

    for (const section of contentSections) {
      await ContentSection.findOneAndUpdate(
        { key: section.key },
        section,
        { upsert: true }
      );
    }
    console.log('✓ Content sections seeded');

    // Seed services
    const services = [
      {
        title: 'Film Industry News',
        description: 'Stay updated with the latest news and developments in the South Indian film industry.',
        order: 1,
      },
      {
        title: 'Government Benefits',
        description: 'Access information about government schemes and benefits available for film industry workers.',
        order: 2,
      },
      {
        title: 'Job Opportunities',
        description: 'Find the latest job openings and career opportunities in the film industry.',
        order: 3,
      },
      {
        title: 'Production Support',
        description: 'Get support and guidance for film production projects and initiatives.',
        order: 4,
      },
      {
        title: 'Legal Assistance',
        description: 'Access legal support and guidance for industry-related matters.',
        order: 5,
      },
      {
        title: 'Security & Identification',
        description: 'Secure identification and verification services for industry professionals.',
        order: 6,
      },
    ];

    for (const service of services) {
      await Service.findOneAndUpdate(
        { title: service.title },
        service,
        { upsert: true }
      );
    }
    console.log('✓ Services seeded');

    // Seed leaders
    const leaders = [
      {
        name: 'DhanaSaker',
        position: 'Founder & President',
        bio: 'Visionary leader dedicated to the welfare of South Indian film industry workers.',
        order: 1,
      },
      {
        name: 'Mr. K. Thirugnanam',
        position: 'State President',
        bio: 'Experienced leader with deep knowledge of the film industry landscape.',
        order: 2,
      },
      {
        name: 'Dr. MF Ramesh',
        position: 'General Secretary',
        bio: 'Committed to organizing and coordinating union activities for maximum impact.',
        order: 3,
      },
    ];

    for (const leader of leaders) {
      await Leader.findOneAndUpdate(
        { name: leader.name },
        leader,
        { upsert: true }
      );
    }
    console.log('✓ Leaders seeded');

    // Seed achievements
    const achievements = [
      {
        title: 'Industry Recognition',
        description: 'Received recognition from major film industry bodies for our welfare initiatives.',
        date: new Date('2024-01-15'),
        order: 1,
      },
      {
        title: 'Member Support',
        description: 'Successfully provided support and assistance to over 1000+ film industry workers.',
        date: new Date('2024-06-10'),
        order: 2,
      },
      {
        title: 'Worker Protection',
        description: 'Implemented comprehensive worker protection measures across multiple film sets.',
        date: new Date('2024-09-20'),
        order: 3,
      },
    ];

    for (const achievement of achievements) {
      await Achievement.findOneAndUpdate(
        { title: achievement.title },
        achievement,
        { upsert: true }
      );
    }
    console.log('✓ Achievements seeded');

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();