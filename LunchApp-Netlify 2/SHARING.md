# Sharing Options for Ericsson Lunch Menu App

## Current Setup
The app consists of:
- Static HTML/CSS/JS frontend (runs in browser)
- Node.js scraper service (runs on localhost:3001)

## Easy Sharing Options (No Official App)

### Option 1: GitHub Pages + Cloud Scraper (Recommended)
**Effort:** Medium | **Cost:** Free | **Reliability:** High

**Setup:**
1. Deploy frontend to GitHub Pages (free static hosting)
2. Deploy scraper to a free cloud service:
   - **Render.com** (free tier, 750 hours/month)
   - **Railway.app** (free tier, $5 credit/month)
   - **Fly.io** (free tier, 3 VMs)

**Steps:**
```bash
# 1. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/lunch-menu.git
git push -u origin main

# 2. Enable GitHub Pages (Settings → Pages → Deploy from main/src)

# 3. Deploy scraper to Render.com:
# - Create account at render.com
# - New Web Service → Connect GitHub repo
# - Build: npm install
# - Start: node scraper-service.js
# - Update base.js SCRAPER_SERVICE URL to your Render URL
```

**Share:** Just send the GitHub Pages URL (e.g., `https://username.github.io/lunch-menu/src/`)

---

### Option 2: Netlify (All-in-One)
**Effort:** Low | **Cost:** Free | **Reliability:** High

**Setup:**
1. Create account at netlify.com
2. Drag & drop the `src/` folder
3. Deploy scraper as Netlify Function

**Steps:**
```bash
# 1. Create netlify/functions/scraper.js
# 2. Move scraper logic to serverless function
# 3. Deploy via Netlify CLI or web interface
```

**Share:** Netlify gives you a URL like `https://lunch-menu-abc123.netlify.app`

---

### Option 3: Vercel (Similar to Netlify)
**Effort:** Low | **Cost:** Free | **Reliability:** High

**Setup:**
1. Create account at vercel.com
2. Import GitHub repo or drag & drop
3. Scraper becomes a Vercel Serverless Function

**Share:** Get URL like `https://lunch-menu.vercel.app`

---

### Option 4: Docker + Any Cloud
**Effort:** Medium-High | **Cost:** Free-$5/month | **Reliability:** High

**Setup:**
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001 8000
CMD ["sh", "-c", "node scraper-service.js & python3 -m http.server 8000"]
```

Deploy to:
- **Fly.io** (free tier)
- **Railway.app** (free tier)
- **DigitalOcean App Platform** ($5/month)

**Share:** Get a URL from the cloud provider

---

### Option 5: Progressive Web App (PWA)
**Effort:** Low | **Cost:** Free | **Reliability:** Medium

**Setup:**
1. Add `manifest.json` and service worker
2. Users can "Add to Home Screen" on mobile
3. Works offline with cached data

**Benefits:**
- Feels like a native app
- No app store needed
- Works on iOS and Android

**Steps:**
```json
// manifest.json
{
  "name": "Ericsson Lunch Menu",
  "short_name": "Lunch",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0082C8",
  "theme_color": "#0082C8",
  "icons": [{"src": "icon.png", "sizes": "192x192"}]
}
```

---

### Option 6: QR Code + Local Network
**Effort:** Very Low | **Cost:** Free | **Reliability:** Low (local only)

**Setup:**
1. Run on your computer/Raspberry Pi
2. Generate QR code pointing to your local IP
3. Share QR code with colleagues on same network

**Limitations:**
- Only works on Ericsson network
- Requires your computer to be running

---

## Recommended Approach

**For Easy Sharing:**
```
Frontend: GitHub Pages (free, reliable)
Scraper: Render.com (free, 750 hours/month)
```

**Setup Time:** 30 minutes
**Monthly Cost:** $0
**Maintenance:** Minimal (restart scraper if it sleeps)

**Alternative (Easiest):**
```
All-in-One: Netlify or Vercel
```

**Setup Time:** 15 minutes
**Monthly Cost:** $0
**Maintenance:** None

---

## Security Considerations

1. **No Authentication:** Anyone with the URL can access
2. **Rate Limiting:** Add rate limiting to scraper to prevent abuse
3. **CORS:** Already configured for public access
4. **No User Data:** App doesn't store any personal information

---

## Maintenance

**Weekly:**
- Check if scraper is still running
- Verify menus are loading correctly

**Monthly:**
- Update dependencies: `npm update`
- Check for restaurant website changes

**As Needed:**
- Update parsers if restaurant HTML changes
- Add new restaurants
- Fix category detection

---

## Sharing Instructions for Users

**Option A (Web):**
"Visit https://your-url.com to see this week's lunch menus"

**Option B (PWA):**
"Visit https://your-url.com, tap Share → Add to Home Screen"

**Option C (QR Code):**
"Scan this QR code to access the lunch menu"

---

## Cost Comparison

| Option | Setup | Monthly Cost | Reliability |
|--------|-------|--------------|-------------|
| GitHub Pages + Render | 30 min | $0 | ⭐⭐⭐⭐⭐ |
| Netlify | 15 min | $0 | ⭐⭐⭐⭐⭐ |
| Vercel | 15 min | $0 | ⭐⭐⭐⭐⭐ |
| Fly.io Docker | 45 min | $0 | ⭐⭐⭐⭐ |
| Local + QR | 5 min | $0 | ⭐⭐ |

---

## Next Steps

1. Choose a deployment option
2. Follow the setup steps
3. Test the deployed app
4. Share the URL with colleagues
5. Monitor usage and fix issues as needed
