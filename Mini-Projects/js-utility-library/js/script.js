const usersData = [
    { name: "Alice Johnson", role: "Frontend Engineer" },
    { name: "Bob Smith", role: "Backend Developer" },
    { name: "Charlie Davis", role: "UI/UX Designer" },
    { name: "Diana Prince", role: "Product Manager" },
    { name: "Evan Wright", role: "DevOps Engineer" },
    { name: "Fiona Gallagher", role: "Data Scientist" },
    { name: "George Martin", role: "Technical Writer" },
    { name: "Hannah Abbott", role: "QA Tester" }
];

const searchInput = document.getElementById('search-input');
const spinner = document.getElementById('loading-spinner');
const searchResults = document.getElementById('search-results');

const renderCards = (container, data) => {
    if (data.length === 0) {
        container.innerHTML = '<div class="empty-state">No results found.</div>';
        return;
    }
    container.innerHTML = data.map(item => 
        <div class="card">
            <div class="card-avatar"> + item.name.charAt(0) + </div>
            <div class="card-title"> + item.name + </div>
            <div class="card-subtitle"> + item.role + </div>
        </div>
    ).join('');
};

const mockApiSearch = (query) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const filtered = usersData.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.role.toLowerCase().includes(query.toLowerCase()));
            resolve(filtered);
        }, 800);
    });
};

const debouncedSearch = debounce(async (query) => {
    if (!query.trim()) {
        renderCards(searchResults, usersData.slice(0, 4));
        spinner.classList.add('hidden');
        return;
    }
    const results = await mockApiSearch(query);
    renderCards(searchResults, results);
    spinner.classList.add('hidden');
}, 500);

searchInput.addEventListener('input', (e) => {
    spinner.classList.remove('hidden');
    debouncedSearch(e.target.value);
});

renderCards(searchResults, usersData.slice(0, 4));
const readingProgress = document.getElementById('reading-progress');
const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    readingProgress.style.width = scrollPercent + '%';
};
const throttledScroll = throttle(handleScroll, 100, { leading: true, trailing: true });
window.addEventListener('scroll', throttledScroll);
