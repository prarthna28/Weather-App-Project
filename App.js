import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon'; // Luxon library for date and time handling
import './App.css';

// Importing images for different weather conditions
import clearDayImage from './images/day/clear.jpg';
import snowDayImage from './images/day/snow.jpg';
import rainDayImage from './images/day/rain.jpg';
import cloudyDayImage from './images/day/cloudy.jpg';
import mistDayImage from './images/day/mist.jpg';
import hazeDayImage from './images/day/haze.jpg';
import thunderDayImage from './images/day/thunder.jpg';
import clearNightImage from './images/night/clear.jpg';
import snowNightImage from './images/night/snow.jpg';
import mistNightImage from './images/night/mist.jpg';
import rainNightImage from './images/night/rain.jpg';
import cloudyNightImage from './images/night/cloudy.jpg';
import hazeNightImage from './images/night/haze.jpg';
import thunderNightImage from './images/night/thunder.jpg';

library.add(faSearch); // Adding the search icon to the library

function App() {
  // State variables for managing input, weather data, and background image
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState({
    temperature: '',
    condition: '',
    name: 'Bengaluru', // Default city name
    time: '',
    date: '',
    cloud: '',
    humidity: '',
    wind: '',
    iconUrl: '',
  });

  const [backgroundImage, setBackgroundImage] = useState(clearDayImage); // Default background image

  const API_KEY = 'b6a72db29f9ad88158797368735247ab'; // OpenWeatherMap API Key

  // State for storing a list of cities
  const [citiesList, setCitiesList] = useState(['Delhi', 'Mumbai', 'Pune', 'Hyderabad']);

  useEffect(() => {
    // Check if geolocation is available in the browser
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Use a reverse geocoding service to get the city name based on coordinates
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
            .then((response) => response.json())
            .then((data) => {
              // Extract relevant weather data
              const condition = data.weather[0].main;
              const timeZoneOffset = data.timezone;

              // Convert UTC time to local time
              const utcTime = DateTime.now().toUTC();
              const localTime = utcTime.plus({ seconds: timeZoneOffset });

              // Convert UTC date to local date
              const utcDate = new Date(data.dt * 1000);
              const localDate = DateTime.fromJSDate(utcDate, { zone: 'utc' }).setZone(localTime.zoneName);

              // Update weatherData state with fetched data
              setWeatherData({
                temperature: `${data.main.temp}°C`,
                condition: condition,
                name: data.name,
                time: localTime.toLocaleString(DateTime.TIME_SIMPLE),
                date: localDate.toLocaleString(DateTime.DATE_SHORT),
                cloud: `${data.clouds.all}%`,
                humidity: `${data.main.humidity}%`,
                wind: `${data.wind.speed}m/s`,
                iconUrl: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
              });

              // Determine whether it's daytime or nighttime
              const dayTime = isDayTime(localTime);

              // Get the appropriate background image based on weather conditions and time
              const background = getBackgroundImage(condition, dayTime);
              setBackgroundImage(background);
            })
            .catch((error) => {
              console.error('Error fetching weather data:', error);
              // Handle errors here
            });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          // Handle errors here
        }
      );
    }
  }, []);

  // Handle form submission when searching for a city
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim() !== '') {
      fetchWeatherData(cityInput);
    }
  };

  // Handle clicking on a city from the list
  const handleCityClick = (city) => {
    setCityInput(city);
  };

  // Function to fetch weather data for a given city
  const fetchWeatherData = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&&appid=${API_KEY}&units=metric`)
      .then((response) => response.json())
      .then((data) => {
        // Extract relevant weather data
        const condition = data.weather[0].main;
        const timeZoneOffset = data.timezone;

        // Convert UTC time to local time
        const utcTime = DateTime.now().toUTC();
        const localTime = utcTime.plus({ seconds: timeZoneOffset });

        // Convert UTC date to local date
        const utcDate = new Date(data.dt * 1000);
        const localDate = DateTime.fromJSDate(utcDate, { zone: 'utc' }).setZone(localTime.zoneName);

        // Update weatherData state with fetched data
        setWeatherData({
          temperature: `${data.main.temp}°C`,
          condition: condition,
          name: data.name,
          time: localTime.toLocaleString(DateTime.TIME_SIMPLE),
          date: localDate.toLocaleString(DateTime.DATE_SHORT),
          cloud: `${data.clouds.all}%`,
          humidity: `${data.main.humidity}%`,
          wind: `${data.wind.speed}m/s`,
          iconUrl: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        });

        // Determine whether it's daytime or nighttime
        const dayTime = isDayTime(localTime);

        // Get the appropriate background image based on weather conditions and time
        const background = getBackgroundImage(condition, dayTime);
        setBackgroundImage(background);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        // Handle errors here
      });
  };

  // Function to determine whether it's daytime or nighttime
  const isDayTime = (localTime) => {
    if (localTime && localTime.isValid) {
      const hours = localTime.hour;
      console.log(hours);
      return hours >= 6 && hours <= 18;
      // Day time is from 6am to 6pm and the rest is considered night time.
    } else {
      console.error('Invalid localTime:', localTime);
      // Handle the error or return a default value here
      return false; // For example, returning false as a default
    }
  };

  // Function to get the background image based on weather conditions and time
  const getBackgroundImage = (condition, isDay) => {
    if (isDay) {
      switch (condition) {
        case 'Clear':
          return `url(${clearDayImage})`;
        case 'Snow':
          return `url(${snowDayImage})`;
        case 'Rain':
          return `url(${rainDayImage})`;
        case 'Clouds':
          return `url(${cloudyDayImage})`;
        case 'Mist':
          return `url(${mistDayImage})`;
        case 'Haze':
          return `url(${hazeDayImage})`;
        case 'Thunderstorm' :
          return `url(${thunderDayImage})`
        default:
          return `url(${clearDayImage})`; // Default to clear image if condition is unknown
      }
    } else {
      console.log('night time');
      switch (condition) {
        case 'Clear':
          return `url(${clearNightImage})`;
        case 'Snow':
          return `url(${snowNightImage})`;
        case 'Rain':
          return `url(${rainNightImage})`;
        case 'Clouds':
          return `url(${cloudyNightImage})`;
        case 'Mist':
          return `url(${mistNightImage})`;
        case 'Haze':
          return `url(${hazeNightImage})`;
        case 'Thunderstorm':
          return `url(${thunderNightImage})`;
        default:
          return `url(${clearNightImage})`; // Default to clear image if condition is unknown
      }
    }
  };

  // Render the UI
  return (
    <div className="weather-app" style={{ backgroundImage: backgroundImage }}>
      <div className="container">
        <h3 className="brand">WeatherWise</h3>
        <div className="weather-data">
          <h1 className="temp">{weatherData.temperature}</h1>
          <div className="city-time">
            <h1 className="name">{weatherData.name}</h1>
            <small>
              <span className="time">{weatherData.time}</span> - <span className="date">{weatherData.date}</span>
            </small>
          </div>
          <div className="weather">
            <img src={weatherData.iconUrl} className="icon" alt="icon" width="40" height="40" />
            <span className="condition">{weatherData.condition}</span>
          </div>
        </div>
      </div>
      <div className="panel">
        <form onSubmit={handleFormSubmit} id="locationInput">
          <input
            type="text"
            className="search"
            placeholder="Search Location..."
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
          />
          <button type="submit" className="submit">
            <FontAwesomeIcon icon="search" />
          </button>
        </form>
        <ul className="cities">
          {citiesList.map((city) => (
            <li key={city} className="city" onClick={() => handleCityClick(city)}>
              {city}
            </li>
          ))}
        </ul>
        <ul className="details">
          <h4>Weather Details</h4>
          <li>
            <span>{weatherData.condition}</span>
            <span className="cloud">{weatherData.cloud}</span>
          </li>
          <li>
            <span>Humidity</span>
            <span className="humidity">{weatherData.humidity}</span>
          </li>
          <li>
            <span>Wind</span>
            <span className="wind">{weatherData.wind}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
