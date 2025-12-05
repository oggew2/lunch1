// The Courtyard menu fetcher

import { MenuFetcher } from './base.js';
import { ParseError } from '../utils/errors.js';

export class CourtyardFetcher extends MenuFetcher {
    constructor() {
        super('https://ericssonbynordrest.se/restaurang/the-courtyard/', true);
    }

    parse(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const weekNumber = this.extractWeekNumber(doc);
        const year = new Date().getFullYear();
        const days = this.extractMenuItems(doc);

        return {
            restaurantId: 'courtyard',
            weekNumber,
            year,
            days,
            lastUpdated: new Date()
        };
    }

    extractWeekNumber(doc) {
        const text = doc.body.textContent;
        const match = text.match(/W\.?\s*(\d+)/i);
        if (match) return parseInt(match[1]);
        
        // Fallback to current week
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now - start;
        return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
    }

    extractMenuItems(doc) {
        const days = { monday: [], tuesday: [], wednesday: [], thursday: [], friday: [] };
        const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

        const weekdayItems = doc.querySelectorAll('.weekday-item');
        
        weekdayItems.forEach((item, index) => {
            if (index >= dayKeys.length) return;
            const dayKey = dayKeys[index];
            
            // Use Swedish section
            const section = item.querySelector('.sprak-wrapper-swe');
            if (!section) return;
            
            const ratterDivs = section.querySelectorAll('.ratter');
            const items = [];
            
            ratterDivs.forEach(ratter => {
                const text = ratter.textContent.trim();
                if (!text || text.length < 5) return;
                
                const category = this.detectCategory(text);
                items.push({ name: text, category });
            });
            
            days[dayKey] = items;
        });

        return days;
    }
    
    detectCategory(text) {
        const lower = text.toLowerCase();
        // Check desserts
        if (/glass|pannkak|dessert|crumble/.test(lower)) return '🍰 Dessert';
        // Check vegetarian/vegan first
        if (/vegan|vegetar|veggie|tofu|falafel|quorn|halloumi|haloumi|soja|linser|ärtor|ädelost.*paj/.test(lower)) return '🌱 Vegetarian';
        // Then fish
        if (/fish|salmon|cod|tuna|seafood|shrimp|lax|torsk|sill|räk|fisk|rödspätta|kolja|sej|kapkummel/.test(lower)) return '🐟 Fish';
        // Then meat
        if (/chicken|beef|pork|lamb|meat|kyckling|nöt|fläsk|lamm|kött|bacon|korv|biff|schnitzel/.test(lower)) return '🍖 Meat';
        return null;
    }
}
