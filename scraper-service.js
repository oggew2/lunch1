// Playwright scraper service for Food & Co restaurants
const http = require('http');
const { chromium } = require('playwright');

const PORT = process.env.PORT || 3001;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const cache = new Map();
const inProgress = new Map(); // Prevent duplicate scrapes

async function scrapeFoodCo(url) {
    // Check cache first
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`✓ Cache hit for: ${url}`);
        return cached.data;
    }

    // Check if already scraping this URL
    if (inProgress.has(url)) {
        console.log(`⏳ Already scraping: ${url}, waiting...`);
        return await inProgress.get(url);
    }

    // Create promise for this scrape
    const scrapePromise = (async () => {
        console.log(`Scraping all days from: ${url}`);
        let browser = null;
        
        try {
            browser = await chromium.launch({ 
                headless: true,
                args: ['--no-sandbox', '--disable-dev-shm-usage'] // Reduce memory usage
            });
            const page = await browser.newPage();
            
            await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
            await page.waitForTimeout(3000);
            
            // Check if this is a Food & Co site (needs "Hela veckan" button)
            const isFoodAndCo = url.includes('compass-group.se');
            
            if (isFoodAndCo) {
                // Click "Hela veckan" to show all days at once
                try {
                    const wholeWeekButton = page.locator('button:has-text("Hela veckan")');
                    if (await wholeWeekButton.count() > 0) {
                        await wholeWeekButton.first().click();
                        await page.waitForTimeout(5000);
                        console.log('  ✓ Clicked "Hela veckan"');
                    }
                } catch (e) {
                    console.log('  Could not click "Hela veckan"');
                }
                
                // Get all text content for Food & Co
                const allText = await page.textContent('body');
                console.log(`Total: ${allText.length} chars`);
                
                // Cache the result
                cache.set(url, { data: allText, timestamp: Date.now() });
                return allText;
            } else {
                // For other sites (like Courtyard), return HTML
                const html = await page.content();
                console.log(`Total: ${html.length} bytes`);
                
                // Cache the result
                cache.set(url, { data: html, timestamp: Date.now() });
                return html;
            }
        } finally {
            // Always close browser to free memory
            if (browser) {
                await browser.close();
            }
            inProgress.delete(url);
        }
    })();

    inProgress.set(url, scrapePromise);
    return await scrapePromise;
}

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const urlParams = new URL(req.url, `http://localhost:${PORT}`);
    const targetUrl = urlParams.searchParams.get('url');
    
    if (!targetUrl) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing url parameter' }));
        return;
    }
    
    try {
        const html = await scrapeFoodCo(targetUrl);
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ contents: html }));
    } catch (error) {
        console.error('Scraping error:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✓ Playwright scraper running on http://0.0.0.0:${PORT}`);
    console.log(`  Cache duration: 7 days`);
    console.log(`  Usage: http://localhost:${PORT}?url=<target-url>\n`);
});
