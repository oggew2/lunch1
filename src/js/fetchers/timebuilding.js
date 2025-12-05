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
        const menuText = doc.body.textContent;
        
        // Match full date format: "Måndag 2025-12-01" or "Monday 2025-12-01"
        const dayPatterns = [
            { key: 'monday', pattern: /Måndag\s+\d{4}-\d{2}-\d{2}|Monday\s+\d{4}-\d{2}-\d{2}/i },
            { key: 'tuesday', pattern: /Tisdag\s+\d{4}-\d{2}-\d{2}|Tuesday\s+\d{4}-\d{2}-\d{2}/i },
            { key: 'wednesday', pattern: /Onsdag\s+\d{4}-\d{2}-\d{2}|Wednesday\s+\d{4}-\d{2}-\d{2}/i },
            { key: 'thursday', pattern: /Torsdag\s+\d{4}-\d{2}-\d{2}|Thursday\s+\d{4}-\d{2}-\d{2}/i },
            { key: 'friday', pattern: /Fredag\s+\d{4}-\d{2}-\d{2}|Friday\s+\d{4}-\d{2}-\d{2}/i }
        ];
        
        dayPatterns.forEach(({ key, pattern }) => {
            const match = menuText.match(pattern);
            if (match) {
                const startIdx = match.index + match[0].length;
                const section = menuText.substring(startIdx, startIdx + 1500);
                const lines = section.split('\n')
                    .map(l => l.trim())
                    .filter(l => {
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
