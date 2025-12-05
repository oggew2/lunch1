# Deploy to Netlify - Step by Step

## 🚀 Quick Deploy (5 minutes)

### Step 1: Unzip the Package
1. Unzip `LunchApp-Netlify.zip`
2. You'll see a folder called `LunchApp`

### Step 2: Create Netlify Account
1. Go to **https://netlify.com**
2. Click **"Sign up"**
3. Choose **"Email"** or **"GitHub"** (GitHub is easier for updates later)
4. Verify your email

### Step 3: Deploy the App
1. Log in to Netlify
2. You'll see your dashboard
3. Look for the **drag & drop area** that says:
   ```
   "Want to deploy a new site without connecting to Git?
   Drag and drop your site output folder here"
   ```
4. **Drag the entire `LunchApp` folder** onto this area
5. Wait 30-60 seconds while it deploys

### Step 4: Get Your URL
1. Netlify will show: **"Site deploy in progress"**
2. After ~60 seconds: **"Your site is live!"**
3. You'll see a URL like: `https://sparkly-unicorn-abc123.netlify.app`
4. Click the URL to test it

### Step 5: Customize the URL (Optional)
1. Click **"Site settings"**
2. Click **"Change site name"**
3. Enter: `ericsson-lunch` (or any name you want)
4. Your new URL: `https://ericsson-lunch.netlify.app`

### Step 6: Test It
1. Visit your URL
2. Wait 10-15 seconds for menus to load (first time is slower)
3. Check all 3 restaurants show menus
4. Try clicking different days

### Step 7: Share It
Send this to your colleagues:
```
Check out the lunch menu: https://ericsson-lunch.netlify.app
```

---

## ✅ That's It!

The app is now live and accessible from any device.

---

## 📱 Bonus: Add to Phone Home Screen

**iPhone:**
1. Open the URL in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

**Android:**
1. Open the URL in Chrome
2. Tap the menu (3 dots)
3. Tap "Add to Home screen"
4. Tap "Add"

Now it works like a native app!

---

## 🔄 How to Update Later

If you need to update the app:

**Method 1: Drag & Drop Again**
1. Make changes to your local files
2. Go to Netlify → Deploys
3. Drag the updated folder to "Drag and drop"
4. New version deployed in 60 seconds

**Method 2: Connect to GitHub (Automatic)**
1. Push your code to GitHub
2. In Netlify: Site settings → Build & deploy → Link repository
3. Every time you push to GitHub, Netlify auto-deploys

---

## ⚙️ Settings You Might Want

### Enable HTTPS (Already enabled by default)
✅ Your site is automatically served over HTTPS

### Custom Domain (Optional)
If you have a domain like `lunch.ericsson.com`:
1. Site settings → Domain management
2. Add custom domain
3. Follow DNS instructions

### Password Protection (Optional)
To restrict access:
1. Site settings → Access control
2. Enable password protection
3. Set a password
4. Share password with colleagues

---

## 🐛 Troubleshooting

### "Menus not loading"
- Wait 30 seconds and refresh
- Check browser console (F12) for errors
- Try clearing cache: Click "↻ Refresh" button

### "Function invocation failed"
- The scraper might be timing out
- Check: Site → Functions → scrape → View logs
- This usually fixes itself after a few minutes

### "Site not found"
- Make sure you're using the correct URL
- Check Netlify dashboard to see if site is deployed

### Still having issues?
1. Check Netlify deploy logs: Deploys → Click latest deploy → View logs
2. Contact me or Netlify support (they're very helpful)

---

## 💰 Cost

**Free Forever:**
- 100 GB bandwidth/month
- 125,000 function requests/month
- Unlimited sites
- HTTPS included

**Your usage:**
- ~100 users/day = ~3,000 requests/month
- Well within free limits

---

## 📊 Monitor Usage

1. Go to Netlify dashboard
2. Click your site
3. See:
   - Bandwidth used
   - Function invocations
   - Deploy history

---

## 🎉 You're Done!

Your lunch menu app is now live and accessible to everyone.

**Your URL:** `https://your-site-name.netlify.app`

Share it with your colleagues and enjoy! 🍽️
