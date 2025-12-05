const playwright = require('playwright-aws-lambda');

module.exports = async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  let browser = null;
  
  try {
    browser = await playwright.launchChromium();
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const isFoodAndCo = url.includes('compass-group.se');
    
    if (isFoodAndCo) {
      try {
        const button = page.locator('button:has-text("Hela veckan")');
        if (await button.count() > 0) {
          await button.first().click();
          await page.waitForTimeout(3000);
        }
      } catch (e) {
        console.log('Could not click Hela veckan');
      }
      
      const allText = await page.textContent('body');
      await browser.close();
      
      return res.status(200).json({ contents: allText });
    } else {
      const html = await page.content();
      await browser.close();
      
      return res.status(200).json({ contents: html });
    }
  } catch (error) {
    if (browser) await browser.close();
    console.error('Scraper error:', error);
    return res.status(500).json({ error: error.message });
  }
};
