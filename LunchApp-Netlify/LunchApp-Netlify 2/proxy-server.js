// Simple CORS proxy server
const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Get target URL from query parameter
    const queryParams = url.parse(req.url, true).query;
    const targetUrl = queryParams.url;
    
    if (!targetUrl) {
        res.writeHead(400);
        res.end('Missing url parameter');
        return;
    }
    
    console.log(`Proxying request to: ${targetUrl}`);
    
    // Fetch the target URL
    https.get(targetUrl, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, {
            'Content-Type': proxyRes.headers['content-type'] || 'text/html',
            'Access-Control-Allow-Origin': '*'
        });
        proxyRes.pipe(res);
    }).on('error', (err) => {
        console.error('Proxy error:', err.message);
        res.writeHead(500);
        res.end(`Proxy error: ${err.message}`);
    });
});

server.listen(PORT, () => {
    console.log(`\n✓ Proxy server running on http://localhost:${PORT}`);
    console.log(`  Usage: http://localhost:${PORT}?url=<target-url>\n`);
});
