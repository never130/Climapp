/**
 * @license MIT
 * @fileoverview All api related stuff like api_key, api request etc.
 * @copyright RadioCreep95 2024 All rights reserved
 * @author EverLoza <never130@hotmail.com>
 */

'use strict';

const api_key = "243a395bc760a288ccd6093f6270c568";

/**
 * Fetch Data del servidor
 * @param {string} URL API url
 * @param {Function} callback callback 
 */
export const fetchData = function (URL, callback) {
    fetch(`${URL}&appid=${api_key}`)
        .then(res => res.json())
        .then(data => callback(data))
}


export const url = {
    currentWeather(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric&lang=es`;
    },
    forecast(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`;
    },
    airPollution(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`;
    },
    reverseGeo(lat, lon) {
        return `https://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`;
    },
    /**
     * 
     * @param {string} query  
     */
    geo(query) {
        return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;
    }
};
 