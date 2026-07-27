// weather.test.js

// Mocking the fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
            main: { temp: 25, humidity: 60 },
            weather: [{ main: 'Clear', description: 'Clear Skies' }],
            name: 'Test City'
        }),
    })
);

// Function to test: fetchForecast
async function fetchForecast(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid='0ab13fdbba1599dda116f576fa9511f6'`);
    if (!response.ok) {
        throw new Error("City not found");
    }
    return await response.json();
}

// Function to test: checkWeatherConditions
async function checkWeatherConditions(settings) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${settings.city}&units=metric&appid='0ab13fdbba1599dda116f576fa9511f6'`);
    const data = await response.json();
    let alertMessages = [];

    if (settings.conditions.includes('temp-high') && data.main.temp > settings.tempHighThreshold) {
        alertMessages.push(`High temperature alert: Current temperature is ${data.main.temp}°C`);
    }
    if (settings.conditions.includes('temp-low') && data.main.temp < settings.tempLowThreshold) {
        alertMessages.push(`Low temperature alert: Current temperature is ${data.main.temp}°C`);
    }
    return alertMessages;
}

// Unit tests
describe('Weather Functions', () => {
    afterEach(() => {
        fetch.mockClear();
    });

    test('fetchForecast returns correct data for a valid city', async () => {
        const data = await fetchForecast('Test City');
        expect(data.name).toBe('Test City');
        expect(data.main.temp).toBe(25);
        expect(data.weather[0].description).toBe('Clear Skies');
    });

    test('fetchForecast throws an error for an invalid city', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));
        await expect(fetchForecast('Invalid City')).rejects.toThrow('City not found');
    });

    test('checkWeatherConditions returns high temperature alert', async () => {
        const settings = {
            city: 'Test City',
            conditions: ['temp-high'],
            tempHighThreshold: 20,
        };
        const alerts = await checkWeatherConditions(settings);
        expect(alerts).toContain('High temperature alert: Current temperature is 25°C');
    });

    test('checkWeatherConditions returns low temperature alert', async () => {
        const settings = {
            city: 'Test City',
            conditions: ['temp-low'],
            tempLowThreshold: 30,
        };
        const alerts = await checkWeatherConditions(settings);
        expect(alerts).toContain('Low temperature alert: Current temperature is 25°C');
    });

    test('checkWeatherConditions returns no alerts for normal conditions', async () => {
        const settings = {
            city: 'Test City',
            conditions: [],
            tempHighThreshold: 30,
            tempLowThreshold: 20,
        };
        const alerts = await checkWeatherConditions(settings);
        expect(alerts).toEqual([]);
    });
});
