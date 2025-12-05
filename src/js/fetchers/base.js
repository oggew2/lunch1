// Base MenuFetcher class

import { NetworkError, ParseError } from '../utils/errors.js';

const CORS_PROXY = 'https://corsproxy.io/?';
const SCRAPER_SERVICE = 'https://lunch1-1.onrender.com?url=';
const TIMEOUT = 30000;
const MAX_RETRIES = 1;

export class MenuFetcher {
    constructor(url, useScraperService = false) {
        this.url = url;
        this.useScraperService = useScraperService;
    }

    async fetch() {
        console.log(`Fetching: ${this.url}`);
        let lastError;
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                // Try Netlify function first, fallback to CORS proxy
                let proxyUrl;
                let needsJsonParse = true;
                
                if (this.useScraperService && attempt === 0) {
                    proxyUrl = SCRAPER_SERVICE + encodeURIComponent(this.url);
                } else {
                    // Fallback to CORS proxy (returns HTML directly)
                    proxyUrl = CORS_PROXY + encodeURIComponent(this.url);
                    needsJsonParse = false;
                }
                    
                const response = await this.fetchWithTimeout(proxyUrl);
                if (!response.ok) {
                    if (this.useScraperService && attempt === 0) {
                        console.log('Netlify function failed, trying CORS proxy...');
                        continue; // Try again with CORS proxy
                    }
                    throw new NetworkError(`HTTP ${response.status}`);
                }
                
                let html;
                if (needsJsonParse) {
                    const data = await response.json();
                    html = data.contents || data;
                } else {
                    html = await response.text();
                }
                
                console.log(`Fetched ${html.length} bytes`);
                return html;
            } catch (error) {
                console.error(`Fetch attempt ${attempt + 1} failed:`, error.message);
                lastError = error;
                if (attempt < MAX_RETRIES) await this.delay(1000);
            }
        }
        throw new NetworkError(lastError.message);
    }

    async fetchWithTimeout(url) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), TIMEOUT);
        try {
            return await fetch(url, { signal: controller.signal });
        } catch (error) {
            if (error.name === 'AbortError') throw new NetworkError('Request timeout');
            throw new NetworkError(error.message);
        } finally {
            clearTimeout(timeout);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    parse(html) {
        throw new ParseError('parse() must be implemented by subclass');
    }
}
