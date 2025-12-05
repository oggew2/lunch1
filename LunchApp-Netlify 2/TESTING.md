# Testing Instructions

## Why you see a white screen

The app uses ES6 modules which require a web server due to CORS restrictions. Opening `index.html` directly with `file://` protocol won't work.

## How to test locally

### Option 1: Python (Recommended)
```bash
cd LunchApp/src
python3 -m http.server 8000
```
Then open: http://localhost:8000

### Option 2: Node.js (if you have it)
```bash
cd LunchApp/src
npx serve
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `src/index.html`
3. Select "Open with Live Server"

### Option 4: PHP
```bash
cd LunchApp/src
php -S localhost:8000
```

## What to check

1. Open browser console (F12) to see logs
2. Look for "App initializing..." message
3. Check for any error messages
4. You should see loading spinners, then menu cards

## Common Issues

- **White screen**: Not using a web server
- **CORS errors**: Need to use CORS proxy or test with actual deployment
- **Module errors**: Check browser console for details
