document.addEventListener("DOMContentLoaded", function () {
  // Function to fetch weather data from the OpenWeatherMap API
  async function getWeatherData(city) {
    const apiKey = "5a75535fbbb8eec8018ccdbaee6990fd";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching current weather data:", error);
    }
  }

  // Function to fetch 5-day forecast data from the OpenWeatherMap API
  async function getForecastData(city) {
    const apiKey = "5a75535fbbb8eec8018ccdbaee6990fd";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  }
  function updateCurrentWeather(data) {
    const cityName = document.getElementById("city-name");
    const date = document.getElementById("date");
    const icon = document.getElementById("weather-icon");
    const temperature = document.getElementById("temperature");
    const humidity = document.getElementById("humidity");
    const windSpeed = document.getElementById("wind-speed");

    cityName.innerText = data.name;
    date.innerText = new Date().toLocaleDateString();
    icon.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    temperature.innerText = `Temperature: ${Math.round(data.main.temp)}°C`;
    humidity.innerText = `Humidity: ${data.main.humidity}%`;
    windSpeed.innerText = `Wind Speed: ${data.wind.speed} m/s`;
  }
});
