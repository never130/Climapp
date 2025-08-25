/**
 * @license MIT
 * @fileoverview Menage all routes
 * @copyright RadioCreep95 2024 All rights reserved
 * @author EverLoza <never130@hotmail.com>
 */

'use strict';

import { updateWeather, error404 } from "./app.js"
const defaultLocation = "#/weather?lat=-53.7856766&lon=-67.7016369" //Rio grande


const currentLocation = function () {
    if (!window.navigator || !window.navigator.geolocation) {
        window.location.hash = defaultLocation;
        return;
    }

    window.navigator.geolocation.getCurrentPosition(res => {
        const { latitude, longitude } = res.coords;
        updateWeather(`lat=${latitude}`, `lon=${longitude}`)
    }, err => {
        window.location.hash = defaultLocation;
    })
}


/**
 * 
 * @param {string} query Consulta buscada
 */
const searchedLocation = query => {
    if (!query) {
        window.location.hash = defaultLocation;
        return;
    }
    updateWeather(...query.split("&"));
}
//updateWeather("lat=-53.786037", "lon=-67.700224")


const routes = new Map([
    ["/current-location", currentLocation],
    ["/weather", searchedLocation]
]);


const checkHash = function () {
    const requestURL = window.location.hash.slice(1) || '';
    const parts = requestURL.split('?');
    const route = parts[0] || '';
    const query = parts[1] || '';

    const handler = routes.get(route);
    if (typeof handler === 'function') {
        handler(query);
    } else {
        error404();
    }
}


window.addEventListener("hashchange", checkHash);
window.addEventListener("load", function () {
    if (!window.location.hash) {
        window.location.hash = "#/current-location";
    } else {
        checkHash();
    }
});