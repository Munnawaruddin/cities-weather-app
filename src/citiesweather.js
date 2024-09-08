import React, { useState, useEffect } from 'react';

const API_KEY = '8c672d1276431a1b66a38cd1eeb46eae'; // Replace with your OpenWeatherMap API key
const CITIES_API_URL = `https://public.opendatasoft.com/api/?dataset=geonames-all-cities-with-a-population-1000&rows=10&start=0`;

const CitiesWeather = () => {
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  // Fetch cities from the GeoNames API
  const fetchCities = async () => {
    try {
      const response = await fetch(CITIES_API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch cities data');
      }
      const data = await response.json();
      const citiesList = data.records.map((record) => {
        return {
          name: record.fields.name,
          country: record.fields.country,
          lat: record.fields.coordinates[0],
          lon: record.fields.coordinates[1],
        };
      });
      setCities(citiesList);
    } catch (err) {
      console.error('Error fetching cities data:', err);
      setError('Failed to fetch cities data.');
    }
  };

  // Fetch weather data for a specific city by its coordinates
  const fetchWeatherData = async (lat, lon) => {
    try {
      const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
      const WEATHER_URL = `https://api.openweathermap.org/?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

const fetchWeatherData = async (lat, lon) => {
  const response = await fetch(PROXY_URL + WEATHER_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  return await response.json();
};
;
      return weather;
    } catch (err) {
      console.error('Error fetching weather data:', err);
      return null; // Gracefully handle weather fetch failure
    }
  };

  // Fetch weather for each city
  const fetchWeatherForCities = async () => {
    const weatherPromises = cities.map((city) =>
      fetchWeatherData(city.lat, city.lon)
    );
    const weatherResults = await Promise.allSettled(weatherPromises); // Use Promise.allSettled to handle failed requests
    const successfulWeatherData = weatherResults.map((result) =>
      result.status === 'fulfilled' ? result.value : null
    );
    setWeatherData(successfulWeatherData);
  };

  // Fetch cities on component mount
  useEffect(() => {
    fetchCities().finally(() => setLoading(false)); // Stop loading after cities fetch
  }, []);

  // Fetch weather data once cities are fetched
  useEffect(() => {
    if (cities.length > 0) {
      fetchWeatherForCities();
    }
  }, [cities]);

  // Render logic
  return (
    <div>
      <h1>City Weather Information</h1>
      {loading && <p>Loading cities...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>City</th>
              <th>Country</th>
              <th>Temperature</th>
              <th>Weather</th>
              <th>Humidity</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city, index) => {
              const weather = weatherData[index];
              return (
                <tr key={index}>
                  <td>{city.name}</td>
                  <td>{city.country}</td>
                  {weather ? (
                    <>
                      <td>{weather.main.temp} °C</td>
                      <td>{weather.weather[0].description}</td>
                      <td>{weather.main.humidity}%</td>
                    </>
                  ) : (
                    <td colSpan={3}>Weather data unavailable</td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CitiesWeather;
