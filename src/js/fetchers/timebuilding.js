// Food & Co Time Building menu fetcher

import { MenuFetcher } from './base.js';
import { ParseError } from '../utils/errors.js';
import { detectFoodCategory } from '../utils/foodCategories.js';

export class TimeBuildingFetcher extends MenuFetcher {
    constructor() {
        super('timebuilding');
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
        
        // Pattern to match any day header
        const dayHeaderPattern = /(Måndag|Tisdag|Onsdag|Torsdag|Fredag|Monday|Tuesday|Wednesday|Thursday|Friday)\s+\d{4}-\d{2}-\d{2}/gi;
        
        const dayPatterns = [
            { key: 'monday', pattern: /Måndag\s+\d{4}-\d{2}-\d{2}|Monday\s+\d{4}-\d{2}-\d{2}/i },
            { key: 'tuesday', pattern: /Tisdag\s+\d{4}-\d{2}-\d{2}|Tuesday\s+\d{4}-\d{2}-\d{2}/i },
            { key: 'wednesday', pattern: /Onsdag\s+\d{4}-\d{2}-\d{2}|Wednesday\s+\d{4}-\d{2}-\d{2}/i },
            { key: 'thursday', pattern: /Torsdag\s+\d{4}-\d{2}-\d{2}|Thursday\s+\d{4}-\d{2}-\d{2}/i },
            { key: 'friday', pattern: /Fredag\s+\d{4}-\d{2}-\d{2}|Friday\s+\d{4}-\d{2}-\d{2}/i }
        ];
        
        // Find all day header positions
        const dayPositions = [];
        let m;
        while ((m = dayHeaderPattern.exec(menuText)) !== null) {
            dayPositions.push(m.index);
        }
        dayPositions.push(menuText.length);
        
        dayPatterns.forEach(({ key, pattern }) => {
            const match = menuText.match(pattern);
            if (match) {
                const startIdx = match.index + match[0].length;
                
                // Find the next day's position to limit section
                const nextDayIdx = dayPositions.find(pos => pos > match.index + 10) || (startIdx + 1500);
                const section = menuText.substring(startIdx, nextDayIdx);
                
                const allLines = section.split('\n')
                    .map(l => l.trim())
                    .filter(l => {
                        return l.length > 15 && 
                               l.length < 200 && 
                               !l.match(/^\d{4}-\d{2}-\d{2}/) && 
                               !l.match(/lunch serveras/i) && 
                               !l.match(/^\d{2}[:.]\d{2}/) &&
                               !l.includes('©') &&
                               !l.includes('http');
                    });
                
                // Deduplicate - prefer English
                const uniqueLines = [];
                
                for (const line of allLines) {
                    const hasSwedish = /[åäö]|(\boch\b)|(\bmed\b)|(\bstekt\b)|(\bgrillad\b)/i.test(line);
                    
                    // Extract significant keywords
                    const keywords = new Set(line.toLowerCase()
                        .split(/\s+/)
                        .filter(w => w.length >= 5 && !/^(with|and|the|med|och|för|till|served)$/.test(w)));
                    
                    // Check if this is a duplicate of existing item
                    const isDuplicate = uniqueLines.some(existing => {
                        const existingKeywords = new Set(existing.toLowerCase()
                            .split(/\s+/)
                            .filter(w => w.length >= 5 && !/^(with|and|the|med|och|för|till|served)$/.test(w)));
                        
                        // Count shared keywords
                        let shared = 0;
                        for (const kw of keywords) {
                            if (existingKeywords.has(kw)) shared++;
                        }
                        
                        // If they share 3+ keywords, consider them duplicates
                        return shared >= 3;
                    });
                    
                    if (!isDuplicate && !hasSwedish) {
                        uniqueLines.push(line);
                    }
                }
                
                days[key] = uniqueLines.slice(0, 4).map(name => ({ 
                    name: name.trim(), 
                    co2Label: null,
                    category: detectFoodCategory(name)
                }));
            }
        });

        return days;
    }
}
