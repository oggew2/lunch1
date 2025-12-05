// Date selector component

import { getCurrentWeek, getCurrentDay, getWeekDays } from '../utils/date.js';
import { getState } from '../state.js';

export function createDateSelector(onDaySelect) {
    const container = document.createElement('div');
    container.className = 'date-selector';
    
    const weekNumber = getCurrentWeek();
    const currentDay = getCurrentDay();
    const days = getWeekDays();
    
    container.innerHTML = `
        <div class="week-display">Week ${weekNumber}</div>
        <div class="day-tabs">
            ${days.map(day => `
                <button class="day-tab ${day === currentDay ? 'active' : ''}" data-day="${day}">
                    ${day.substring(0, 3)}
                </button>
            `).join('')}
        </div>
    `;
    
    container.querySelectorAll('.day-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.day-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            onDaySelect(btn.dataset.day);
        });
    });
    
    return container;
}
