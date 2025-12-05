# Netlify Deployment Instructions

## Quick Deploy (5 minutes)

### Step 1: Create Netlify Account
1. Go to https://netlify.com
2. Click "Sign up" (use GitHub, GitLab, or email)
3. Verify your email

### Step 2: Deploy via Drag & Drop
1. Log in to Netlify
2. Click "Add new site" → "Deploy manually"
3. Drag the entire `LunchApp` folder onto the upload area
4. Wait 30-60 seconds for deployment

### Step 3: Get Your URL
- Netlify will give you a URL like: `https://random-name-123.netlify.app`
- You can customize it: Site settings → Change site name → `ericsson-lunch`
- Final URL: `https://ericsson-lunch.netlify.app`

### Step 4: Test
1. Visit your URL
2. Wait 10-15 seconds for menus to load (first load is slower)
3. Check all 3 restaurants show menus

## Alternative: Deploy via GitHub

### Step 1: Push to GitHub
```bash
cd /Users/ewreosk/Kiro/LunchApp
git remote add origin https://github.com/YOUR_USERNAME/lunch-menu.git
git push -u origin main
```

### Step 2: Connect to Netlify
1. In Netlify: "Add new site" → "Import an existing project"
2. Choose GitHub
3. Select your repository
4. Build settings:
   - Build command: (leave empty)
   - Publish directory: `src`
5. Click "Deploy site"

## Troubleshooting

### Menus not loading?
- Check browser console for errors
- Netlify Functions have a 10-second timeout (might need to increase)
- Try refreshing after 30 seconds

### "Function invocation failed"?
- The scraper function might be timing out
- Check Netlify Functions logs: Site → Functions → scrape → View logs

### Still using localhost:3001?
- Make sure you deployed the updated code with `/.netlify/functions/scrape`
- Clear browser cache and hard refresh (Cmd+Shift+R)

## Configuration

### Custom Domain (Optional)
1. Buy a domain (e.g., lunch.ericsson.com)
2. Netlify: Site settings → Domain management → Add custom domain
3. Update DNS records as instructed

### Environment Variables (If needed)
1. Site settings → Environment variables
2. Add any API keys or secrets

## Monitoring

### Check Function Usage
- Netlify free tier: 125,000 function requests/month
- Each menu load = 3 function calls (one per restaurant)
- ~40,000 menu loads per month on free tier

### View Logs
- Site → Functions → scrape → View logs
- Check for errors or timeouts

## Updating the App

### Method 1: Drag & Drop
1. Make changes locally
2. Drag updated folder to Netlify
3. New deployment created automatically

### Method 2: Git Push (if connected to GitHub)
```bash
git add .
git commit -m "Update menus"
git push
```
Netlify auto-deploys on push.

## Cost

**Free Tier Includes:**
- 100 GB bandwidth/month
- 125,000 function requests/month
- Unlimited sites
- HTTPS included
- Custom domain support

**Estimated Usage:**
- ~100 users/day × 3 restaurants × 30 days = ~9,000 requests/month
- Well within free tier limits

## Support

If deployment fails:
1. Check Netlify deploy logs
2. Verify all files are included
3. Check package.json dependencies
4. Contact Netlify support (very responsive)

## Next Steps

After deployment:
1. Share URL with colleagues
2. Add to bookmarks/home screen
3. Monitor usage in Netlify dashboard
4. Update parsers if restaurant websites change
