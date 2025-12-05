// Header component

import { getState } from '../state.js';

export function createHeader(onRefresh) {
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = `
        <h1>Ericsson Lunch Menu</h1>
        <button class="refresh-btn" id="refreshBtn">
            <span class="refresh-icon">↻</span>
            <span class="refresh-text">Refresh</span>
        </button>
    `;

    const btn = header.querySelector('#refreshBtn');
    btn.addEventListener('click', () => {
        if (!btn.disabled) onRefresh();
    });

    return header;
}

export function updateHeaderLoading(isLoading) {
    const btn = document.getElementById('refreshBtn');
    if (!btn) return;
    
    btn.disabled = isLoading;
    btn.classList.toggle('loading', isLoading);
}
