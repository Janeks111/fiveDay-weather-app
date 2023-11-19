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
  function updateFutureWeather(data) {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    const groupedForecast = data.list.reduce((acc, forecast) => {
      const date = forecast.dt_txt.split(" ")[0];
      if (!acc[date] || forecast.main.temp_max > acc[date].main.temp_max) {
        acc[date] = forecast;
      }
      return acc;
    }, {});

    const forecastDaysContainer = document.createElement("div");
    forecastDaysContainer.classList.add("forecast-days-container");

    Object.values(groupedForecast).forEach((forecast) => {
      const date = new Date(forecast.dt_txt);
      const icon = forecast.weather[0].icon;
      const maxTemperature = Math.round(forecast.main.temp_max);
      const humidity = forecast.main.humidity;
      const windSpeed = forecast.wind.speed;

      const forecastDay = document.createElement("div");
      forecastDay.classList.add("forecast-day");
      forecastDay.innerHTML = `
              <p class="date">${date.toLocaleDateString()}</p>
              <img class="weather-icon" src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon" />
              <p class="temperature">Max Temp: ${maxTemperature}°C</p>
              <p class="humidity">Humidity: ${humidity}%</p>
              <p class="wind-speed">Wind: ${windSpeed} m/s</p>
            `;

      forecastDaysContainer.appendChild(forecastDay);
    });
    forecastContainer.appendChild(forecastDaysContainer);
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    const searchInput = document.getElementById("search-input");
    const city = searchInput.value;

    const currentWeatherData = await getWeatherData(city);

    if (currentWeatherData.cod === "404") {
      console.error("City not found");
      return;
    }

    const forecastData = await getForecastData(city);

    updateCurrentWeather(currentWeatherData);
    updateFutureWeather(forecastData);

    const historyList = document.getElementById("history");
    historyList.innerHTML += `<div class="history-item" onclick="searchHistoryClick('${city}')">${city}</div>`;
    saveSearchHistory(city);

    searchInput.value = "";
  }
  async function searchHistoryClick(city) {
    const searchInput = document.getElementById("search-input");
    searchInput.value = city;

    await handleFormSubmit(new Event("submit"));

    const historyList = document.getElementById("history");
    const historyItems = historyList.getElementsByClassName("history-item");

    for (const item of historyItems) {
      if (item.textContent === city) {
        historyList.removeChild(item);
        break;
      }
    }

    const updatedHistory = Array.from(historyItems).map(
      (item) => item.textContent
    );
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  }
  const searchForm = document.getElementById("search-form");
  searchForm.addEventListener("submit", handleFormSubmit);

  const historyList = document.getElementById("history");
  historyList.addEventListener("click", function (event) {
    if (event.target.classList.contains("history-item")) {
      const city = event.target.textContent;
      searchHistoryClick(city);
    }
  });
});
