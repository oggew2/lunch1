// Vercel serverless function with 1-week caching
export default async function handler(req, res) {
    const { restaurant } = req.query;
    
    if (!restaurant) {
        return res.status(400).json({ error: 'Restaurant parameter required' });
    }
    
    const restaurantUrls = {
        kista: 'https://www.compass-group.se/foodco/meny/kista-tele2/',
        courtyard: 'https://www.thecourtyard.se/lunch/',
        timebuilding: 'https://www.compass-group.se/foodco/meny/kista-time/'
    };
    
    const targetUrl = restaurantUrls[restaurant];
    if (!targetUrl) {
        return res.status(400).json({ error: 'Invalid restaurant' });
    }
    
    try {
        // Use Render scraper service (with headless browser)
        const scraperUrl = `https://kista-lunch-scraper.onrender.com?url=${encodeURIComponent(targetUrl)}`;
        const response = await fetch(scraperUrl);
        
        if (!response.ok) {
            throw new Error(`Scraper returned ${response.status}`);
        }
        
        const data = await response.json();
        
        // Cache for 1 week at Vercel edge
        res.setHeader('Cache-Control', 's-maxage=604800, stale-while-revalidate=86400');
        res.setHeader('CDN-Cache-Control', 'max-age=604800');
        
        return res.json(data);
    } catch (error) {
        console.error('Scraper error:', error);
        return res.status(500).json({ error: error.message });
    }
}
