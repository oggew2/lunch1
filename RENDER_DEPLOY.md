# Deploy to Render.com (Best Free Option!)

Render.com has full Playwright support and 750 free hours/month.

## 🚀 Deploy in 5 Minutes

### Step 1: Create Render Account
1. Go to **https://render.com**
2. Click **"Get Started"**
3. Sign up with **GitHub** (easiest)

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub account if prompted
3. Select **"oggew2/lunch1"** repository
4. Click **"Connect"**

### Step 3: Configure Service
- **Name:** `kista-lunch-scraper`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** (leave empty)
- **Runtime:** `Node`
- **Build Command:** `npm install && npx playwright install chromium`
- **Start Command:** `node scraper-service.js`
- **Instance Type:** `Free`

Click **"Create Web Service"**

### Step 4: Wait for Deploy
- First deploy takes 3-5 minutes (installing Playwright)
- You'll get a URL like: `https://kista-lunch-scraper.onrender.com`

### Step 5: Update Frontend
You need to update the scraper URL in your code:

1. In Vercel project settings, add environment variable:
   - Key: `SCRAPER_URL`
   - Value: `https://kista-lunch-scraper.onrender.com`

OR update `base.js` directly:
```javascript
const SCRAPER_SERVICE = 'https://kista-lunch-scraper.onrender.com?url=';
```

### Step 6: Test
Visit your Vercel URL and wait 15-20 seconds. All menus should load!

## ✅ Why Render.com

- ✅ Full Playwright support
- ✅ 750 free hours/month (enough for 24/7)
- ✅ No size limits
- ✅ Reliable
- ✅ Auto-deploys from GitHub

## 💰 Cost

**Free Tier:**
- 750 hours/month
- 512 MB RAM
- Shared CPU
- Auto-sleep after 15 min inactivity (wakes up in 30 seconds)

**Your usage:** ~720 hours/month (24/7) = Within free tier!

## 🔄 Architecture

```
User Browser
    ↓
Vercel (Frontend - HTML/CSS/JS)
    ↓
Render.com (Scraper - Playwright)
    ↓
Restaurant Websites
```

Both services are free forever!
