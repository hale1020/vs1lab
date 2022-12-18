import { LocationHelper } from './location-helper.js';
import { MapManager } from './map-manager.js';

// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * A class to help using the HTML5 Geolocation API.
 */
/*class LocationHelper {
    // Location values for latitude and longitude are private properties to protect them from changes.
    #latitude = '';
    #longitude = '';


    get latitude() {
        return this.#latitude;
    }

    get longitude() {
        return this.#longitude;
    }


    static findLocation(callback) {
        const geoLocationApi = navigator.geolocation;

        if (!geoLocationApi) {
            throw new Error("The GeoLocation API is unavailable.");
        }

        // Call to the HTML5 geolocation API.
        // Takes a first callback function as argument that is called in case of success.
        // Second callback is optional for handling errors.
        // These callbacks are given as arrow function expressions.
        geoLocationApi.getCurrentPosition((location) => {
            // Create and initialize LocationHelper object.
            let helper = new LocationHelper();
            helper.#latitude = location.coords.latitude.toFixed(5);
            helper.#longitude = location.coords.longitude.toFixed(5);
            // Pass the locationHelper object to the callback.
            callback(helper);
        }, (error) => {
            alert(error.message)
        });
    }
}


class MapManager {
    #apiKey = '';

    constructor(apiKey) {
        this.#apiKey = apiKey;
    }


    getMapUrl(latitude, longitude, tags = [], zoom = 10) {
        if (this.#apiKey === '') {
            console.log("No API key provided.");
            return "images/mapview.jpg";
        }

        let tagList = `${latitude},${longitude}|marker-start`;
        tagList += tags.reduce((acc, tag) => `${acc}||${tag.latitude},${tag.longitude}|flag-${tag.name}`, "");

        const mapQuestUrl = `https://www.mapquestapi.com/staticmap/v5/map?key=${this.#apiKey}&size=600,400&zoom=${zoom}&center=${latitude},${longitude}&locations=${tagList}`;
        console.log("Generated MapQuest URL:", mapQuestUrl);

        return mapQuestUrl;
    }
}
*/
export function updateLocation() {

    /* Input Field Variables */
    let disc_hidden_long = document.getElementById("discovery_hidden_longitude");

    let disc_hidden_lat = document.getElementById("discovery_hidden_latitude");
    /* Hidden Input Field Variables */
    let tag_long = document.getElementById("long");
    let tag_lat = document.getElementById("lat");
    /* Map View Image Element */
    let image_view = document.getElementById("mapView");

    if (document.getElementById("discovery_hidden_longitude").value === '' || document.getElementById("discovery_hidden_latitude").value === '') {
        LocationHelper.findLocation((helper) => {

            /* Constant lat and long */
            const latitude = helper.latitude;
            const longitude = helper.longitude;

            /* Readonly Input change */
            tag_lat.value = latitude;
            tag_long.value = longitude;

            /* Hidden Input change */
            disc_hidden_lat.value = latitude;
            disc_hidden_long.value = longitude;
        });
    }

    let dataTags = image_view.getAttribute('data-tags');
    let tags = [];
    if(dataTags.length > 0) {
        tags = JSON.parse(dataTags);
    }

    let manager = new MapManager('f64689zc2fhvhu0miIiVlLaUAchTYDWv');

    setTimeout(function () {
        image_view.src = manager.getMapUrl(disc_hidden_lat.value, disc_hidden_long.value, tags, getZoom());
    }, 1000);

    /* Zugriff auf src von <img src=""> mit image_view.src = ... */
    /* Zugriff auf die long und lat für die MAP über disc_hidden_lat.value. Analog beim anderen auch*/
}

document.addEventListener('DOMContentLoaded', () => {
    updateLocation();
});

document.getElementById("zoomSlider_input").addEventListener('change', () => {
    updateLocation();
});

document.getElementById("button_refresh").addEventListener('click', () => {
    updateLocation();
});

function getZoom() {
    let zoomSlider = document.getElementById("zoomSlider_input");
    return zoomSlider.value;
}