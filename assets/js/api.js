/**
 * @license MIT
 * @fileoverview All api related stuff like api_key, api request etc.
 * @copyright RadioCreep95 2024 All rights reserved
 * @author EverLoza <never130@hotmail.com>
 */

'use strict';

/**
 * Client fetch wrapper. As this project uses a server-side proxy (Netlify Function)
 * the client should call the proxy endpoints which inject the API key server-side.
 * fetchData ahora solo hace fetch directo a la URL proporcionada (proxy o externa).
 */
export const fetchData = async function (URL, callback) {
    try {
        if (typeof URL !== 'string' || !URL) throw new Error('URL inválida');

        const res = await fetch(URL);

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            const errorPayload = { error: true, status: res.status, message: text };
            console.error('fetchData HTTP error', errorPayload);
            callback(errorPayload);
            return;
        }

        const data = await res.json();
        callback(data);
    } catch (err) {
        console.error('fetchData exception', err);
        callback({ error: true, message: err && err.message });
    }
}


// URLs now point to the Netlify Function proxy endpoints.
export const url = {
    currentWeather(lat, lon) {
        const p1 = (typeof lat === 'string' && lat.includes('=')) ? lat.split('=')[1] : encodeURIComponent(lat);
        const p2 = (typeof lon === 'string' && lon.includes('=')) ? lon.split('=')[1] : encodeURIComponent(lon);
        return `/.netlify/functions/openweather?endpoint=current&lat=${p1}&lon=${p2}`;
    },
    forecast(lat, lon) {
        const p1 = (typeof lat === 'string' && lat.includes('=')) ? lat.split('=')[1] : encodeURIComponent(lat);
        const p2 = (typeof lon === 'string' && lon.includes('=')) ? lon.split('=')[1] : encodeURIComponent(lon);
        return `/.netlify/functions/openweather?endpoint=forecast&lat=${p1}&lon=${p2}`;
    },
    airPollution(lat, lon) {
        const p1 = (typeof lat === 'string' && lat.includes('=')) ? lat.split('=')[1] : encodeURIComponent(lat);
        const p2 = (typeof lon === 'string' && lon.includes('=')) ? lon.split('=')[1] : encodeURIComponent(lon);
        return `/.netlify/functions/openweather?endpoint=air&lat=${p1}&lon=${p2}`;
    },
    reverseGeo(lat, lon) {
        const p1 = (typeof lat === 'string' && lat.includes('=')) ? lat.split('=')[1] : encodeURIComponent(lat);
        const p2 = (typeof lon === 'string' && lon.includes('=')) ? lon.split('=')[1] : encodeURIComponent(lon);
        return `/.netlify/functions/openweather?endpoint=reverse&lat=${p1}&lon=${p2}&limit=5`;
    },
    geo(query) {
        return `/.netlify/functions/openweather?endpoint=geo&q=${encodeURIComponent(query)}`;
    }
};
