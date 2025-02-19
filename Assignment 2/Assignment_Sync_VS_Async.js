// Function to simulate fetching weather data for a given city.
// It returns a Promise that resolves with a weather message after a delay.
function fetchWeather(city) {
    // Returning a new Promise to handle asynchronous behavior
    return new Promise((resolve, reject) => {
        // Using setTimeout to simulate a delay of 2 seconds (2000 milliseconds)
        setTimeout(() => {
            // After 2 seconds, resolve the promise with a string showing the weather information
            resolve(`Weather in ${city} is 75°F`);
        }, 2000);
    });
}

// Calling the fetchWeather function for 3 different cities in sequence using .then()
// Each .then() handler receives the weather data from the previous promise and calls the next one.

fetchWeather("New York") // Fetching weather data for New York
    .then((weather) => {
        // After the promise resolves for New York, log the weather information to the console
        console.log(weather); // Output: Weather in New York is 75°F

        // Return the next promise for Los Angeles weather to chain the next .then()
        return fetchWeather("Los Angeles");
    })
    .then((weather) => {
        // After the promise resolves for Los Angeles, log the weather information to the console
        console.log(weather); // Output: Weather in Los Angeles is 75°F

        // Return the next promise for Chicago weather to chain the next .then()
        return fetchWeather("Chicago");
    })
    .then((weather) => {
        // After the promise resolves for Chicago, log the weather information to the console
        console.log(weather); // Output: Weather in Chicago is 75°F
    })
    .catch((error) => {
        // If there’s any error during any of the promise chains, handle it here
        console.log(error); // Log any errors that might occur
    });
