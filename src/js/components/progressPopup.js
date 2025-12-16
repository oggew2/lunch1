// Progress popup for first-time cache loading

export function showProgressPopup() {
    const popup = document.createElement('div');
    popup.id = 'progress-popup';
    popup.innerHTML = `
        <div class="progress-overlay">
            <div class="progress-card">
                <h3>🎉 You're the first visitor this week!</h3>
                <p>Thanks for being awesome! We're fetching fresh menu data for everyone.</p>
                <div class="progress-steps">
                    <div class="progress-step" id="step-kista">
                        <span class="step-icon">⏳</span>
                        <span class="step-text">Food & Co Kista</span>
                    </div>
                    <div class="progress-step" id="step-courtyard">
                        <span class="step-icon">⏳</span>
                        <span class="step-text">The Courtyard</span>
                    </div>
                    <div class="progress-step" id="step-timebuilding">
                        <span class="step-icon">⏳</span>
                        <span class="step-text">Food & Co Time Building</span>
                    </div>
                </div>
                <p class="progress-joke">💡 Fun fact: You're making lunch faster for hundreds of people today!</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Add CSS
    const style = document.createElement('style');
    style.textContent = `
        .progress-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .progress-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .progress-steps {
            margin: 1.5rem 0;
        }
        .progress-step {
            display: flex;
            align-items: center;
            margin: 0.5rem 0;
            padding: 0.5rem;
            border-radius: 6px;
            background: #f5f5f5;
        }
        .step-icon {
            margin-right: 0.5rem;
            font-size: 1.2em;
        }
        .progress-joke {
            font-style: italic;
            color: #666;
            margin-top: 1rem;
        }
    `;
    document.head.appendChild(style);
}

export function updateProgress(restaurant, status, step) {
    const stepElement = document.getElementById(`step-${restaurant}`);
    if (!stepElement) return;
    
    const icon = stepElement.querySelector('.step-icon');
    const text = stepElement.querySelector('.step-text');
    
    switch (status) {
        case 'starting':
        case 'loading':
            icon.textContent = '🔄';
            text.textContent = `${getRestaurantName(restaurant)}: ${step}`;
            break;
        case 'clicking':
        case 'extracting':
            icon.textContent = '⚡';
            text.textContent = `${getRestaurantName(restaurant)}: ${step}`;
            break;
        case 'complete':
            icon.textContent = '✅';
            text.textContent = `${getRestaurantName(restaurant)}: Complete!`;
            stepElement.style.background = '#e8f5e8';
            break;
        case 'error':
            icon.textContent = '❌';
            text.textContent = `${getRestaurantName(restaurant)}: Error`;
            stepElement.style.background = '#ffe8e8';
            break;
    }
}

export function hideProgressPopup() {
    const popup = document.getElementById('progress-popup');
    if (popup) {
        popup.remove();
    }
}

function getRestaurantName(id) {
    const names = {
        kista: 'Food & Co Kista',
        courtyard: 'The Courtyard',
        timebuilding: 'Food & Co Time Building'
    };
    return names[id] || id;
}
