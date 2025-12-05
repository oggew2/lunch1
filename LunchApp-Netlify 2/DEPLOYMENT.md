# Ericsson Lunch Menu App - Deployment Guide

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3 (for web server)

### Installation

1. **Install dependencies:**
```bash
cd LunchApp
npm install
npx playwright install chromium
```

2. **Start the scraper service** (Terminal 1):
```bash
node scraper-service.js
```
This runs on http://localhost:3001

3. **Start the web server** (Terminal 2):
```bash
cd src
python3 -m http.server 8000
```
This runs on http://localhost:8000

4. **Open the app:**
Open http://localhost:8000 in your browser

## What You'll See

- ✅ **The Courtyard**: Real menu with CO2 labels
- ✅ **Food & Co Time Building**: Real menu (English only)
- ✅ **Food & Co Kista**: Real menu (English only)

## How It Works

1. **Web Server (port 8000)**: Serves the HTML/CSS/JS files
2. **Scraper Service (port 3001)**: Uses Playwright to render React pages and extract menus
3. **Browser**: Fetches data through the scraper service

## Troubleshooting

### "Clear Cache & Reload" button
If menus look wrong, click this button to fetch fresh data.

### Scraper service fails
- Make sure Playwright is installed: `npx playwright install chromium`
- Check logs for errors
- Restart the service

### CORS errors
- Make sure the scraper service is running on port 3001
- Check that both servers are running

## Production Deployment

For production, you need:
1. Deploy the scraper service to a server (Node.js hosting)
2. Deploy the static files to any web host (Netlify, Vercel, GitHub Pages)
3. Update the SCRAPER_SERVICE URL in `src/js/fetchers/base.js` to point to your deployed scraper

## Notes

- Menus are cached for 4 hours
- The Courtyard uses a simple CORS proxy (allorigins.win)
- Food & Co requires the Playwright scraper service
- All menu data is fetched in real-time from restaurant websites
