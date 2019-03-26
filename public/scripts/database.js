////////////////// DATABASE //////////////////
// the database receives from the server the following structure
/** class WeatherForecast{
 *  constructor (location, date, forecast, temperature, wind, precipitations) {
 *    this.location= location;
 *    this.date= date,
 *    this.forecast=forecast;
 *    this.temperature= temperature;
 *    this.wind= wind;
 *    this.precipitations= precipitations;
 *  }
 *}
 *  NOTE! the database is implemented with localstorage. This is not ideal as localStorage
 *  is blocking. It would be best to implement it using indexedDB
 */


/**
 * it saves the forecasts for a city in localStorage
 * @param city
 * @param forecastObject
 */
function storeCachedData(city, forecastObject) {
    localStorage.setItem(city, JSON.stringify(forecastObject));
}


/**
 * it retrieves the forecasts data for a city from localStorage
 * @param city
 * @param date
 * @returns {*}
 */
function getCachedData(city, date) {
    const value = localStorage.getItem(city);
    if (value == null)
        return {city: city, date: date}
    else return JSON.parse(value);
}



/**
 * given the server data, it returns the value of the field precipitations
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getPrecipitations(dataR) {
    if (dataR.precipitations == null && dataR.precipitations === undefined)
           return "unavailable";
    return dataR.precipitations
}

/**
 * given the server data, it returns the value of the field wind
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getWind(dataR){
    if (dataR.wind == null && dataR.wind === undefined)
            return "unavailable";
    else return dataR.wind;
}

/**
 * given the server data, it returns the value of the field temperature
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getTemperature(dataR){
    if (dataR.temperature == null && dataR.temperature === undefined)
        return "unavailable";
    else return dataR.temperature;
}
/**
 * given the server data, it returns the value of the field humidity
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getHumidity(dataR){
    if (dataR.humidity == null && dataR.humidity === undefined)
        return "unavailable";
    else return dataR.humidity;
}



/**
 * the server returns the forecast as a n integer. Here we find out the
 * string so to display it to the user
 * @param forecast
 * @returns {string}
 */
function getForecast(forecast) {
    if (forecast == null && forecast === undefined)
        return "unavailable";
    switch (forecast) {
        case CLOUDY:
            return 'Cloudy';
        case CLEAR:
            return 'Clear';
        case RAINY:
            return 'Rainy';
        case OVERCAST:
            return 'Overcast';
        case SNOWY:
            return 'Snowy';
    }
}
