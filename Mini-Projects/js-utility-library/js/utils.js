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

// Throttle Utility (Pro)
function throttle(fn, limit, options = { leading: true, trailing: true }) {
    let timeoutId = null;
    let lastArgs = null;
    let lastThis = null;
    let lastCallTime = 0;
    const invokeFunc = function(time) {
        const args = lastArgs;
        const thisArg = lastThis;
        lastArgs = lastThis = null;
        lastCallTime = time;
        fn.apply(thisArg, args);
    };
    const throttled = function(...args) {
        const time = Date.now();
        if (!lastCallTime && options.leading === false) lastCallTime = time;
        const remaining = limit - (time - lastCallTime);
        lastArgs = args;
        lastThis = this;
        if (remaining <= 0 || remaining > limit) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            invokeFunc(time);
        } else if (!timeoutId && options.trailing !== false) {
            timeoutId = setTimeout(() => {
                lastCallTime = options.leading === false ? 0 : Date.now();
                timeoutId = null;
                invokeFunc(Date.now());
            }, remaining);
        }
    };
    throttled.cancel = function() {
        clearTimeout(timeoutId);
        lastCallTime = 0;
        timeoutId = lastArgs = lastThis = null;
    };
    return throttled;
}

// Pub-Sub Event Bus (Pro)
const eventBus = {
    events: {},
    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        return () => this.unsubscribe(event, callback);
    },
    unsubscribe(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
        if (this.events[event].length === 0) delete this.events[event];
    },
    once(event, callback) {
        const onceWrapper = (data) => {
            callback(data);
            this.unsubscribe(event, onceWrapper);
        };
        return this.subscribe(event, onceWrapper);
    },
    publish(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
        if (this.events['*'] && event !== '*') {
            this.events['*'].forEach(callback => callback({ event, data }));
        }
    },
    clear(event) {
        if (event) {
            delete this.events[event];
        } else {
            this.events = {};
        }
    }
};
