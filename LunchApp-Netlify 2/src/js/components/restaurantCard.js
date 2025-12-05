// Restaurant card component

export function createRestaurantCard(restaurant, menu, isLoading, error, onRetry) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    
    if (isLoading) {
        card.innerHTML = `
            <div class="card-header">
                <h3>${restaurant.name}</h3>
            </div>
            <div class="card-body">
                <div class="skeleton"></div>
                <div class="skeleton"></div>
                <div class="skeleton"></div>
            </div>
        `;
        return card;
    }
    
    if (error) {
        card.innerHTML = `
            <div class="card-header">
                <h3>${restaurant.name}</h3>
            </div>
            <div class="card-body error-state">
                <p class="error-message">❌ ${error.message || 'Failed to load menu'}</p>
                <button class="retry-btn">Retry</button>
            </div>
        `;
        card.querySelector('.retry-btn').addEventListener('click', onRetry);
        return card;
    }
    
    if (!menu || !menu.days) {
        card.innerHTML = `
            <div class="card-header">
                <h3>${restaurant.name}</h3>
            </div>
            <div class="card-body">
                <p class="no-data">No menu available</p>
            </div>
        `;
        return card;
    }
    
    const selectedDay = menu.selectedDay || 'monday';
    const items = menu.days[selectedDay] || [];
    
    card.innerHTML = `
        <div class="card-header">
            <h3>${restaurant.name}</h3>
        </div>
        <div class="card-body">
            <ul class="menu-items">
                ${items.map(item => `
                    <li class="menu-item">
                        <span class="item-name">${item.name}</span>
                        ${item.co2Label ? `<span class="co2-label">${item.co2Label} kg CO₂</span>` : ''}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    return card;
}
