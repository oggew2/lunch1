const chromium = require('@sparticuz/chromium');
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
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(3000);

    const isFoodAndCo = url.includes('compass-group.se');
    
    if (isFoodAndCo) {
      try {
        const buttons = await page.$$('button');
        for (const button of buttons) {
          const text = await page.evaluate(el => el.textContent, button);
          if (text && text.includes('Hela veckan')) {
            await button.click();
            await page.waitForTimeout(3000);
            break;
          }
        }
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
