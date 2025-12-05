// Footer component

export function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
        <p>Last updated: <span id="lastUpdated">-</span></p>
    `;
    return footer;
}

export function updateFooterTimestamp() {
    const span = document.getElementById('lastUpdated');
    if (span) {
        const now = new Date();
        span.textContent = now.toLocaleString('sv-SE');
    }
}
