function fetchWeather() {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=20.5937&longitude=78.9629&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FCalcutta';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.daily) {
                const maxTemp = data.daily.temperature_2m_max[0];
                const minTemp = data.daily.temperature_2m_min[0];
                document.getElementById('weather').innerText = 
                    `Max Temperature: ${maxTemp}°C, Min Temperature: ${minTemp}°C`;
            } else {
                document.getElementById('weather').innerText = 'Weather data not available.';
            }
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            document.getElementById('weather').innerText = 'Failed to fetch weather data.';
        });
}
