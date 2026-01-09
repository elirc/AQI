# Deployment Guide - AirWatch

## Vercel Deployment (Recommended)

### Prerequisites
1. A Vercel account (https://vercel.com/signup)
2. AQICN API token (https://aqicn.org/data-platform/token/)

### Option 1: Deploy via GitHub Integration (Easiest)

1. **Connect GitHub to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select the `elirc/AQI` repository
   - Click "Import"

2. **Configure Environment Variables**
   - In the project settings, go to "Environment Variables"
   - Add: `AQICN_TOKEN` = `your_api_token_here`

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

4. **Done!**
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project directory)
cd airwatch
vercel --prod

# Set environment variable
vercel env add AQICN_TOKEN
```

---

## Project Configuration

### vercel.json (already included)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

### API Routes Structure
The project uses Vercel Serverless Functions:

```
api/
├── feed/
│   └── [city].ts     → GET /api/feed/:city
├── map/
│   └── bounds.ts     → GET /api/map/bounds
├── search.ts         → GET /api/search?keyword=
└── health.ts         → GET /api/health
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AQICN_TOKEN` | Yes | Your AQICN API token |

### Getting an AQICN API Token
1. Go to https://aqicn.org/data-platform/token/
2. Enter your email
3. You'll receive a token via email
4. The free tier allows 1000 requests/day

---

## Alternative Deployment Options

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

Note: For Netlify, you'll need to convert the API routes to Netlify Functions format.

### Railway
1. Connect GitHub repo at https://railway.app
2. Add `AQICN_TOKEN` environment variable
3. Set build command: `npm run build`
4. Set start command: `npm run server`

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "run", "server"]
```

---

## Post-Deployment Checklist

- [ ] Verify `/api/health` returns `{"status":"ok"}`
- [ ] Test city search functionality
- [ ] Verify 3D globe loads with markers
- [ ] Check that favorites persist
- [ ] Test dark/light theme toggle
- [ ] Verify mobile responsiveness

---

## Troubleshooting

### "Failed to fetch data" errors
- Check that `AQICN_TOKEN` is set correctly
- Verify the token is valid at https://aqicn.org/api/

### 3D Globe not loading
- Check browser console for WebGL errors
- Ensure browser supports WebGL 2.0

### Build failures
- Run `npm run build` locally to check for errors
- Ensure all dependencies are in `package.json`

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### SSL
- Vercel provides automatic SSL certificates
- No configuration needed
