// Food & Co Time Building menu fetcher

import { MenuFetcher } from './base.js';
import { ParseError } from '../utils/errors.js';

export class TimeBuildingFetcher extends MenuFetcher {
    constructor() {
        super('https://www.compass-group.se/restauranger-och-menyer/foodandco/food--co-timebuilding/', true);
    }

    parse(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const weekNumber = this.extractWeekNumber(doc);
        const year = new Date().getFullYear();
        const days = this.extractMenuItems(doc);

        return {
            restaurantId: 'timebuilding',
            weekNumber,
            year,
            days,
            lastUpdated: new Date()
        };
    }

    extractWeekNumber(doc) {
        const text = doc.body.textContent;
        const match = text.match(/vecka\s*(\d+)/i) || text.match(/week\s*(\d+)/i) || text.match(/v\.?\s*(\d+)/i);
        if (match) return parseInt(match[1]);
        
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        return Math.ceil((now - start) / (7 * 24 * 60 * 60 * 1000));
    }

    extractMenuItems(doc) {
        const days = { monday: [], tuesday: [], wednesday: [], thursday: [], friday: [] };
        
        // Try to extract from __NUXT__ state
        const scripts = doc.querySelectorAll('script');
        for (const script of scripts) {
            const content = script.textContent;
            if (content.includes('__NUXT__') || content.includes('lunchMenus')) {
                try {
                    // Extract menu data from state
                    const stateMatch = content.match(/__NUXT__\s*=\s*({.+?});/s);
                    if (stateMatch) {
                        const state = JSON.parse(stateMatch[1]);
                        // Navigate state to find menu data
                        // This is a placeholder - actual path depends on state structure
                        console.log('Found NUXT state');
                    }
                } catch (e) {
                    console.log('Could not parse state:', e.message);
                }
            }
        }
        
        // Fallback to text extraction
        const menuText = doc.body.textContent;
        console.log('Food & Co HTML length:', menuText.length);
        
        const dayPatterns = [
            { key: 'monday', pattern: /måndag|monday/i },
            { key: 'tuesday', pattern: /tisdag|tuesday/i },
            { key: 'wednesday', pattern: /onsdag|wednesday/i },
            { key: 'thursday', pattern: /torsdag|thursday/i },
            { key: 'friday', pattern: /fredag|friday/i }
        ];
        
        dayPatterns.forEach(({ key, pattern }) => {
            const match = menuText.match(pattern);
            if (match) {
                const startIdx = match.index + match[0].length;
                const section = menuText.substring(startIdx, startIdx + 1000);
                const lines = section.split('\n')
                    .map(l => l.trim())
                    .filter(l => {
                        // Filter out Swedish text (contains å, ä, ö)
                        const hasSwedishChars = /[åäö]/i.test(l);
                        return l.length > 15 && 
                               l.length < 200 && 
                               !hasSwedishChars &&
                               !l.match(/^\d{4}-\d{2}-\d{2}/) && 
                               !l.match(/lunch serveras/i) && 
                               !l.match(/^\d{2}[:.]\d{2}/) &&
                               !l.includes('©') &&
                               !l.includes('http');
                    });
                days[key] = lines.slice(0, 3).map(name => ({ name: name.trim(), co2Label: null }));
            }
        });

        return days;
    }
}
