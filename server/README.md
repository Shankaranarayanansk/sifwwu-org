# SIFWWU Admin Panel Backend

A comprehensive, production-ready backend system for the South Indian Film Workers Welfare Union (SIFWWU) admin panel.

## 🚀 Features

### Core Functionality
- **JWT Authentication & Authorization** with refresh tokens
- **Role-based Access Control** (Super Admin, Admin, Moderator, User)
- **User Management** with CRUD operations and bulk actions
- **Content Management System** with versioning and workflow
- **Dashboard Analytics** with real-time statistics
- **System Configuration** management
- **Audit Logging** for all user activities
- **File Upload** with Cloudinary integration
- **Email Service** with templates and notifications

### Security Features
- Password hashing with bcrypt
- Rate limiting for API endpoints
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Account lockout after failed login attempts
- Password reset with secure tokens
- Email verification system

### Performance & Monitoring
- Request logging with Winston
- Error handling and reporting
- Database connection pooling
- Compression middleware
- Performance metrics collection
- System health monitoring

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB 4.4+
- SMTP email service (Gmail recommended)
- Cloudinary account (optional, for file uploads)

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your actual values:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/sifwwu_admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-minimum-32-characters-long

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# Other configurations...
```

### 3. Database Setup

Seed the database with initial data:

```bash
npm run seed
```

This creates:
- Super admin user (admin@sifwwu.org / SifwWU@2025!)
- Sample users for testing
- System configurations
- Sample content

### 4. Development

Start the development server:

```bash
npm run dev
```

The API will be available at:
- **API Base URL**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

## 📚 API Documentation

The API documentation is automatically generated using Swagger/OpenAPI and is available at `/api-docs` when running in development mode.

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user profile

#### User Management
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/bulk` - Bulk operations
- `POST /api/users/import` - Import users from CSV
- `GET /api/users/:id/activity` - Get user activity logs

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/analytics` - Get analytics data
- `GET /api/dashboard/system-health` - Get system health status

#### Content Management
- `GET /api/content` - Get all content
- `POST /api/content` - Create content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

#### System Configuration
- `GET /api/system/config` - Get system configurations
- `PUT /api/system/config/:key` - Update configuration
- `GET /api/system/logs` - Get system logs

#### File Upload
- `POST /api/upload` - Upload files

## 🏗️ Project Structure

```
server/
├── src/
│   ├── config/           # Configuration files
│   │   └── swagger.js    # API documentation config
│   ├── database/         # Database related files
│   │   ├── connection.js # Database connection
│   │   └── seed.js       # Database seeding
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # Authentication middleware
│   │   ├── validation.js # Input validation
│   │   └── errorHandler.js # Error handling
│   ├── models/           # Database models
│   │   ├── User.js       # User model
│   │   ├── Content.js    # Content model
│   │   ├── AuditLog.js   # Audit log model
│   │   └── SystemConfig.js # System config model
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication routes
│   │   ├── users.js      # User management routes
│   │   ├── dashboard.js  # Dashboard routes
│   │   ├── content.js    # Content management routes
│   │   ├── system.js     # System routes
│   │   └── upload.js     # File upload routes
│   ├── services/         # Business logic services
│   │   └── emailService.js # Email service
│   ├── utils/            # Utility functions
│   │   └── logger.js     # Logging utility
│   └── server.js         # Main server file
├── logs/                 # Log files
├── uploads/              # File uploads
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables example
└── README.md            # This file
```

## 🧪 Testing

Run the test suite:

```bash
npm test
npm run test:coverage
```

## 📊 Monitoring & Logging

### Logging
The application uses Winston for comprehensive logging:
- **Console logs** for development
- **File logs** for production (`logs/combined.log`, `logs/error.log`)
- **Exception handling** with automatic logging
- **Audit logs** stored in database

### Health Monitoring
- System health endpoint: `GET /api/dashboard/system-health`
- Database connection monitoring
- Memory usage tracking
- Error rate monitoring
- Performance metrics collection

## 🔒 Security Best Practices

### Authentication & Authorization
- JWT tokens with short expiration times
- Refresh token rotation
- Role-based access control
- Account lockout after failed attempts

### Data Protection
- Password hashing with bcrypt (12 rounds)
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### API Security
- Rate limiting on all endpoints
- CORS configuration
- Security headers with Helmet
- Request size limits

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set up email service
4. Configure file storage (Cloudinary)
5. Set secure JWT secrets

### Production Considerations
- Use PM2 or similar for process management
- Set up reverse proxy (Nginx)
- Configure SSL certificates
- Set up monitoring and alerting
- Regular database backups
- Log rotation

### Docker Deployment
```bash
# Build image
docker build -t sifwwu-backend .

# Run container
docker run -d \
  --name sifwwu-backend \
  -p 5000:5000 \
  --env-file .env \
  sifwwu-backend
```

## 📈 Performance Optimization

### Database
- Proper indexing on frequently queried fields
- Connection pooling
- Query optimization
- Aggregation pipelines for analytics

### API
- Response compression
- Caching strategies
- Pagination for large datasets
- Bulk operations for efficiency

### Monitoring
- Response time tracking
- Error rate monitoring
- Resource usage monitoring
- Database performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For technical support or questions:
- Email: southindianfilmtrust@gmail.com
- Phone: +91 9445799389

---

Built with ❤️ for the South Indian Film Workers Welfare Union