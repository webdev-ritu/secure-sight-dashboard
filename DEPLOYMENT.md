# Secure Sight Dashboard - Deployment Guide

This guide provides multiple options for deploying the Secure Sight Dashboard application.

## ✅ Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- (Optional) Docker for containerized deployment

## 🚀 Quick Deployment

### Option 1: Automated Script Deployment

```bash
# Make the deployment script executable (if not already)
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

### Option 2: Manual Deployment

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.production .env
# Edit .env with your production values

# 3. Generate Prisma client
npx prisma generate

# 4. Set up database
npx prisma db push
npx prisma db seed

# 5. Build the application
npm run build

# 6. Start production server
npm start
```

### Option 3: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build and run manually
docker build -t secure-sight-dashboard .
docker run -p 3000:3000 \
  -e DATABASE_URL="file:./prisma/dev.db" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e NEXTAUTH_SECRET="your-secret-key" \
  secure-sight-dashboard
```

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Authentication (IMPORTANT: Change for production!)
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-super-secure-random-string"
```

### Production Environment Variables

For production deployment, ensure you:

1. **Change NEXTAUTH_SECRET**: Generate a secure random string
2. **Update NEXTAUTH_URL**: Set to your actual domain
3. **Consider external database**: For scalability, use PostgreSQL or MySQL

Example production `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/secure_sight_db"
NEXTAUTH_URL="https://secure-sight.yourdomain.com"
NEXTAUTH_SECRET="super-secure-random-string-generated-securely"
```

## 🌐 Deployment Platforms

### Vercel (Recommended for Next.js)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Set environment variables in Vercel dashboard

### Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on git push

### DigitalOcean App Platform

1. Create new app from GitHub repository
2. Configure environment variables
3. Deploy with automatic builds

### AWS/Google Cloud/Azure

Use the Docker deployment option with your preferred cloud provider's container service.

## 🗄️ Database Options

### SQLite (Default - Development)
- File-based database
- Good for development and small deployments
- Database file: `prisma/dev.db`

### PostgreSQL (Recommended for Production)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/secure_sight_db"
```

### MySQL
```env
DATABASE_URL="mysql://username:password@localhost:3306/secure_sight_db"
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **NEXTAUTH_SECRET**: Use a strong, random secret key
3. **Database**: Use SSL connections for external databases
4. **HTTPS**: Always use HTTPS in production
5. **Firewall**: Restrict database access to application servers only

## 📊 Monitoring & Health Checks

The application includes health check endpoints:

- `GET /api/health` - Application health status
- `GET /` - Main application endpoint

For Docker deployments, health checks are configured automatically.

## 🔧 Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are installed with `npm install`
2. **Database Errors**: Check DATABASE_URL and ensure database is accessible
3. **Environment Variables**: Verify all required env vars are set
4. **Port Conflicts**: Change port in environment or stop conflicting services

### Logs

- Development: `npm run dev`
- Production: `npm start`
- Docker: `docker logs container-name`

## 🔄 Updates

To update the application:

```bash
git pull origin main
npm install
npx prisma generate
npx prisma db push
npm run build
npm start
```

## 📞 Support

For deployment issues:

1. Check the troubleshooting section above
2. Review application logs
3. Verify environment configuration
4. Check database connectivity

---

**Note**: This application is configured for production deployment. Remember to secure your environment variables and use HTTPS in production environments.