# Quick Deployment Guide for Vercel

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Prepare Your Repository

1. Make sure your code is pushed to GitHub/GitLab/Bitbucket
2. Your project should have the following structure:
   ```
   ├── api/
   │   └── index.js          # Vercel serverless function entry point
   ├── src/                  # Your Express.js application
   ├── vercel.json           # Vercel configuration
   └── package.json          # Dependencies and scripts
   ```

### Step 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign up/log in
2. Click "New Project"
3. Import your repository from GitHub/GitLab/Bitbucket
4. Vercel will automatically detect it's a Node.js project
5. Configure your environment variables (see below)
6. Click "Deploy"

### Step 3: Environment Variables

Add these environment variables in Vercel Dashboard (Settings > Environment Variables):

**Required:**
- `NODE_ENV` = `production`
- `MONGODB_URL` = `your-mongodb-atlas-connection-string`
- `JWT_SECRET` = `your-secure-jwt-secret`
- `JWT_ACCESS_EXPIRATION_MINUTES` = `30`
- `JWT_REFRESH_EXPIRATION_DAYS` = `30`
- `JWT_RESET_PASSWORD_EXPIRATION_MINUTES` = `10`
- `JWT_VERIFY_EMAIL_EXPIRATION_MINUTES` = `60`

**Optional (add as needed):**
- `SMTP_HOST` = `your-smtp-host`
- `SMTP_PORT` = `587`
- `SMTP_USERNAME` = `your-smtp-username`
- `SMTP_PASSWORD` = `your-smtp-password`
- `EMAIL_FROM` = `your-email@domain.com`
- `SOCKET_CLIENT` = `your-frontend-domain`
- `AWS_BUCKET_NAME` = `your-s3-bucket`
- `AWS_SECRET_ACCESS_KEY` = `your-aws-secret`
- `GOOGLE_CLIENT_ID` = `your-google-client-id`
- `GOOGLE_CLIENT_SECRET` = `your-google-client-secret`

## Option 2: Deploy via CLI (After Authentication)

```bash
# Login to Vercel (follow browser authentication)
vercel login

# Deploy to production
vercel --prod
```

## Testing Your Deployment

After deployment, test these endpoints:

```bash
# Health check
curl https://your-project.vercel.app/api/v1/health

# Test a protected route
curl https://your-project.vercel.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```

## Important Notes

1. **Database**: Make sure you're using MongoDB Atlas (cloud MongoDB)
2. **File Uploads**: Configure AWS S3 or similar cloud storage
3. **Real-time Features**: Socket.io won't work in serverless mode
4. **Environment**: Make sure NODE_ENV is set to 'production'

## Next Steps After Deployment

1. Configure your custom domain (if needed)
2. Set up monitoring and logging
3. Configure CORS for your frontend domain
4. Test all API endpoints
5. Set up error tracking (e.g., Sentry)

## Troubleshooting

- **500 Errors**: Check function logs in Vercel dashboard
- **Database Connection**: Verify MongoDB Atlas connection string and IP whitelist
- **Environment Variables**: Double-check all required variables are set
- **CORS Issues**: Set SOCKET_CLIENT environment variable
