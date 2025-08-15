# Deployment Guide for Travel Blog

This guide will help you deploy your travel blog application to Vercel or Netlify for free.

## Prerequisites

1. **Git repository**: Push your code to GitHub, GitLab, or Bitbucket
2. **Neon Database**: Sign up for a free Neon PostgreSQL database at https://neon.tech
3. **Vercel or Netlify account**: Sign up for free at https://vercel.com or https://netlify.com

## Option 1: Deploy to Vercel (Recommended for Full-Stack Apps)

### Step 1: Prepare Your Repository
1. **Manual package.json update**: Add these scripts to your `package.json` in the scripts section:
```json
"build:vercel": "npm run build",
"postinstall": "npm run db:push"
```

2. **Verify files exist**: Make sure you have:
   - `vercel.json` (deployment configuration)
   - `.env.example` (environment variables template)

### Step 2: Set Up Database
1. Go to https://neon.tech and create a free account
2. Create a new project
3. Copy the connection string (it should look like: `postgresql://username:password@host/database?sslmode=require`)

### Step 3: Deploy to Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click "New Project" 
3. Import your repository
4. Configure these settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

### Step 4: Add Environment Variables in Vercel
In your Vercel project dashboard, go to Settings → Environment Variables and add:

```
DATABASE_URL = your_neon_database_connection_string
SESSION_SECRET = generate_a_random_secret_key_here
ADMIN_PASSWORD = your_chosen_admin_password
NODE_ENV = production
```

### Step 5: Deploy
1. Click "Deploy" and wait for the build to complete
2. Your site will be available at `https://your-project-name.vercel.app`

## Option 2: Deploy to Netlify (Requires Additional Setup)

### Step 1: Prepare Your Repository  
1. **Install additional dependencies**:
```bash
npm install @netlify/functions serverless-http
```

2. **Verify files exist**:
   - `netlify.toml` (deployment configuration)
   - `netlify/functions/server.ts` (serverless function template)

3. **Modify server for Netlify**: You'll need to export the Express app from `server/index.ts` for serverless deployment

### Step 2: Set Up Database
Same as Vercel - create a Neon database and get the connection string.

### Step 3: Deploy to Netlify
1. Go to https://netlify.com and sign in with GitHub
2. Click "New site from Git"
3. Choose your repository
4. Configure these settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `client/dist`

### Step 4: Add Environment Variables in Netlify
In your Netlify dashboard, go to Site Settings → Environment Variables and add:

```
DATABASE_URL = your_neon_database_connection_string  
SESSION_SECRET = generate_a_random_secret_key_here
ADMIN_PASSWORD = your_chosen_admin_password
NODE_ENV = production
```

### Step 5: Deploy
1. Click "Deploy site" and wait for the build to complete
2. Your site will be available at `https://your-site-name.netlify.app`

## Accessing the Admin Panel

### Admin Route
Your admin panel is accessible at: `https://your-domain.com/admin`

### Admin Login
- **Username**: `admin` 
- **Password**: The password you set in `ADMIN_PASSWORD` environment variable

### Admin Features
Through the admin panel you can:
- **Blog Posts**: Create, edit, delete travel stories
  - Add social media links (Instagram, Twitter, Facebook, YouTube)
  - Set featured images and categories
  - Manage hashtags for social sharing
  
- **Destinations**: Create, edit, delete travel destinations
  - Add location coordinates for maps
  - Set difficulty levels and budget ranges
  - Add social media integration for each destination
  
- **Gallery Collections**: Manage photo galleries
  - Link destinations to photo collections
  - Add YouTube videos to galleries
  
- **Travel Journey**: View and manage journey progress
  - Set current location
  - View travel pins on interactive map

### Social Media Integration via Admin
1. **For each blog post/destination**, you can add:
   - Instagram post URL
   - Twitter/X post URL  
   - Facebook post URL
   - YouTube video URL
   - Custom hashtags for sharing

2. **Users can then**:
   - Share content with pre-filled social media posts
   - View your official social media posts about each location
   - Use your hashtags when sharing
   - Access all sharing options from both card views and detail pages

## Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Random string for session encryption (min 32 characters) | Yes |
| `ADMIN_PASSWORD` | Password for admin panel access | Yes |
| `NODE_ENV` | Set to "production" for deployed sites | Yes |

## Troubleshooting

