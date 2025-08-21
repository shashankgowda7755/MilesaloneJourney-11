# 🌍 Milesalone Travel Blog

A comprehensive travel blog platform for documenting authentic travel experiences across India. Built with React, TypeScript, Express, and PostgreSQL.

## ✨ Features

- 🔐 **Secure Admin Panel** - Full content management system
- 📝 **Blog System** - Create and manage travel stories
- 📸 **Gallery Management** - Photo collections with YouTube integration
- 🗺️ **Interactive Journey Map** - Real-time travel tracking
- 📧 **Newsletter System** - Email subscription management
- 📱 **Mobile Responsive** - Optimized for all devices
- ⚡ **Performance Optimized** - Fast loading and SEO ready

## 🚀 Quick Start

### 1. Database Setup
Choose your database provider:
- **Neon** (Recommended): [Setup Guide](DATABASE_SETUP.md)
- **Supabase**: [Setup Guide](DATABASE_SETUP.md)

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database URL and credentials
```

### 3. Deploy
- **Vercel**: Follow [Vercel Setup Guide](VERCEL_SETUP.md)
- **Manual**: Follow [Deployment Guide](DEPLOYMENT_GUIDE.md)

## 📋 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `SESSION_SECRET` | ✅ | 64-character random string |
| `ADMIN_PASSWORD` | ✅ | Admin panel password |
| `NODE_ENV` | ✅ | `production` for live sites |

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js, Express, Drizzle ORM
- **Database**: PostgreSQL (Neon/Supabase)
- **Deployment**: Vercel, Railway, or any Node.js host

## 📖 Documentation

- [📚 Deployment Guide](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [⚡ Vercel Setup](VERCEL_SETUP.md) - One-click Vercel deployment  
- [🗄️ Database Setup](DATABASE_SETUP.md) - Neon and Supabase configuration
- [🔧 Development Guide](replit.md) - Architecture and development info

## 🛡️ Security

- All content editing requires admin authentication
- No public inline editing capabilities  
- Secure session management
- SSL-only database connections
- Environment-based configuration

## 🎯 Admin Access

After deployment:
1. Go to `/admin` on your site
2. Login with username: `admins` and your `ADMIN_PASSWORD`
3. Start adding your travel content!

## 📞 Support

This application is fully self-contained with comprehensive documentation. Check the guides above for setup and troubleshooting.

---

**Ready to document your travel journey?** Follow the [Deployment Guide](DEPLOYMENT_GUIDE.md) to get started! 🚀