import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const WeatherDetails = () => {
  const { cityName } = useParams();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const API_KEY = '8c672d1276431a1b66a38cd1eeb46eae'; // Add your API key here

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        setWeather(weatherResponse.data);
        setForecast(forecastResponse.data);
      } catch (error) {
        console.error('Error fetching weather data:', error); // Log the error in the console
      }
    };
  
    fetchWeatherData();
  }, [cityName]);
  

  if (!weather || !forecast) return <div>Loading...</div>;

  return (
    <div>
      <h2>Weather for {cityName}</h2>
      <div>
        <p>Temperature: {weather.main.temp} °C</p>
        <p>Weather: {weather.weather[0].description}</p>
        <p>Humidity: {weather.main.humidity}%</p>
        <p>Wind Speed: {weather.wind.speed} m/s</p>
      </div>
      <h3>5-day Forecast</h3>
      <div>
        {forecast.list.map((forecastItem, index) => (
          <div key={index}>
            <p>{new Date(forecastItem.dt * 1000).toLocaleDateString()}</p>
            <p>Temp: {forecastItem.main.temp} °C</p>
            <p>{forecastItem.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetails;
