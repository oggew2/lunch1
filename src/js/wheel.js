const restaurants = [
    { id: 'kista', name: 'Food & Co Kista', color: '#FF6B6B', votes: 1, enabled: true },
    { id: 'courtyard', name: 'The Courtyard', color: '#4ECDC4', votes: 1, enabled: true },
    { id: 'timebuilding', name: 'Food & Co Time Building', color: '#45B7D1', votes: 1, enabled: true }
];

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const resultDiv = document.getElementById('result');

let isSpinning = false;
let currentRotation = 0;

function getEnabledRestaurants() {
    return restaurants.filter(r => r.enabled);
}

function drawWheel() {
    const enabled = getEnabledRestaurants();
    if (enabled.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#333';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Select at least one restaurant!', canvas.width / 2, canvas.height / 2);
        return;
    }

    const totalVotes = enabled.reduce((sum, r) => sum + r.votes, 0);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);

    let startAngle = 0;
    enabled.forEach(restaurant => {
        const sliceAngle = (restaurant.votes / totalVotes) * Math.PI * 2;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = restaurant.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(restaurant.name, radius * 0.6, 5);
        ctx.font = '14px Arial';
        ctx.fillText(`${Math.round((restaurant.votes / totalVotes) * 100)}%`, radius * 0.6, 25);
        ctx.restore();

        startAngle += sliceAngle;
    });

    ctx.restore();

    // Draw pointer
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 10, centerY);
    ctx.lineTo(centerX + radius - 20, centerY - 15);
    ctx.lineTo(centerX + radius - 20, centerY + 15);
    ctx.closePath();
    ctx.fill();
}

function spinWheel() {
    if (isSpinning) return;
    
    const enabled = getEnabledRestaurants();
    if (enabled.length === 0) return;

    isSpinning = true;
    spinBtn.disabled = true;
    resultDiv.textContent = '';

    const totalVotes = enabled.reduce((sum, r) => sum + r.votes, 0);
    const random = Math.random();
    let cumulative = 0;
    let winner = enabled[0];

    for (const restaurant of enabled) {
        cumulative += restaurant.votes / totalVotes;
        if (random <= cumulative) {
            winner = restaurant;
            break;
        }
    }

    // Calculate target rotation
    const spins = 5 + Math.random() * 3;
    const winnerIndex = enabled.indexOf(winner);
    const sliceAngle = (winner.votes / totalVotes) * Math.PI * 2;
    const winnerAngle = enabled.slice(0, winnerIndex).reduce((sum, r) => 
        sum + (r.votes / totalVotes) * Math.PI * 2, 0) + sliceAngle / 2;
    
    const targetRotation = currentRotation + (spins * Math.PI * 2) - winnerAngle + Math.PI / 2;
    const duration = 4000;
    const startTime = Date.now();
    const startRotation = currentRotation;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            resultDiv.textContent = `🎉 ${winner.name}!`;
            resultDiv.style.color = winner.color;
        }
    }

    animate();
}

function updateVotes() {
    document.querySelectorAll('.restaurant-option').forEach(option => {
        const id = option.dataset.id;
        const restaurant = restaurants.find(r => r.id === id);
        const checkbox = option.querySelector('input[type="checkbox"]');
        const voteCount = option.querySelector('.vote-count');
        const minusBtn = option.querySelector('[data-action="minus"]');
        
        restaurant.enabled = checkbox.checked;
        voteCount.textContent = restaurant.votes;
        minusBtn.disabled = restaurant.votes <= 1;
    });
    drawWheel();
}

// Event listeners
document.querySelectorAll('.restaurant-option').forEach(option => {
    const id = option.dataset.id;
    const restaurant = restaurants.find(r => r.id === id);
    
    option.querySelector('input[type="checkbox"]').addEventListener('change', updateVotes);
    
    option.querySelectorAll('.vote-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.action === 'plus') {
                restaurant.votes++;
            } else if (btn.dataset.action === 'minus' && restaurant.votes > 1) {
                restaurant.votes--;
            }
            updateVotes();
        });
    });
});

spinBtn.addEventListener('click', spinWheel);

// Initial draw
drawWheel();
