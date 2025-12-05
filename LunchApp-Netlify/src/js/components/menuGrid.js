// Menu grid component

import { createRestaurantCard } from './restaurantCard.js';

export function createMenuGrid(restaurants, state, onRetry) {
    const grid = document.createElement('div');
    grid.className = 'menu-grid';
    
    if (!restaurants || restaurants.length === 0) {
        grid.innerHTML = '<p class="empty-state">No restaurants configured</p>';
        return grid;
    }
    
    restaurants.forEach(restaurant => {
        const menu = state.menus.get(restaurant.id);
        const isLoading = state.loading.has(restaurant.id);
        const error = state.errors.get(restaurant.id);
        
        const card = createRestaurantCard(
            restaurant,
            menu,
            isLoading,
            error,
            () => onRetry(restaurant.id)
        );
        
        grid.appendChild(card);
    });
    
    return grid;
}
