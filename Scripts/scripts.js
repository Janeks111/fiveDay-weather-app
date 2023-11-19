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
});
