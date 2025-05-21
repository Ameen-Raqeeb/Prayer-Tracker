// DOM Elements
const prayerCheckboxes = [
    document.getElementById('fajr-check'),
    document.getElementById('dhuhr-check'),
    document.getElementById('asr-check'),
    document.getElementById('maghrib-check'),
    document.getElementById('isha-check')
];
const resetButton = document.getElementById('reset-btn');
const editButton = document.getElementById('editName');
const celebration = document.getElementById('celebration');
const closeCelebration = document.querySelector('.close-celebration');
const nameInput = document.getElementById('userName');
const saveNameButton = document.getElementById('saveName');
const editNameButton = document.getElementById('editName');
const greeting = document.getElementById('greeting');
const streakMessage = document.getElementById('prayerStreak');
const personalizationSection = document.getElementById('personalization');
const mainContent = document.getElementById('mainContent');
const userGreeting = document.getElementById('userGreeting');

// Local Storage Keys
const PRAYER_STATE_KEY = 'prayerState';
const USER_NAME_KEY = 'userName';
const PRAYER_STREAK_KEY = 'prayerStreak';
const LAST_RESET_DATE_KEY = 'lastResetDate';

// Initialize prayer state
let prayerState = {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false
};

function showMainContent(name) {
    personalizationSection.style.display = 'none';
    mainContent.style.display = 'block';
    updateGreeting(name);
}

// Load saved state
function loadState() {
    const savedState = localStorage.getItem(PRAYER_STATE_KEY);
    if (savedState) {
        prayerState = JSON.parse(savedState);
        updateCheckboxes();
    }
    
    const savedName = localStorage.getItem(USER_NAME_KEY);
    if (savedName) {
        nameInput.value = savedName;
        showMainContent(savedName);
    }
    updatePrayerStreak();
}

// Save state
function saveState() {
    localStorage.setItem(PRAYER_STATE_KEY, JSON.stringify(prayerState));
    updatePrayerStreak();
    checkAllPrayersCompleted();
}

// Update checkboxes based on state
function updateCheckboxes() {
    const keys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    prayerCheckboxes.forEach((checkbox, idx) => {
        checkbox.checked = prayerState[keys[idx]];
    });
}

// Update greeting based on time of day
function updateGreeting(name) {
    const hour = new Date().getHours();
    let greetingText = '';
    if (hour >= 5 && hour < 12) {
        greetingText = 'Good morning';
    } else if (hour >= 12 && hour < 17) {
        greetingText = 'Good afternoon';
    } else if (hour >= 17 && hour < 21) {
        greetingText = 'Good evening';
    } else {
        greetingText = 'Good night';
    }
    const userName = name || localStorage.getItem(USER_NAME_KEY) || '';
    greeting.textContent = `${greetingText}${userName ? ', ' + userName : ''}`;
    userGreeting.textContent = userName ? `Welcome back, ${userName}!` : '';
}

// Update prayer streak
function updatePrayerStreak() {
    const today = new Date().toDateString();
    const lastResetDate = localStorage.getItem(LAST_RESET_DATE_KEY);
    if (lastResetDate !== today) {
        // Check if all prayers were completed yesterday
        const allCompleted = Object.values(prayerState).every(completed => completed);
        if (allCompleted) {
            const currentStreak = parseInt(localStorage.getItem(PRAYER_STREAK_KEY) || '0');
            localStorage.setItem(PRAYER_STREAK_KEY, currentStreak + 1);
        } else {
            localStorage.setItem(PRAYER_STREAK_KEY, '0');
        }
        localStorage.setItem(LAST_RESET_DATE_KEY, today);
    }
    const streak = localStorage.getItem(PRAYER_STREAK_KEY) || '0';
    streakMessage.textContent = `You've completed ${Object.values(prayerState).filter(Boolean).length} prayers today. Streak: ${streak}`;
}

// Check if all prayers are completed
function checkAllPrayersCompleted() {
    const allCompleted = Object.values(prayerState).every(completed => completed);
    if (allCompleted) {
        celebration.style.display = 'flex';
    }
}

// Event Listeners
const keys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
prayerCheckboxes.forEach((checkbox, idx) => {
    checkbox.addEventListener('change', (e) => {
        prayerState[keys[idx]] = e.target.checked;
        saveState();
    });
});

resetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all prayers?')) {
        prayerState = {
            fajr: false,
            dhuhr: false,
            asr: false,
            maghrib: false,
            isha: false
        };
        saveState();
        updateCheckboxes();
    }
});

editButton.addEventListener('click', () => {
    personalizationSection.style.display = 'flex';
    mainContent.style.display = 'none';
    nameInput.focus();
});

saveNameButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name) {
        localStorage.setItem(USER_NAME_KEY, name);
        showMainContent(name);
    }
});

closeCelebration.addEventListener('click', () => {
    celebration.style.display = 'none';
});

// Initialize
loadState();
updateGreeting();
setInterval(updateGreeting, 60000); // Update greeting every minute 