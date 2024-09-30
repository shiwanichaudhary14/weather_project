// Get references to all HTML elements that we need to update
const temperateField = document.querySelector(".weather1");
const cityField = document.querySelector(".weather2 p");
const dateField = document.querySelector(".weather2 span");
const emojiField = document.querySelector(".weather3 img");
const weatherField = document.querySelector(".weather3 span");
const searchField = document.querySelector(".searchField");
const form = document.querySelector("form");

// API key and default location for the weather data
const api_key = '7790d7acab4e2445799fae92eea8eef8';
let target = "Delhi"; // Default location set to "Delhi"

// Event listener for the form submission
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent the form from submitting the traditional way
  target = searchField.value.trim(); // Get the value from the input field

  if (target) {
    fetchData(target); // If a city is entered, fetch weather data for that city
  } else {
    alert("Please enter a valid city name."); // Show an alert if no city is entered
  }
});

// Function to fetch weather data for the specified city
async function fetchData(target) {
  try {
    // Get the latitude and longitude for the city using OpenWeatherMap's Geocoding API
    const geo_url = `https://api.openweathermap.org/geo/1.0/direct?q=${target}&limit=1&appid=${api_key}`;
    const geoResponse = await fetch(geo_url); // Send a request to get location data
    const geoData = await geoResponse.json(); // Convert the response to JSON format

    if (geoData.length === 0) {
      throw new Error("Location not found. Please try again.");
    }

    // Extract latitude and longitude from the geoData response
    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    // Use the latitude and longitude to get the weather information
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    const weatherResponse = await fetch(weather_url); // Send a request to get weather data
    const weatherData = await weatherResponse.json(); // Convert the response to JSON format

    // Extract the required data from the weather response
    const temperature = weatherData.main.temp; // Get the temperature in Celsius
    const description = weatherData.weather[0].description; // Weather condition
    const icon = weatherData.weather[0].icon; // Weather icon
    const cityName = weatherData.name; // Name of the city
    const timestamp = weatherData.dt; // Get the date and time from the response

    // Convert the timestamp to a date object
    const date = new Date(timestamp * 1000); // Multiply by 1000 to convert UNIX time to JavaScript date

    // Get the date and time in a readable format
    const exactDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    const exactTime = date.toLocaleTimeString(); // Get the time in "HH:MM:SS AM/PM" format
    const dayName = getDayFullName(date.getDay()); // Get the name of the day

    // Call the function to update the webpage with new weather data
    updateDom(temperature, cityName, exactDate, exactTime, dayName, icon, description);
  } catch (error) {
    alert(error.message); // Display an alert if there is an error
  }
}

// Function to update the webpage with the fetched data
function updateDom(temperature, city, date, time, day, icon, description) {
  temperateField.innerText = `${temperature} °C`; // Update temperature
  cityField.innerText = city; // Update city name
  dateField.innerText = `${time} - ${day}, ${date}`; // Update date and time
  emojiField.src = `https://openweathermap.org/img/wn/${icon}@2x.png`; // Set the weather icon
  weatherField.innerText = description; // Update the weather description
}

// Function to get the full name of the day (e.g., "Sunday")
function getDayFullName(dayNumber) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayNumber] || "Unknown Day"; // Return the day name based on the number
}

// Fetch weather data for the default location ("Delhi") on page load
fetchData(target);
