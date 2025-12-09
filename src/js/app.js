// Main application

import { setState, subscribe, setLoading, setError, updateMenu, getState } from './state.js';
import { getCurrentWeek, getCurrentDay } from './utils/date.js';
import { loadFromCache, saveToCache } from './utils/cache.js';
import { CourtyardFetcher } from './fetchers/courtyard.js';
import { TimeBuildingFetcher } from './fetchers/timebuilding.js';
import { KistaFetcher } from './fetchers/kista.js';
import { createHeader, updateHeaderLoading } from './components/header.js';
import { createDateSelector } from './components/dateSelector.js';
import { createMenuGrid } from './components/menuGrid.js';
import { createFooter, updateFooterTimestamp } from './components/footer.js';

const restaurants = [
    { id: 'kista', name: 'Food & Co Kista', fetcher: new KistaFetcher() },
    { id: 'courtyard', name: 'The Courtyard', fetcher: new CourtyardFetcher() },
    { id: 'timebuilding', name: 'Food & Co Time Building', fetcher: new TimeBuildingFetcher() }
];

async function fetchMenu(restaurant, useCache = true, retryCount = 0) {
    console.log(`[${restaurant.id}] Starting fetch (attempt ${retryCount + 1})...`);
    const cacheKey = `menu_${restaurant.id}_${getCurrentWeek()}_${new Date().getFullYear()}`;
    
    if (useCache) {
        const cached = loadFromCache(cacheKey);
        if (cached) {
            console.log(`[${restaurant.id}] Using cached data`);
            updateMenu(restaurant.id, { ...cached, selectedDay: getState().selectedDay });
            setLoading(restaurant.id, false);
            return;
        }
    }
    
    setLoading(restaurant.id, true);
    setError(restaurant.id, null);
    
    // Increase timeout for slow scrapers
    const timeoutId = setTimeout(() => {
        console.error(`[${restaurant.id}] Timeout after 45 seconds`);
        setError(restaurant.id, new Error('Request timeout'));
        setLoading(restaurant.id, false);
        
        // Auto-retry once after timeout
        if (retryCount === 0) {
            console.log(`[${restaurant.id}] Will retry in 5 seconds...`);
            setTimeout(() => fetchMenu(restaurant, false, retryCount + 1), 5000);
        }
    }, 45000);
    
    try {
        console.log(`[${restaurant.id}] Fetching HTML...`);
        const html = await restaurant.fetcher.fetch();
        console.log(`[${restaurant.id}] Parsing HTML (${html.length} bytes)...`);
        const menu = restaurant.fetcher.parse(html);
        console.log(`[${restaurant.id}] Parsed menu:`, menu);
        menu.selectedDay = getState().selectedDay;
        
        saveToCache(cacheKey, menu);
        updateMenu(restaurant.id, menu);
        console.log(`[${restaurant.id}] ✓ Complete`);
        clearTimeout(timeoutId);
    } catch (error) {
        console.error(`[${restaurant.id}] ✗ Error:`, error);
        setError(restaurant.id, error);
        clearTimeout(timeoutId);
    } finally {
        setLoading(restaurant.id, false);
    }
}

async function fetchAllMenus(useCache = true) {
    updateHeaderLoading(true);
    await Promise.all(restaurants.map(r => fetchMenu(r, useCache)));
    updateHeaderLoading(false);
    updateFooterTimestamp();
}

function render() {
    const app = document.getElementById('app');
    const state = getState();
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    let html = '<div class="app-container">';
    
    html += '<header class="header">';
    html += '<h1>🍽️ Kista Lunch Menu</h1>';
    html += '<div class="header-controls">';
    html += `<div class="week-info">Week ${state.currentWeek}</div>`;
    html += '<a href="wheel.html" class="wheel-btn">🎡 Spin Wheel</a>';
    html += '<button onclick="localStorage.clear(); location.reload();" class="refresh-btn">↻ Refresh</button>';
    html += '</div>';
    html += '</header>';
    
    html += '<div class="days-grid">';
    
    days.forEach((day, i) => {
        html += `<div class="day-column">`;
        html += `<h2 class="day-header">${dayLabels[i]}</h2>`;
        
        restaurants.forEach(restaurant => {
            html += `<div class="restaurant-card">`;
            html += `<h3 class="restaurant-name">${restaurant.name}</h3>`;
            
            const menu = state.menus.get(restaurant.id);
            const isLoading = state.loading.has(restaurant.id);
            const error = state.errors.get(restaurant.id);
            
            if (isLoading) {
                html += '<div class="loading">Loading...</div>';
            } else if (error) {
                html += `<div class="error">❌ Error</div>`;
            } else if (menu && menu.days) {
                const items = menu.days[day] || [];
                if (items.length === 0) {
                    html += '<div class="no-items">No menu</div>';
                } else {
                    html += '<ul class="menu-items">';
                    items.forEach(item => {
                        html += `<li>`;
                        if (item.category) {
                            html += `<span class="category-badge">${item.category}</span>`;
                        }
                        html += `<span class="item-name">${item.name}</span>`;
                        html += `</li>`;
                    });
                    html += '</ul>';
                }
            } else {
                html += '<div class="no-items">No menu</div>';
            }
            
            html += '</div>';
        });
        
        html += '</div>';
    });
    
    html += '</div>';
    
    html += '<footer class="footer">';
    html += `<p>Last updated: ${new Date().toLocaleString('sv-SE')}</p>`;
    html += '</footer>';
    
    html += '</div>';
    app.innerHTML = html;
}

function init() {
    console.log('App initializing...');
    
    // Show initial loading
    const app = document.getElementById('app');
    if (!app) {
        console.error('App element not found!');
        return;
    }
    
    app.innerHTML = `
        <div class="initial-loading">
            <div class="spinner"></div>
            <p>Loading menus...</p>
        </div>
    `;
    
    console.log('Setting initial state...');
    setState({
        currentWeek: getCurrentWeek(),
        currentYear: new Date().getFullYear(),
        selectedDay: getCurrentDay()
    });
    
    // Set initial loading state for all restaurants
    restaurants.forEach(r => setLoading(r.id, true));
    
    console.log('Subscribing to state changes...');
    subscribe(render);
    
    // Delay first render slightly to show loading indicator
    setTimeout(() => {
        console.log('Rendering app...');
        render();
        console.log('Fetching menus...');
        fetchAllMenus();
    }, 100);
}

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    const app = document.getElementById('app');
    if (app && !app.querySelector('.header')) {
        app.innerHTML = `
            <div class="initial-loading">
                <p style="color: var(--error);">❌ Error loading application</p>
                <p style="font-size: 14px; color: var(--text-secondary);">${e.error?.message || 'Unknown error'}</p>
                <button onclick="location.reload()" style="margin-top: 16px; padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">Reload Page</button>
            </div>
        `;
    }
});

console.log('Waiting for DOM to load...');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting init...');
    init();
});
