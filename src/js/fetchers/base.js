// Base MenuFetcher class

import { NetworkError, ParseError } from '../utils/errors.js';

const ALLORIGINS_PROXY = 'https://api.allorigins.win/get?url=';
const SCRAPER_SERVICE = '/.netlify/functions/scrape?url=';
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
                const proxyUrl = this.useScraperService 
                    ? SCRAPER_SERVICE + encodeURIComponent(this.url)
                    : ALLORIGINS_PROXY + encodeURIComponent(this.url);
                    
                const response = await this.fetchWithTimeout(proxyUrl);
                if (!response.ok) throw new NetworkError(`HTTP ${response.status}`);
                const data = await response.json();
                const html = data.contents || data;
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
