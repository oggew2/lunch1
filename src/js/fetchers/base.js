// Base MenuFetcher class

import { NetworkError, ParseError } from '../utils/errors.js';

const VERCEL_API = '/api/menu?restaurant=';
const TIMEOUT = 60000;

export class MenuFetcher {
    constructor(restaurantId) {
        this.restaurantId = restaurantId;
    }

    async fetch() {
        console.log(`Fetching: ${this.restaurantId}`);
        
        try {
            const response = await this.fetchWithTimeout(VERCEL_API + this.restaurantId);
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
