import React, { useState, useEffect } from 'react';
import './WeatherCard.css';

const provinces = [
    { name: 'Western', city: 'Colombo' },
    { name: 'Central', city: 'Kandy' },
    { name: 'Southern', city: 'Galle' },
    { name: 'Northern', city: 'Jaffna' },
    { name: 'Eastern', city: 'Trincomalee' },
    { name: 'North Western', city: 'Kurunegala' },
    { name: 'North Central', city: 'Anuradhapura' },
    { name: 'Uva', city: 'Badulla' },
    { name: 'Sabaragamuwa', city: 'Ratnapura' },
];

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const getWeatherIcon = (condition) => {
    if (!condition) return '🌤️';
    const c = condition.toLowerCase();
    if (c.includes('rain')) return '🌧️';
    if (c.includes('thunder')) return '⛈️';
    if (c.includes('cloud')) return '☁️';
    if (c.includes('clear')) return '☀️';
    if (c.includes('mist') || c.includes('fog')) return '🌫️';
    if (c.includes('snow')) return '❄️';
    return '🌤️';
};

const WeatherCard = ({ province }) => {
    const [weather, setWeather] = useState(null);
    const [flipped, setFlipped] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchWeather = async () => {
        if (weather) return;
        setLoading(true);
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${province.city},LK&appid=${API_KEY}&units=metric`
            );
            const data = await res.json();
            setWeather(data);
        } catch (err) {
            console.error('Weather fetch error:', err);
        }
        setLoading(false);
    };

    const handleFlip = () => {
        if (!flipped) fetchWeather();
        setFlipped(!flipped);
    };

    return (
        <div className={`weather-card ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="card-inner">

                {/* FRONT */}
                <div className="card-front">
                    <span className="province-icon">⛅</span>
                    <h4>{province.name}</h4>
                    <p>Province</p>
                    <span className="tap-hint">Tap for weather</span>
                </div>

                {/* BACK */}
                <div className="card-back">
                    {loading ? (
                        <div className="weather-loading">Loading...</div>
                    ) : weather && weather.main ? (
                        <>
              <span className="weather-icon-big">
                {getWeatherIcon(weather.weather[0]?.description)}
              </span>
                            <h4>{province.name}</h4>
                            <p className="weather-city">{province.city}</p>
                            <h2 className="weather-temp">{Math.round(weather.main.temp)}°C</h2>
                            <p className="weather-desc">{weather.weather[0]?.description}</p>
                            <div className="weather-details">
                                <span>💧 {weather.main.humidity}%</span>
                                <span>💨 {Math.round(weather.wind.speed)} m/s</span>
                            </div>
                            <span className="tap-hint">Tap to flip back</span>
                        </>
                    ) : (
                        <p className="weather-error">Could not load weather</p>
                    )}
                </div>

            </div>
        </div>
    );
};

const WeatherSection = () => {
    return (
        <section className="weather-section">
            <div className="section-header light">
                <h2>Weather Forecast by Province</h2>
                <p>Tap a province card to see current weather conditions</p>
            </div>
            <div className="provinces-grid">
                {provinces.map((province, index) => (
                    <WeatherCard key={index} province={province} />
                ))}
            </div>
        </section>
    );
};

export default WeatherSection;