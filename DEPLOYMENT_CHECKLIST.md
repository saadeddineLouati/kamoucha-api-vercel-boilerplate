# Vercel Deployment Checklist

## Pre-deployment Checklist

### 1. Environment Setup
- [ ] MongoDB Atlas cluster is set up and accessible
- [ ] All required environment variables are prepared
- [ ] Database connection string is tested
- [ ] SMTP configuration is ready (if using email features)

### 2. Code Preparation
- [ ] All dependencies are listed in package.json
- [ ] Node.js version is compatible (>=16.x)
- [ ] No hardcoded environment-specific values
- [ ] Static files are in the public directory

### 3. Vercel Configuration
- [ ] vercel.json is properly configured
- [ ] api/index.js serverless function is created
- [ ] .vercelignore file excludes unnecessary files

### 4. Testing
- [ ] Local development works with `npm run dev`
- [ ] Serverless simulation works with `npm run dev:vercel`
- [ ] Health check endpoint responds correctly
- [ ] Database connection is successful

## Deployment Steps

### 1. Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### 2. Using Git Integration
1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy

## Post-deployment Checklist

### 1. Verify Deployment
- [ ] Health check endpoint: `https://your-domain.vercel.app/api/v1/health`
- [ ] API documentation: `https://your-domain.vercel.app/api/v1/docs`
- [ ] Database connection is working
- [ ] Authentication endpoints are functional

### 2. Environment Variables (Set in Vercel Dashboard)
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URL` (MongoDB Atlas connection string)
- [ ] `JWT_SECRET` (strong secret key)
- [ ] `JWT_ACCESS_EXPIRATION_MINUTES=30`
- [ ] `JWT_REFRESH_EXPIRATION_DAYS=30`
- [ ] `JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10`
- [ ] `JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=60`

### Optional Environment Variables
- [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `EMAIL_FROM`
- [ ] `SOCKET_CLIENT` (your frontend domain)
- [ ] `VAP_ID_PRIVATE_KEY`, `VAP_ID_PUBLIC_KEY`, `VAP_ID_SUBJECT`
- [ ] `AWS_BUCKET_NAME`, `AWS_SECRET_ACCESS_KEY`
- [ ] `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### 3. Performance Testing
- [ ] API response times are acceptable
- [ ] Database queries are optimized
- [ ] Error handling is working properly
- [ ] CORS is configured correctly

### 4. Security Check
- [ ] JWT secret is secure and not exposed
- [ ] Database credentials are secure
- [ ] CORS is properly configured
- [ ] Rate limiting is active in production

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Check Atlas IP whitelist (allow 0.0.0.0/0)
2. **Environment Variables**: Verify all required variables are set
3. **Function Timeout**: Increase maxDuration in vercel.json
4. **CORS Issues**: Set SOCKET_CLIENT environment variable

### Monitoring
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Monitor function performance in Vercel dashboard
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation

## Notes

### Serverless Limitations
- Real-time features (Socket.io) won't work
- Cron jobs need external scheduling
- File uploads should use cloud storage
- Database connections are per-function

### Migration from Server
If migrating from a traditional server:
- [ ] Move real-time features to external services
- [ ] Migrate scheduled tasks to external cron services
- [ ] Update file upload handling to use cloud storage
- [ ] Update frontend to handle serverless API patterns
