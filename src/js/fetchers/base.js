// Base MenuFetcher class

import { NetworkError, ParseError } from '../utils/errors.js';

const SCRAPER_SERVICE = 'https://lunch1-1.onrender.com?url=';
const TIMEOUT = 60000; // Increased for progress tracking

export class MenuFetcher {
    constructor(url) {
        this.url = url;
    }

    async fetch(onProgress = null) {
        console.log(`Fetching: ${this.url}`);
        
        try {
            const scraperUrl = SCRAPER_SERVICE + encodeURIComponent(this.url);
            
            // Start progress tracking if callback provided
            if (onProgress) {
                this.trackProgress(scraperUrl, onProgress);
            }
            
            const response = await this.fetchWithTimeout(scraperUrl);
            if (!response.ok) {
                throw new NetworkError(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            const html = data.contents || data;
            
            console.log(`Fetched ${html.length} bytes`);
            return html;
        } catch (error) {
            console.error(`Fetch failed:`, error.message);
            throw new NetworkError(error.message);
        }
    }

    async trackProgress(scraperUrl, onProgress) {
        const progressUrl = scraperUrl + '&progress=1';
        let attempts = 0;
        const maxAttempts = 60; // 60 seconds max
        
        const checkProgress = async () => {
            try {
                const response = await fetch(progressUrl);
                if (response.ok) {
                    const progress = await response.json();
                    onProgress(progress);
                    
                    if (progress.status !== 'complete' && progress.status !== 'error' && attempts < maxAttempts) {
                        attempts++;
                        setTimeout(checkProgress, 1000); // Check every second
                    }
                }
            } catch (error) {
                // Ignore progress tracking errors
            }
        };
        
        // Start tracking after a short delay
        setTimeout(checkProgress, 2000);
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

    parse(html) {
        throw new ParseError('parse() must be implemented by subclass');
    }
}
