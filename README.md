# Kista Lunch Menu

A web application that aggregates and displays daily lunch menus from three restaurants in the Kista area.

## Features

- 📅 View current week's lunch menus
- 🍽️ Compare menus from 3 restaurants side-by-side
- 📱 Responsive design (mobile & desktop)
- 🔄 Manual refresh with loading states
- 💾 7-day cache for weekly menus
- 🌱 Food category badges (Vegetarian, Fish, Meat, Dessert)
- ⚡ Fast loading with backend caching

## Restaurants

1. **Food & Co Kista**
2. **The Courtyard**
3. **Food & Co Time Building**

## Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend:** Node.js + Playwright (for scraping React apps)
- **Hosting:** Vercel (frontend) + Render (scraper backend)

## Architecture

```
User Browser
    ↓
Vercel (Frontend - HTML/CSS/JS)
    ↓
Render (Scraper - Playwright + 7-day cache)
    ↓
Restaurant Websites
```

## Deployment

### Frontend (Vercel)
- Auto-deploys from GitHub
- Serves static HTML/CSS/JS

### Backend (Render)
- Docker container with Playwright
- 7-day cache for weekly menus
- Free tier: 750 hours/month

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
│       ├── fetchers/
│       └── utils/
├── scraper-service.js
├── Dockerfile
└── render.yaml
```

## How It Works

1. **Data Fetching**: Frontend requests menus from Render backend
2. **Scraping**: Playwright loads React apps and clicks "Hela veckan" button
3. **Caching**: Backend caches scraped data for 7 days
4. **Parsing**: Custom parsers extract menu data from HTML
5. **Display**: Horizontal day columns with restaurants stacked vertically

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License
