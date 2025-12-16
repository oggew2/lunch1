// Playwright scraper service for Food & Co restaurants
const http = require('http');
const { chromium } = require('playwright');

const PORT = process.env.PORT || 3001;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const cache = new Map();
const progressMap = new Map(); // Track scraping progress

async function scrapeFoodCo(url) {
    // Check cache first
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`✓ Cache hit for: ${url}`);
        return cached.data;
    }

    // Set progress tracking
    const progressKey = url;
    progressMap.set(progressKey, { status: 'starting', step: 'Launching browser...' });

    console.log(`Scraping all days from: ${url}`);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        progressMap.set(progressKey, { status: 'loading', step: 'Loading restaurant page...' });
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(3000);
        
        // Check if this is a Food & Co site (needs "Hela veckan" button)
        const isFoodAndCo = url.includes('compass-group.se');
        
        if (isFoodAndCo) {
            progressMap.set(progressKey, { status: 'clicking', step: 'Clicking "Hela veckan" button...' });
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
            
            progressMap.set(progressKey, { status: 'extracting', step: 'Extracting menu data...' });
            // Get all text content for Food & Co
            const allText = await page.textContent('body');
            await browser.close();
            console.log(`Total: ${allText.length} chars`);
            
            // Cache the result
            cache.set(url, { data: allText, timestamp: Date.now() });
            progressMap.set(progressKey, { status: 'complete', step: 'Menu cached successfully!' });
            
            // Clean up progress after 30 seconds
            setTimeout(() => progressMap.delete(progressKey), 30000);
            
            return allText;
        } else {
            progressMap.set(progressKey, { status: 'extracting', step: 'Extracting menu data...' });
            // For other sites (like Courtyard), return HTML
            const html = await page.content();
            await browser.close();
            console.log(`Total: ${html.length} bytes`);
            
            // Cache the result
            cache.set(url, { data: html, timestamp: Date.now() });
            progressMap.set(progressKey, { status: 'complete', step: 'Menu cached successfully!' });
            
            // Clean up progress after 30 seconds
            setTimeout(() => progressMap.delete(progressKey), 30000);
            
            return html;
        }
    } catch (error) {
        await browser.close();
        progressMap.set(progressKey, { status: 'error', step: `Error: ${error.message}` });
        setTimeout(() => progressMap.delete(progressKey), 30000);
        throw error;
    }
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
    const checkProgress = urlParams.searchParams.get('progress');
    
    // Progress endpoint
    if (checkProgress && targetUrl) {
        const progress = progressMap.get(targetUrl) || { status: 'not_started', step: 'Ready to scrape' };
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(progress));
        return;
    }
    
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
    console.log(`  Usage: http://localhost:${PORT}?url=<target-url>`);
    console.log(`  Progress: http://localhost:${PORT}?url=<target-url>&progress=1\n`);
});
