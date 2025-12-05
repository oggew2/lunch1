const chromium = require('chrome-aws-lambda');

exports.handler = async (event) => {
  const url = event.queryStringParameters.url;
  
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing url parameter' })
    };
  }

  let browser = null;
  
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Check if this is a Food & Co site
    const isFoodAndCo = url.includes('compass-group.se');
    
    if (isFoodAndCo) {
      // Click "Hela veckan" button
      try {
        await page.click('button:has-text("Hela veckan")');
        await page.waitForTimeout(3000);
      } catch (e) {
        console.log('Could not click Hela veckan');
      }
      
      const allText = await page.evaluate(() => document.body.textContent);
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
