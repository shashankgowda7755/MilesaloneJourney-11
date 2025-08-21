# Database Setup Guide

## 🗄️ External Database Configuration

This application supports **Neon** and **Supabase** PostgreSQL databases. Choose one:

## Option 1: Neon Database (Recommended)

### Setup Steps:
1. **Create Account**: Go to [Neon Console](https://console.neon.tech/)
2. **Create Project**: Click "Create Project"
   - Choose project name (e.g., "travel-blog")
   - Select region closest to your users
   - Click "Create Project"

3. **Get Connection String**:
   - In project dashboard, click "Connect"
   - Copy the connection string
   - Format: `postgresql://username:password@host:port/database?sslmode=require`

4. **Environment Variable**:
   ```env
   DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
   ```

### Neon Benefits:
- ✅ Generous free tier
- ✅ Serverless (scales to zero)
- ✅ Automatic backups
- ✅ Fast global CDN
- ✅ No connection limits

## Option 2: Supabase Database

### Setup Steps:
1. **Create Account**: Go to [Supabase](https://supabase.com/dashboard)
2. **Create Project**: Click "New Project"
   - Set project name and password
   - Choose region
   - Wait for setup completion

3. **Get Connection String**:
   - Go to Settings → Database
   - Scroll to "Connection String"
   - Select "Transaction pooler" tab
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your actual password

4. **Environment Variable**:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@host:5432/postgres
   ```

### Supabase Benefits:
- ✅ Built-in authentication (not needed for this app)
- ✅ Real-time subscriptions
- ✅ Generous free tier
- ✅ Dashboard for database management

## 🚀 Database Schema Deployment

After setting up your database:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Environment Variables**:
   Create `.env` file with your DATABASE_URL

3. **Deploy Schema**:
   ```bash
   npm run db:push
   ```

This will create all required tables:
- `sessions` - User session storage
- `users` - Admin user data
- `home_page_content` - Homepage content
- `blog_posts` - Travel blog posts
- `destinations` - Travel destinations
- `gallery_collections` - Photo galleries
- `gallery_media` - Gallery images/videos
- `travel_pins` - Map location pins
- `journey_data` - Journey tracking info
- `contact_messages` - Contact form submissions

## 🔄 Database Migration

For schema updates:
```bash
# Apply changes to database
npm run db:push

# Force push (if needed)
npm run db:push --force
```

## 🛠️ Database Management

### Neon Console:
- Access at [Neon Console](https://console.neon.tech/)
- Query editor available
- Monitor usage and performance
- Manage backups

### Supabase Dashboard:
- Access at [Supabase Dashboard](https://supabase.com/dashboard)
- Table editor with GUI
- SQL editor for custom queries
- Real-time database logs

## 📊 Connection Limits

### Neon Free Tier:
- 10 databases per project
- 3 GB storage
- 1 CPU core
- Unlimited queries

### Supabase Free Tier:
- 2 projects
- 500 MB database
- 50 MB file storage
- 5 GB bandwidth

## 🔒 Security Best Practices

1. **SSL Required**: Both providers require SSL connections
2. **IP Restrictions**: Configure if needed in provider settings
3. **Strong Passwords**: Use complex database passwords
4. **Regular Backups**: Both providers offer automatic backups
5. **Environment Variables**: Never commit DATABASE_URL to git

## 🐛 Connection Troubleshooting

### Common Issues:

1. **Connection Refused**:
   - Check DATABASE_URL format
   - Verify database is not sleeping (Neon)
   - Check firewall settings

2. **Authentication Failed**:
   - Verify username/password
   - Check if password contains special characters (URL encode)

3. **SSL/TLS Errors**:
   - Ensure `sslmode=require` in connection string
   - Update to latest database drivers

### Test Connection:
```bash
# Test database connection
node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect()
  .then(() => console.log('✅ Database connected successfully!'))
  .catch(err => console.error('❌ Connection failed:', err))
  .finally(() => client.end());
"
```

## 🌍 Global Performance

### Database Placement:
- **US Users**: Use US East/West regions
- **European Users**: Use EU regions
- **Asian Users**: Use Asia Pacific regions

### Connection Pooling:
Both providers include connection pooling by default, no additional configuration needed.

Your database is now ready for production! 🎉