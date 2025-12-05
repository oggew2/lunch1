# Deploy to Vercel (Recommended - Works Better!)

Vercel has better support for Playwright than Netlify.

## 🚀 Deploy in 3 Minutes

### Step 1: Create Vercel Account
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (easiest)

### Step 2: Deploy
1. Log in to Vercel
2. Click **"Add New..."** → **"Project"**
3. Click **"Import"** next to your GitHub repo
   - OR click **"Deploy"** and drag the `LunchApp` folder

### Step 3: Configure
- Framework Preset: **Other**
- Root Directory: `./` (leave as is)
- Build Command: (leave empty)
- Output Directory: `src`
- Click **"Deploy"**

### Step 4: Wait
- Deployment takes ~2 minutes
- You'll get a URL like: `https://lunch-menu.vercel.app`

### Step 5: Test
- Visit your URL
- Wait 15-20 seconds for first load
- All 3 restaurants should show all 5 days!

## ✅ Why Vercel is Better

- ✅ Better Playwright support
- ✅ Faster cold starts
- ✅ More reliable functions
- ✅ Automatic HTTPS
- ✅ Free forever

## 🔄 Auto-Deploy from GitHub

If you connected GitHub:
1. Push changes to GitHub
2. Vercel auto-deploys
3. Live in 2 minutes

## 📱 Share

Send colleagues: `https://your-app.vercel.app`

## 💰 Cost

**Free Forever:**
- 100 GB bandwidth/month
- 100 hours serverless function time/month
- Unlimited deployments

Your usage: ~3,000 function calls/month = Well within limits!
