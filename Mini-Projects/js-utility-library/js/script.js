// Hardcoded array of items
const countries = [
    "Argentina", "Australia", "Brazil", "Canada", "China", 
    "France", "Germany", "India", "Italy", "Japan", 
    "Mexico", "Netherlands", "New Zealand", "South Africa", "South Korea", 
    "Spain", "Sweden", "Switzerland", "United Kingdom", "United States"
];

// Elements
const searchInput = document.getElementById('search-input');
const typingIndicator = document.getElementById('typing-indicator');
const searchResults = document.getElementById('search-results');

// 1. Live Search Demo (Debounce & Pub-Sub)
eventBus.subscribe('typing', (isTyping) => {
    if (isTyping) {
        typingIndicator.classList.remove('hidden');
    } else {
        typingIndicator.classList.add('hidden');
    }
});

function performSearch(query) {
    eventBus.publish('typing', false);
    
    if (!query.trim()) {
        searchResults.innerHTML = '';
        return;
    }

    const filtered = countries.filter(country => 
        country.toLowerCase().includes(query.toLowerCase())
    );

    searchResults.innerHTML = filtered.map(country => "<li>" + country + "</li>").join('');
}

const debouncedSearch = debounce((query) => performSearch(query), 500);

searchInput.addEventListener('input', (e) => {
    eventBus.publish('typing', true);
    debouncedSearch(e.target.value);
});
// 2. Scroll Counter Demo (Throttle)
const scrollCounter = document.getElementById('scroll-counter');
let count = 0;

function handleScroll() {
    count++;
    if (scrollCounter) {
        scrollCounter.textContent = count;
    }
}

const throttledScroll = throttle(handleScroll, 300);

window.addEventListener('scroll', throttledScroll);
