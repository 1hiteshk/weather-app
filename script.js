$(document).ready(function () {
  let isCelsius = true; // Track the unit state (Celsius by default)
  let currentCity = ""; // Store the current city name
  let isDarkMode = false; // Track the theme mode (Light mode by default)

  // Fetch user's current location when the page loads
  getUserLocation();

  // Search button click handler
  $("#searchBtn").click(function () {
    handleWeatherSearch();
  });

  // Input field "Enter" keypress handler
  $("#cityInput").keypress(function (event) {
    if (event.which === 13) {
      // 13 is the Enter key code
      handleWeatherSearch();
    }
  });

  // Function to handle weather search logic
  function handleWeatherSearch() {
    const cityName = $("#cityInput").val();
    if (cityName) {
      currentCity = cityName;
      getWeatherDataByCity(cityName);
    } else {
      alert("Please enter a city name.");
    }
  }

  // Toggle button click handler for switching between Celsius and Fahrenheit
  $("#toggleUnit").click(function () {
    isCelsius = !isCelsius;
    updateWeatherUnit();
  });

  // Button click handler for switching between light and dark themes
  $("#themeToggleBtn").click(function () {
    isDarkMode = !isDarkMode;
    $("body").toggleClass("dark-theme light-theme");
    updateThemeButton();
  });

  // Function to update the theme toggle button text
  function updateThemeButton() {
    const buttonText = isDarkMode
      ? "Switch to Light Mode"
      : "Switch to Dark Mode";
    $("#themeToggleBtn").text(buttonText);
    $("#themeToggleBtn").toggleClass("dark light");
  }

  // Function to show the loading state
  function showLoading() {
    $("#loading").show();
    $("#weatherInfo").hide();
  }

  // Function to hide the loading state
  function hideLoading() {
    $("#loading").hide();
    $("#weatherInfo").show();
  }

  // Function to get user's current location
  function getUserLocation() {
    if (navigator.geolocation) {
      showLoading();
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          getWeatherDataByCoordinates(latitude, longitude);
        },
        function () {
          hideLoading();
          alert(
            "Location access denied. Please enter a city name to get the weather information."
          );
        }
      );
    } else {
      alert(
        "Geolocation is not supported by this browser. Please enter a city name to get the weather information."
      );
    }
  }

  // Function to fetch weather data by city name
  function getWeatherDataByCity(city) {
    const apiKey = "4b3ba27ed15621c771a582b9e902e9f6"; // Replace with your API key, and use env variables for api keys
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    showLoading();

    $.ajax({
      url: apiUrl,
      method: "GET",
      success: function (data) {
        displayWeatherData(data);
      },
      error: function () {
        hideLoading();
        alert("Could not retrieve weather data. Please try again.");
      },
    });
  }

  // Function to fetch weather data by coordinates
  function getWeatherDataByCoordinates(latitude, longitude) {
    const apiKey = "4b3ba27ed15621c771a582b9e902e9f6"; // Replace with your API key
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    $.ajax({
      url: apiUrl,
      method: "GET",
      success: function (data) {
        currentCity = data.name;
        displayWeatherData(data);
      },
      error: function () {
        hideLoading();
        alert("Could not retrieve weather data. Please try again.");
      },
    });
  }

  // Function to display the weather data in the UI
  function displayWeatherData(data) {
    console.log(data);
    const temperature = isCelsius
      ? data.main.temp
      : (data.main.temp * 9) / 5 + 32;
    const weatherDescription = data.weather[0].description;
    const condition = data.weather[0].main;
    const humidity = data.main.humidity;
    const windSpeed = isCelsius ? data.wind.speed : data.wind.speed * 2.237; // Convert m/s to mph

    // Determine the background image URL based on the weather condition
    let backgroundImageUrl = "";
    switch (condition) {
      case "Clear":
        backgroundImageUrl = "url(/assets/Clear.jpg)";
        break;
      case "Clouds":
        backgroundImageUrl = "url(/assets/Clouds.svg)";
        break;
      case "Rain":
        backgroundImageUrl = "url(/assets/Rain.jpg)";
        break;
      case "Thunderstorm":
        backgroundImageUrl = "url(/assets/thunderstorm.avif)";
        break;
      case "Snow":
        backgroundImageUrl = "url(/assets/Snow.avif)";
        break;
      default:
        backgroundImageUrl = "url(/assets/sunsetClouds.jpeg)";
    }

    $("#weatherInfo").html(`
           <div style="background-image: ${backgroundImageUrl}; padding-left:7px; text-align: left; background-size: cover; background-position: center;">
            <h2>📍  ${data.name}</h2>
            <p style='font-weight:700'>${temperature.toFixed(
              1
            )}°${isCelsius ? "C" : "F"}</p>
            <p style='font-weight:700'>${weatherDescription}</p>
            <p>Visibility: ${data.visibility}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed.toFixed(
              1
            )} ${isCelsius ? "m/s" : "mph"}</p>
           </div>
        `);

    hideLoading();
  }

  // Function to update the temperature and wind speed based on the current unit
  function updateWeatherUnit() {
    const toggleText = isCelsius ? "Switch to °F" : "Switch to °C";
    $("#toggleUnit").text(toggleText);
    if (currentCity) {
      getWeatherDataByCity(currentCity);
    }
  }
});
