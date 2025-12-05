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
    { id: 'courtyard', name: 'The Courtyard', fetcher: new CourtyardFetcher() },
    { id: 'timebuilding', name: 'Food & Co Time Building', fetcher: new TimeBuildingFetcher() },
    { id: 'kista', name: 'Food & Co Kista', fetcher: new KistaFetcher() }
];

async function fetchMenu(restaurant, useCache = true) {
    console.log(`[${restaurant.id}] Starting fetch...`);
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
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
        console.error(`[${restaurant.id}] Timeout after 20 seconds`);
        setError(restaurant.id, new Error('Request timeout'));
        setLoading(restaurant.id, false);
    }, 20000);
    
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
    console.log('Rendering app...');
    const app = document.getElementById('app');
    const state = getState();
    
    console.log('Current state:', {
        selectedDay: state.selectedDay,
        menusCount: state.menus.size,
        loadingCount: state.loading.size,
        errorsCount: state.errors.size
    });
    
    // Simple direct rendering
    let html = '<div style="padding: 20px; font-family: sans-serif;">';
    html += '<h1 style="color: #0082C8;">Ericsson Lunch Menu</h1>';
    html += `<p>Selected day: <strong>${state.selectedDay}</strong></p>`;
    html += '<button onclick="localStorage.clear(); location.reload();" style="padding: 10px 20px; background: #0082C8; color: white; border: none; border-radius: 4px; cursor: pointer;">Clear Cache & Reload</button>';
    html += '<hr>';
    
    restaurants.forEach(restaurant => {
        html += `<div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">`;
        html += `<h2>${restaurant.name}</h2>`;
        
        const menu = state.menus.get(restaurant.id);
        const isLoading = state.loading.has(restaurant.id);
        const error = state.errors.get(restaurant.id);
        
        console.log(`[${restaurant.id}] menu:`, menu);
        
        if (isLoading) {
            html += '<p>Loading...</p>';
        } else if (error) {
            html += `<p style="color: red;">Error: ${error.message}</p>`;
        } else if (menu && menu.days) {
            const items = menu.days[state.selectedDay] || [];
            console.log(`[${restaurant.id}] items for ${state.selectedDay}:`, items);
            
            if (items.length === 0) {
                html += `<p style="color: orange;">No items for ${state.selectedDay}</p>`;
            } else {
                html += '<ul>';
                items.forEach(item => {
                    html += `<li>${item.name}`;
                    if (item.co2Label) html += ` <span style="color: green;">(${item.co2Label} kg CO₂)</span>`;
                    html += '</li>';
                });
                html += '</ul>';
            }
        } else {
            html += '<p>No menu available</p>';
        }
        
        html += '</div>';
    });
    
    html += '</div>';
    app.innerHTML = html;
    
    console.log('Render complete');
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
