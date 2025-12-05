// Playwright scraper service for Food & Co restaurants
const http = require('http');
const { chromium } = require('playwright');

const PORT = 3001;

async function scrapeFoodCo(url) {
    console.log(`Scraping all days from: ${url}`);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);
        
        // Click "Hela veckan" to show all days at once
        try {
            const wholeWeekButton = page.locator('button:has-text("Hela veckan")');
            if (await wholeWeekButton.count() > 0) {
                await wholeWeekButton.first().click();
                await page.waitForTimeout(3000);
                console.log('  ✓ Clicked "Hela veckan"');
            }
        } catch (e) {
            console.log('  Could not click "Hela veckan"');
        }
        
        // Get all text content - should now contain all days
        const allText = await page.textContent('body');
        
        await browser.close();
        
        console.log(`Total: ${allText.length} chars`);
        return allText;
    } catch (error) {
        await browser.close();
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

server.listen(PORT, () => {
    console.log(`\n✓ Playwright scraper running on http://localhost:${PORT}`);
    console.log(`  Usage: http://localhost:${PORT}?url=<target-url>\n`);
});
