/**
 * @license MIT
 * @fileoverview All module functions
 * @copyright RadioCreep95 2024 All rights reserved
 * @author EverLoza <never130@hotmail.com>
 */

'use strict';

export const weekDayNames = [
    "Dom",
    "Lun",
    "Mar",
    "Mie",
    "Jue",
    "Vie",
    "Sab"
];

export const monthNames = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic"
]


/**
 * 
 * @param {number} dateUnix Unix date en segundos  
 * @param {number} timezone Cambio de zona horaria desde UTC en segundos
 * @returns {string} Date String. formato: "Domingo 10, Ene."
 */
export const getDate = function (dateUnix, timezone) {
    const date = new Date((dateUnix + timezone) * 1000);
    const weekDayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];

    return `${weekDayName} ${date.getUTCDate()},${monthName}`;
}


/**
 * 
 * @param {number} timeUnix Unix date en segundos 
 * @param {number} timezone Cambio de zona horaria desde UTC en segundos
 * @returns {string} Time String. formato: "HH:MM AM/PM"
 */
export const getTime = function (timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    return `${hours % 12 || 12}:${minutes} ${period}`;
}


/**
 * 
 * @param {number} timeUnix Unix date en segundos 
 * @param {number} timezone Cambio de zona horaria desde UTC en segundos
 * @returns {string} Time String. formato: "HH AM/PM"
 */
export const getHours = function (timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const period = hours >= 12 ? "PM" : "AM";

    return `${hours % 12 || 12} ${period}`;
}


/**
 * 
 * @param {number} mps Metros por Segundos 
 * @returns {number} kilometro por horas
 */
export const mps_to_kmh = mps => {
    const mph = mps * 3600;
    return mph / 1000;
}


export const aqiText = {
    1: {
        level: "Buena",
        message: "La calidad del aire se considera satisfactoria y la contaminación del aire representa poco o de ningún riesgo."
    },
    2: {
        level: "Justa",
        message: "La calidad del aire es aceptable; sin embargo, para algunos contaminantes puede haber un problema de salud moderado para un número muy pequeño de personas que son inusualmente sensibles a la contaminación del aire."
    },
    3: {
        level: "Moderada",
        message: "Los miembros de grupos sensibles pueden experimentar efectos sobre la salud. No es probable que el público en general se vea afectado.",
    },
    4: {
        level: "Pobre",
        message: "Todos pueden comenzar a experimentar efectos sobre la salud; Los miembros de grupos sensibles pueden experimentar efectos más graves para la salud.",
    },
    5: {
        level: "Muy Pobre",
        message: "Advertencias sanitarias de condiciones de emergencia. Toda la población tiene más probabilidades de verse afectada.",
    }
}