// Debounce Utility (Pro)
function debounce(fn, delay, immediate = false) {
    let timeoutId;
    
    const debounced = function (...args) {
        const callNow = immediate && !timeoutId;
        
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            timeoutId = null;
            if (!immediate) fn.apply(this, args);
        }, delay);
        
        if (callNow) fn.apply(this, args);
    };
    
    debounced.cancel = function() {
        clearTimeout(timeoutId);
        timeoutId = null;
    };
    
    return debounced;
}

// Throttle Utility
function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// Pub-Sub Event Bus
const eventBus = {
    events: {},
    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    },
    unsubscribe(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    },
    publish(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }
};
