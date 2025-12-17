// Progress popup for first-time cache loading

let progressInterval = null;
let startTime = null;

export function showProgressPopup() {
    const popup = document.createElement('div');
    popup.id = 'progress-popup';
    popup.innerHTML = `
        <div class="progress-overlay">
            <div class="progress-card">
                <h3>🎉 You're the first visitor this week!</h3>
                <p>Thanks for being awesome! We're fetching fresh menu data for everyone.</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" id="progress-bar"></div>
                </div>
                <p class="progress-text" id="progress-text">Starting...</p>
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
            max-width: 500px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .progress-bar-container {
            width: 100%;
            height: 30px;
            background: #f0f0f0;
            border-radius: 15px;
            overflow: hidden;
            margin: 1.5rem 0;
        }
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #4CAF50, #8BC34A);
            width: 0%;
            transition: width 0.5s ease;
        }
        .progress-text {
            font-weight: bold;
            color: #333;
            margin: 0.5rem 0;
        }
        .progress-joke {
            font-style: italic;
            color: #666;
            margin-top: 1rem;
        }
    `;
    document.head.appendChild(style);
    
    // Start progress simulation
    startTime = Date.now();
    simulateProgress();
}

function simulateProgress() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    if (!progressBar || !progressText) return;
    
    progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const estimatedTotal = 40000; // 40 seconds estimated
        const progress = Math.min((elapsed / estimatedTotal) * 100, 95);
        
        progressBar.style.width = progress + '%';
        
        // Update text based on progress
        if (progress < 20) {
            progressText.textContent = '🔄 Loading restaurant pages...';
        } else if (progress < 50) {
            progressText.textContent = '⚡ Clicking "Hela veckan" buttons...';
        } else if (progress < 80) {
            progressText.textContent = '📋 Extracting menu data...';
        } else {
            progressText.textContent = '✨ Almost done...';
        }
    }, 500);
}

export function completeProgress() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar && progressText) {
        progressBar.style.width = '100%';
        progressText.textContent = '✅ Complete! Loading menus...';
    }
    
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

export function hideProgressPopup() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
    
    const popup = document.getElementById('progress-popup');
    if (popup) {
        popup.remove();
    }
}

// Legacy function for compatibility
export function updateProgress() {
    // No-op, using simulated progress instead
}
