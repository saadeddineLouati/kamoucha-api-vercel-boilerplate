# Vercel Deployment Guide

This guide will help you deploy your Kamoucha API to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a MongoDB Atlas cluster for your database
3. **Environment Variables**: Prepare all required environment variables

## Deployment Steps

### 1. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 2. Environment Variables Setup

Before deploying, you need to set up your environment variables in Vercel:

#### Required Environment Variables:

- `NODE_ENV=production`
- `MONGODB_URL` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A secure secret key for JWT tokens
- `JWT_ACCESS_EXPIRATION_MINUTES=30`
- `JWT_REFRESH_EXPIRATION_DAYS=30`
- `JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10`
- `JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=60`

#### Optional Environment Variables:

- `SMTP_HOST` - Your SMTP server
- `SMTP_PORT` - SMTP port (usually 587)
- `SMTP_USERNAME` - SMTP username
- `SMTP_PASSWORD` - SMTP password
- `EMAIL_FROM` - From email address
- `SOCKET_CLIENT` - Your frontend URL for CORS
- `VAP_ID_PRIVATE_KEY` - VAPID private key for push notifications
- `VAP_ID_PUBLIC_KEY` - VAPID public key for push notifications
- `VAP_ID_SUBJECT` - VAPID subject (mailto:your-email@domain.com)
- `AWS_BUCKET_NAME` - AWS S3 bucket name
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
vercel --prod
```

#### Option B: Using Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your project in Vercel dashboard
3. Add environment variables in Vercel dashboard
4. Deploy

### 4. Set Environment Variables in Vercel

#### Using Vercel CLI:

```bash
vercel env add NODE_ENV
vercel env add MONGODB_URL
vercel env add JWT_SECRET
# ... add other variables
```

#### Using Vercel Dashboard:

1. Go to your project in Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add all required environment variables

## Important Notes

### Serverless Limitations

This deployment is configured for Vercel's serverless functions, which means:

1. **No Socket.io**: Real-time features (Socket.io) won't work in serverless mode
2. **No Cron Jobs**: Scheduled tasks need to be handled differently (use Vercel Cron or external services)
3. **Connection Pooling**: Database connections are managed per function invocation

### Database Connection

- Use MongoDB Atlas (cloud MongoDB) instead of local MongoDB
- Connection string should include retryWrites=true
- Make sure to whitelist Vercel's IP addresses in MongoDB Atlas

### File Uploads

- Configure AWS S3 or other cloud storage for file uploads
- Vercel's serverless functions have limited local storage

## Testing Your Deployment

After deployment, test your API endpoints:

```bash
curl https://your-vercel-domain.vercel.app/api/v1/auth/register
```

## Troubleshooting

### Common Issues:

1. **MongoDB Connection**: Ensure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0)
2. **Environment Variables**: Double-check all required environment variables are set
3. **CORS Issues**: Configure SOCKET_CLIENT environment variable with your frontend domain
4. **Function Timeout**: Increase maxDuration in vercel.json if needed

### Logs:

View deployment logs in Vercel dashboard or using CLI:

```bash
vercel logs
```

## Migration from Traditional Server

If you're migrating from a traditional server setup:

1. **Real-time Features**: Consider using Vercel's Edge Functions or external WebSocket services
2. **Cron Jobs**: Use Vercel Cron Beta or external scheduling services
3. **File Storage**: Migrate from local file storage to cloud storage (AWS S3, Cloudinary, etc.)

## Performance Optimization

1. **Cold Starts**: Consider using Vercel Pro for better performance
2. **Database Connections**: Implement connection pooling and reuse
3. **Caching**: Use Vercel Edge Caching for static responses

## Support

For issues specific to this deployment:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas documentation: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
