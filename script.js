// Target date: January 23, 2026 at 12:00 AM
// For testing: set to past date to enable button immediately
const targetDate = new Date('2026-01-04T00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const timeRemaining = targetDate - now;

    // Calculate time units
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Update countdown display
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;

    // Check if the birthday has arrived
    if (timeRemaining <= 0) {
        enableBirthdayButton();
    } else {
        disableBirthdayButton();
    }
}

function disableBirthdayButton() {
    const btn = document.getElementById('birthdayBtn');
    const info = document.getElementById('buttonInfo');

    if (btn) {
        btn.setAttribute('disabled', 'disabled');
        btn.style.cursor = 'not-allowed';
        btn.style.opacity = '0.5';
    }

    if (info) {
        info.textContent = '⏳ Waiting for the special day...';
        info.classList.remove('enabled');
    }
}

function enableBirthdayButton() {
    const btn = document.getElementById('birthdayBtn');
    const info = document.getElementById('buttonInfo');

    if (btn) {
        btn.removeAttribute('disabled');
        btn.style.cursor = 'pointer';
        btn.style.opacity = '1';
    }

    if (info) {
        info.textContent = '🎉 The countdown is complete! Click to open your gift! 🎉';
        info.classList.add('enabled');
    }

    // Clear the countdown and show celebration message
    document.getElementById('days').textContent = '0';
    document.getElementById('hours').textContent = '0';
    document.getElementById('minutes').textContent = '0';
    document.getElementById('seconds').textContent = '0';
}

// Prevent navigation when button is disabled
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('birthdayBtn');
    if (btn) {
        btn.addEventListener('click', (e) => {
            if (btn.hasAttribute('disabled')) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    }
});

// Update countdown every second
setInterval(updateCountdown, 1000);

// Initial update
updateCountdown();


