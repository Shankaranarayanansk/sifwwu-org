# SIFWWU Full-Stack Web Application

A comprehensive web platform for the South Indian Film Workers Welfare Union (SIFWWU) built with Next.js, featuring a public website and secure admin management system.

## 🚀 Features

### Public Website
- **Responsive Design**: Mobile-first design with seamless experience across all devices
- **SEO Optimized**: Server-side rendering with proper meta tags and sitemap
- **Modern UI**: Clean, professional design with smooth animations
- **Content Pages**: Home, About, Services, Leadership, Updates, OTT Platform, Achievements, Contact
- **Contact System**: Form submission with email notifications and WhatsApp integration

### Admin Panel
- **Secure Authentication**: JWT-based authentication with refresh tokens
- **Role-based Access**: Superadmin and Editor roles with appropriate permissions
- **Content Management**: WYSIWYG editor for all content sections
- **Media Library**: Image upload and management with Cloudinary integration
- **CRUD Operations**: Complete management of services, leaders, updates, achievements
- **Message Management**: View and manage contact form submissions
- **Dashboard**: Comprehensive overview with statistics and quick actions

## 🛠 Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with httpOnly cookies
- **File Storage**: Cloudinary for image management
- **Email**: Nodemailer for contact form notifications
- **UI Components**: Radix UI with shadcn/ui
- **Styling**: TailwindCSS with custom design system
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: SWR for API data fetching
- **Testing**: Jest for unit tests

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Cloudinary account
- SMTP email service (Gmail recommended)

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd sifwwu-webapp
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
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sifwwu?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-minimum-32-characters

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
NODE_ENV=development

# Admin Default (used by seed script)
ADMIN_EMAIL=admin@sifwwu.org
ADMIN_PASSWORD=SifwWU@2025!
```

### 3. Database Setup

Seed the database with initial data:

```bash
npm run seed
```

This creates:
- Default admin user (admin@sifwwu.org / SifwWU@2025!)
- Initial content sections
- Sample services, leaders, and achievements

### 4. Development

Start the development server:

```bash
npm run dev
```

The application will be available at:
- **Public Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## 🚀 Production Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Add connection string to environment variables
3. Whitelist deployment IPs

### File Storage (Cloudinary)
1. Create Cloudinary account
2. Get API credentials from dashboard
3. Add to environment variables

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/v1/            # API routes
│   ├── (public)/          # Public pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── layout/           # Layout components
├── lib/                  # Utilities and configurations
│   ├── models/           # Database models
│   ├── auth/             # Authentication utilities
│   ├── middleware/       # API middleware
│   └── services/         # External services
├── scripts/              # Database seed scripts
└── public/               # Static assets
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Login attempt restrictions
- **Input Validation**: Zod schema validation
- **CORS Protection**: Proper CORS headers
- **SQL Injection Prevention**: MongoDB with parameterized queries
- **XSS Protection**: Content sanitization

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/login` - Admin login
- `POST /api/v1/auth/logout` - Admin logout
- `POST /api/v1/auth/refresh` - Refresh access token

### Public Endpoints
- `GET /api/v1/content` - Get all content sections
- `GET /api/v1/services` - Get active services
- `POST /api/v1/contact` - Submit contact form

### Protected Admin Endpoints
- `POST /api/v1/services` - Create service
- `PUT /api/v1/services/:id` - Update service
- `DELETE /api/v1/services/:id` - Delete service
- Similar CRUD endpoints for leaders, updates, achievements

## 🧪 Testing

Run the test suite:

```bash
npm test
npm run test:watch
```

Type checking:

```bash
npm run type-check
```

## 📱 Mobile Responsiveness

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast color scheme
- Target Lighthouse accessibility score: 90+

## 🌐 SEO Features

- Server-side rendering (SSR)
- Static generation (SSG) for performance
- Proper meta tags and Open Graph
- Structured data markup
- XML sitemap generation
- Optimized images with Next.js Image

## 🔧 Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Tailwind**: Utility-first CSS
- **Framer Motion**: Animations

## 📈 Performance Optimizations

- Image optimization with Cloudinary
- Code splitting with Next.js
- API route optimization
- Database query optimization
- Caching strategies
- Bundle size optimization

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

## 🔄 Version History

- **v1.0.0**: Initial release with full functionality
  - Public website with all pages
  - Complete admin panel
  - Authentication system
  - Database integration
  - Email notifications
  - Image upload system

---

Built with ❤️ for the South Indian Film Workers Welfare Union