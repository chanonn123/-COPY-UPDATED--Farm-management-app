import React, { useState, useEffect } from 'react';
import './Weather.css';

const Weather = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [city, setCity] = useState('Kuala Lumpur');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWeather(city);
    }, [city]);

    const fetchWeather = async (city) => {
        try {
            const response = await fetch(`https://api.data.gov.my/weather/forecast?contains=${city}@location__location_name&limit=7`);
            if (!response.ok) {
                throw new Error('City not found or API error');
            }
            const data = await response.json();

            const today = new Date();
            const oneWeekFromNow = new Date(today);
            oneWeekFromNow.setDate(today.getDate() + 7);

            const filteredData = data.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= today && itemDate <= oneWeekFromNow;
            });

            const sortedData = filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

            setWeatherData(sortedData);
            setError('');
        } catch (err) {
            setError(err.message);
            setWeatherData([]);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchWeather(city);
    };

    return (
        <div className="weather-container">
            <h2>Weather Forecast</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button type="submit">Get Weather</button>
            </form>
            {error && <p className="error">{error}</p>}
            {weatherData.length > 0 ? (
                <div className="weather-info">
                    <h3>Forecast for {weatherData[0].location.location_name}</h3>
                    <div className="forecast-table">
                        {weatherData.map((item, index) => (
                            <div key={index} className="forecast-item">
                                <h4>{item.date}</h4>
                                <p>Morning: {item.morning_forecast}</p>
                                <p>Afternoon: {item.afternoon_forecast}</p>
                                <p>Night: {item.night_forecast}</p>
                                <p>Temperature: {item.min_temp}°C - {item.max_temp}°C</p>
                                <p>Summary: {item.summary_forecast}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>No forecast data available.</p>
            )}
        </div>
    );
};

export default Weather;
