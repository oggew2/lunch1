const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  let browser = null;
  
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(3000);

    const isFoodAndCo = url.includes('compass-group.se');
    
    if (isFoodAndCo) {
      try {
        await page.click('button:has-text("Hela veckan")');
        await page.waitForTimeout(3000);
      } catch (e) {
        console.log('Could not click Hela veckan');
      }
      
      const allText = await page.evaluate(() => document.body.textContent);
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
