const playwright = require('playwright-aws-lambda');

exports.handler = async (event) => {
  const url = event.queryStringParameters?.url;
  
  if (!url) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Missing url parameter' })
    };
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
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contents: allText })
      };
    } else {
      const html = await page.content();
      await browser.close();
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contents: html })
      };
    }
  } catch (error) {
    if (browser) await browser.close();
    
    console.error('Scraper error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
