# DiscoverHealth - Vercel Deployment Guide

## Project Status
✅ **All systems ready for deployment**

### What's been configured:
- ✅ Express.js server running on port 3000
- ✅ All API endpoints working (Auth, Resources, Users, Reviews)
- ✅ Database initialization with better-sqlite3
- ✅ CORS and security headers (Helmet) enabled
- ✅ Swagger API documentation available at `/api-docs`
- ✅ Vercel configuration files added

## Prerequisites
- Node.js 18+ (Vercel standard)
- npm or yarn
- Vercel account (free tier available)

## Local Testing
```bash
npm install
npm start
```
Server runs on `http://localhost:3000`

## Deployment to Vercel

### Option 1: Using Vercel CLI
```bash
npm i -g vercel
vercel login
vercel deploy
```

### Option 2: Using GitHub Integration
1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Vercel auto-detects the configuration from `vercel.json`
5. Click "Deploy"

### Option 3: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Select your Git repository
4. Click "Import"
5. Click "Deploy"

## Post-Deployment

### Environment Variables (if needed)
Add these in Vercel project settings:
- `NODE_ENV=production` (auto-set)
- `PORT=3000` (auto-set)

### Test Your Deployment
After deployment, Vercel will provide a URL like: `https://your-project.vercel.app`

```bash
# Test root endpoint
curl https://your-project.vercel.app/

# Test API
curl https://your-project.vercel.app/resources
curl -X POST https://your-project.vercel.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"pass1"}'
```

## Available Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Resources
- `GET /resources` - Get all healthcare resources
- `GET /resources/:id` - Get resource by ID
- `POST /resources` - Create new resource (admin)
- `PUT /resources/:id` - Update resource (admin)
- `DELETE /resources/:id` - Delete resource (admin)

### Reviews
- `GET /reviews` - Get all reviews
- `GET /reviews/:id` - Get review by ID
- `POST /reviews` - Create new review
- `DELETE /reviews/:id` - Delete review

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID

### API Documentation
- `GET /api-docs` - Swagger UI documentation

## Database
- Uses SQLite (better-sqlite3)
- Automatically initialized on first run
- In production: stored in `/tmp/discoverhealth.db` (Vercel serverless)
- Data persists within a deployment but resets on new deployments

## Troubleshooting

### Port conflicts
Vercel automatically handles port assignment. `PORT` environment variable is respected.

### Database issues
- Vercel uses ephemeral storage - database resets with each deployment
- For persistent database, consider migrating to:
  - PostgreSQL (Vercel Postgres)
  - MongoDB (Vercel Data)
  - PlanetScale MySQL

### CORS issues
CORS is already enabled globally. If you need to restrict origins:
1. Update `cors()` in app.js to: `cors({ origin: 'your-domain.com' })`
2. Redeploy

## Next Steps for Production

1. **Database Migration**: Switch from SQLite to PostgreSQL for data persistence
2. **Environment Variables**: Store sensitive data in .env files (don't commit)
3. **Authentication**: Consider adding JWT tokens for API security
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Logging**: Add structured logging for monitoring
6. **Testing**: Add unit and integration tests

---

**Status**: ✅ Ready for production deployment
**Last Updated**: 2026-05-16