### Build Errors
1. **Database connection issues**: Make sure your `DATABASE_URL` is correct and includes `?sslmode=require`
2. **Missing dependencies**: Run `npm install` locally first to verify dependencies
3. **Type errors**: Run `npm run check` locally to catch TypeScript issues

### Runtime Errors  
1. **Admin panel not accessible**: Check that `ADMIN_PASSWORD` environment variable is set
2. **Database errors**: Verify your Neon database is active and connection string is correct
3. **API errors**: Check function logs in your deployment dashboard

### Social Media Integration
- Instagram, Twitter, Facebook, and YouTube links are optional
- Admin can add these through the admin panel for each blog post and destination
- Users can share content even without admin-configured social media links

## Free Tier Limitations

### Vercel Free Tier ⭐ (Recommended)
- **Bandwidth**: 100 GB/month
- **Function execution**: 100 GB-hours/month  
- **Functions**: Unlimited invocations
- **Build time**: 6,000 minutes/month
- **Custom domains**: Yes
- **SSL**: Free automatic HTTPS
- **Best for**: This travel blog application

### Netlify Free Tier
- **Bandwidth**: 100 GB/month
- **Function invocations**: 125,000/month
- **Function runtime**: 125,000 seconds/month
- **Build time**: 300 minutes/month
- **Custom domains**: Yes
- **Note**: Requires additional setup for backend

### Neon Database Free Tier
- **Storage**: 0.5 GB
- **Compute time**: 191.9 hours/month
- **Databases**: 1 database
- **Connections**: Direct connections included
- **Note**: Perfect for personal travel blogs

## Getting Your Code as ZIP and Setting Up Git

### Method 1: Download from Replit
1. In your Replit project, click the three dots menu (⋮)
2. Select "Download as ZIP"
3. Extract the ZIP file to your computer
4. Continue with "Setting Up Git Repository" below

### Method 2: Clone from Replit (if connected to Git)
1. If your Replit is connected to GitHub, you can clone directly:
```bash
git clone https://github.com/your-username/your-repo-name.git
```

### Setting Up Git Repository
1. **Create a new repository** on GitHub (https://github.com/new)
   - Choose a descriptive name like "travel-blog"
   - Make it public (for free deployment)
   - Don't initialize with README since you have existing code

2. **Upload your code**:
   - If you downloaded ZIP: drag and drop files to GitHub web interface
   - If you have Git installed locally:
   ```bash
   cd your-extracted-folder
   git init
   git add .
   git commit -m "Initial commit: Travel blog with social media integration"
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

3. **Connect to deployment platform**:
   - Go to Vercel or Netlify
   - Connect your GitHub account
   - Import your repository
   - Follow deployment steps above

## Testing Your Deployment

### Before Deployment
1. **Test locally**: Run `npm run dev` and verify everything works
2. **Test admin panel**: Visit `http://localhost:5000/admin` and login
3. **Test social sharing**: Try sharing a blog post and destination
4. **Check database**: Ensure data loads properly

### After Deployment
1. **Test your live site**: Visit your deployed URL
2. **Verify admin access**: Visit `https://your-domain.com/admin`
3. **Test social sharing**: Click share buttons on:
   - Blog cards (in letters section)
   - Destination cards (in journey section) 
   - Individual blog post pages (at the end)
   - Individual destination pages (at the end)
4. **Test mobile compatibility**: Check on mobile devices

## Support & Troubleshooting

### Common Issues
1. **Build failures**: 
   - Check build logs in deployment dashboard
   - Verify all environment variables are set
   - Ensure database URL is correct

2. **Admin panel issues**:
   - Verify `ADMIN_PASSWORD` environment variable is set
   - Check that admin route `/admin` is accessible
   - Try clearing browser cache

3. **Database issues**:
   - Ensure Neon database is active
   - Verify connection string includes `?sslmode=require`
   - Check that `db:push` ran successfully in build logs

4. **Social sharing not working**:
   - Verify URLs are correctly formatted
   - Test with different browsers
   - Check that HTTPS is enabled (required for native sharing)

### Getting Help
1. Check deployment logs in your platform dashboard
2. Test locally first: `npm run dev`
3. Verify environment variables match `.env.example`
4. Check database migrations completed successfully

### Free Hosting Recommendations
- **Best for full-stack**: Vercel (easier setup for this app type)
- **Alternative**: Netlify (requires more configuration for backend)
- **Database**: Neon.tech (generous free tier for PostgreSQL)

The application includes comprehensive social media integration and should work perfectly on free hosting platforms!