# Ericsson Lunch Menu Comparison App

A web application that aggregates and displays daily lunch menus from three restaurants in the Ericsson Kista area.

## Features

- 📅 View current week's lunch menus
- 🍽️ Compare menus from 3 restaurants side-by-side
- 📱 Responsive design (mobile & desktop)
- 🔄 Manual refresh with loading states
- 💾 4-hour cache to reduce redundant requests
- 🌱 CO2 labels for environmental awareness
- ⚡ Fast, client-side only (no backend required)

## Restaurants

1. **The Courtyard** - ✅ Real-time data with CO2 labels
2. **Food & Co Time Building** - ⚠️ Requires manual updates (React SPA)
3. **Food & Co Kista** - ⚠️ Requires manual updates (React SPA)

### Why Food & Co doesn't work automatically

Food & Co websites use React with client-side rendering. The menu content loads via JavaScript after the page loads, so it's not in the initial HTML. To scrape these sites, you need:

1. **Headless browser** (Puppeteer/Playwright) - Complex setup, resource-intensive
2. **Their API** - Not publicly available
3. **Manual entry** - Copy/paste menus weekly

**Current status:** Only The Courtyard fetches real data automatically.

## Technology Stack

- HTML5
- CSS3 (Grid/Flexbox)
- Vanilla JavaScript (ES6+)
- No frameworks or build tools

## Getting Started

### Prerequisites
- Node.js installed (for the proxy server)
- Python 3 (for the web server)

### Running the App

1. **Start the proxy server** (in one terminal):
   ```bash
   cd LunchApp
   node proxy-server.js
   ```
   This will start on http://localhost:3000

2. **Start the web server** (in another terminal):
   ```bash
   cd LunchApp/src
   python3 -m http.server 8000
   ```
   This will start on http://localhost:8000

3. **Open the app** in your browser:
   ```
   http://localhost:8000
   ```

### Why Two Servers?

- **Proxy server (port 3000)**: Bypasses CORS restrictions to fetch restaurant menus
- **Web server (port 8000)**: Serves the HTML/CSS/JS files

Without the proxy server, you'll see CORS errors because restaurant websites don't allow direct cross-origin requests.

### Deployment

#### GitHub Pages

1. Push code to GitHub repository
2. Go to Settings > Pages
3. Select branch and `/src` folder
4. Save and wait for deployment

#### Netlify

1. Connect repository to Netlify
2. Set build directory to `src`
3. Deploy

## Project Structure

```
LunchApp/
├── src/
│   ├── index.html
│   ├── styles/
│   │   ├── main.css
│   │   └── components.css
│   └── js/
│       ├── app.js
│       ├── state.js
│       ├── components/
│       │   ├── header.js
│       │   ├── dateSelector.js
│       │   ├── menuGrid.js
│       │   ├── restaurantCard.js
│       │   └── footer.js
│       ├── fetchers/
│       │   ├── base.js
│       │   ├── courtyard.js
│       │   ├── timebuilding.js
│       │   └── kista.js
│       └── utils/
│           ├── date.js
│           ├── cache.js
│           ├── sanitize.js
│           └── errors.js
└── README.md
```

## How It Works

1. **Data Fetching**: Uses CORS proxy to fetch menu HTML from restaurant websites
2. **Parsing**: Custom parsers extract menu data from each restaurant's HTML structure
3. **Caching**: Menus cached in localStorage for 4 hours
4. **State Management**: Simple observer pattern for reactive UI updates
5. **Rendering**: Components re-render on state changes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Limitations

- Dependent on restaurant websites maintaining stable HTML structure
- CORS proxy required for fetching external content
- Swedish language content only
- Current week only (no historical data)

## Future Enhancements

- Backend proxy service for reliability
- Dietary filters (vegetarian, vegan, etc.)
- Week navigation (previous/next week)
- Dark mode
- Push notifications for menu updates

## License

Copyright (c) 2025 Ericsson

## Contributing

This is an internal Ericsson project. For issues or suggestions, contact the development team.
