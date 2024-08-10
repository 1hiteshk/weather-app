//require('dotenv').config(); process.env.MAP_API_KEY
$(document).ready(function() {
    const API_KEY = '4b3ba27ed15621c771a582b9e902e9f6'; // Add your API key here
    let isCelsius = true;
    
    // Function to fetch weather data from the OpenWeatherMap API
    function fetchWeather(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${isCelsius ? 'metric' : 'imperial'}`;
        
        $.ajax({
            url: url,
            type: 'GET',
            success: function(response) {
                updateUI(response);
            },
            error: function() {
                alert('City not found. Please try again.');
            }
        });
    }

    // Update the UI with the fetched weather data
    function updateUI(data) {
        $('#city-name').text(data.name);
        $('#weather-description').text(data.weather[0].description);
        $('#temp-value').text(Math.round(data.main.temp));
        $('#humidity-value').text(data.main.humidity);
        $('#wind-value').text(data.wind.speed);
    }

    // Get user's location and fetch weather for that location
    function fetchWeatherForCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${isCelsius ? 'metric' : 'imperial'}`;

                $.ajax({
                    url: url,
                    type: 'GET',
                    success: function(response) {
                        updateUI(response);
                    },
                    error: function() {
                        alert('Unable to fetch weather data for your location.');
                    }
                });
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    // Event listener for search button
    $('#search-btn').click(function() {
        const city = $('#city-input').val();
        if (city) {
            fetchWeather(city);
        } else {
            alert('Please enter a city name.');
        }
    });

    // Toggle between Celsius and Fahrenheit
    $('#toggle-temp').click(function() {
        isCelsius = !isCelsius;
        const city = $('#city-name').text();
        if (city) {
            fetchWeather(city);
        }
        $('#temp-unit').text(isCelsius ? 'C' : 'F');
    });

    // Toggle between light and dark themes
    $('#toggle-theme').click(function() {
        $('body').toggleClass('dark-theme');
    });

    // Fetch weather for the user's current location on page load
    fetchWeatherForCurrentLocation();
});
