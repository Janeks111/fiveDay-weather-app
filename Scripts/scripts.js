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

  // Function to update the DOM with current weather conditions
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

  // Function to update the DOM with future weather conditions
  function updateFutureWeather(data) {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    // group forecast data by date to find the maximum temperature for each day
    const groupedForecast = data.list.reduce((acc, forecast) => {
      const date = forecast.dt_txt.split(" ")[0];
      if (!acc[date] || forecast.main.temp_max > acc[date].main.temp_max) {
        acc[date] = forecast;
      }
      return acc;
    }, {});

    // create a container for the forecast days
    const forecastDaysContainer = document.createElement("div");
    forecastDaysContainer.classList.add("forecast-days-container");

    Object.values(groupedForecast).forEach((forecast) => {
      const date = new Date(forecast.dt_txt);
      const icon = forecast.weather[0].icon;
      const maxTemperature = Math.round(forecast.main.temp_max);
      const humidity = forecast.main.humidity;
      const windSpeed = forecast.wind.speed;

      // create HTML elements for each forecast day
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

  // Function to handle form submission
  async function handleFormSubmit(event) {
    event.preventDefault();

    const searchInput = document.getElementById("search-input");
    const city = searchInput.value;

    // Fetch current weather data for the entered city
    const currentWeatherData = await getWeatherData(city);

    if (currentWeatherData.cod === "404") {
      console.error("City not found");
      return;
    }

    // Fetch 5-day forecast data for the entered city
    const forecastData = await getForecastData(city);

    // Update the DOM with current and future weather conditions
    updateCurrentWeather(currentWeatherData);
    updateFutureWeather(forecastData);

    // Add the city to the search history and save it to local storage
    const historyList = document.getElementById("history");
    historyList.innerHTML += `<div class="history-item" onclick="searchHistoryClick('${city}')">${city}</div>`;
    saveSearchHistory(city);

    // Clear the search input
    searchInput.value = "";
  }

  // Function to handle clicks on search history items
  async function searchHistoryClick(city) {
    const searchInput = document.getElementById("search-input");
    searchInput.value = city;

    // Trigger form submission to fetch and display weather data
    await handleFormSubmit(new Event("submit"));

    // Remove the clicked city from the search history
    const historyList = document.getElementById("history");
    const historyItems = historyList.getElementsByClassName("history-item");

    for (const item of historyItems) {
      if (item.textContent === city) {
        historyList.removeChild(item);
        break; // Stop after removing the first occurrence
      }
    }

    // Save the updated search history to local storage
    const updatedHistory = Array.from(historyItems).map(
      (item) => item.textContent
    );
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  }

  // Event listener for form submission
  const searchForm = document.getElementById("search-form");
  searchForm.addEventListener("submit", handleFormSubmit);

  // Attach event listener to history items
  const historyList = document.getElementById("history");
  historyList.addEventListener("click", function (event) {
    if (event.target.classList.contains("history-item")) {
      const city = event.target.textContent;
      searchHistoryClick(city);
    }
  });

  // Function to save search history to local storage
  function saveSearchHistory(city) {
    // Retrieve existing search history from local storage
    const existingHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Check if the city is already in the search history
    if (!existingHistory.includes(city)) {
      // Add the new city to the search history
      existingHistory.push(city);

      // Save the updated search history to local storage
      localStorage.setItem("searchHistory", JSON.stringify(existingHistory));
    }
  }

  // Function to load search history from local storage
  function loadSearchHistory() {
    const historyList = document.getElementById("history");
    const searchHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Display search history in the DOM
    historyList.innerHTML = searchHistory
      .map(
        (city) =>
          `<div class="history-item" onclick="searchHistoryClick('${city}')">${city}</div>`
      )
      .join("");
  }

  // Load search history when the page is loaded
  loadSearchHistory();
});
