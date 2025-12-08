// The Courtyard menu fetcher

import { MenuFetcher } from './base.js';
import { ParseError } from '../utils/errors.js';

export class CourtyardFetcher extends MenuFetcher {
    constructor() {
        super('https://ericssonbynordrest.se/restaurang/the-courtyard/', false);
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
        
        // Desserts first (most specific)
        if (/glass|pannkak|pancake|dessert|crumble|pudding|cake|tart|pie.*berry|pie.*fruit/.test(lower)) return '🍰 Dessert';
        
        // Check for EXPLICIT vegan/vegetarian label (overrides everything)
        if (/\bvegan\b|\bvegetar/.test(lower)) return '🌱 Vegetarian';
        
        // Fish - comprehensive list (Swedish + English)
        if (/\bfish\b|salmon|cod|tuna|seafood|shrimp|prawn|paella|saithe|herring|plaice|haddock|halibut|sole|flounder|perch|trout|mackerel|anchov|lax|sej|torsk|kolja|rödspätta|strömming|sill|räk|fisk|kapkummel/.test(lower)) return '🐟 Fish';
        
        // Meat - comprehensive list (Swedish + English)
        if (/beef|pork|lamb|veal|chicken|turkey|duck|bacon|ham|sausage|korv|meatball|köttbull|biff|schnitzel|cabbage roll|kåldolm|pulled pork|fläsk|kalv|oxkött|kyckling|nöt|kött|fajita|gyros|tikka.*chicken|burger.*beef|pannbiff/.test(lower)) return '🍖 Meat';
        
        // Vegetarian ingredients (after checking for meat/fish)
        if (/veggie|tofu|tempeh|falafel|quorn|halloumi|haloumi|chickpea|lentil|bean.*patty|cauliflower|zucchini|eggplant|aubergine|soja|linser|ädelost.*paj|broccoli.*paj|sötpotatis.*feta|patties.*vegetarian/.test(lower)) return '🌱 Vegetarian';
        
        return null;
    }
}
