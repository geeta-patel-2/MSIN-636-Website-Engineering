// Define the function fetchWeather that returns a Promise with the weather info of a given city
function fetchWeather(city) {
    // Return a new Promise that resolves after a 2-second delay
    return new Promise((resolve) => {
        // setTimeout is used to simulate a 2-second delay (as if we were fetching weather data)
        setTimeout(() => {
            // After 2 seconds, resolve the promise with a weather message for the city
            resolve(`Weather in ${city} is 75°F`);
        }, 2000); // The delay is set to 2000 milliseconds (2 seconds)
    });
}

// Start the promise chain for New York
fetchWeather("New York")
    .then(result => {
        // Log the weather for New York after 2 seconds
        console.log(result);

        // After logging the weather for New York, call fetchWeather for Los Angeles
        return fetchWeather("Los Angeles");
    })
    .then(result => {
        // Log the weather for Los Angeles after 2 seconds
        console.log(result);

        // After logging the weather for Los Angeles, call fetchWeather for Chicago
        return fetchWeather("Chicago");
    })
    .then(result => {
        // Log the weather for Chicago after 2 seconds
        console.log(result);

        // Finally, after all cities' weather info is fetched, log a completion message
        console.log("Weather updates completed!");
    })
    .catch((error) => {
        // If there’s any error during any of the promise chains, handle it here
        console.log(error); // Log any errors that might occur
    });
