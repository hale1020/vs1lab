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
   function updateLocation(callback) {
 
    let helper = new LocationHelper();

    function callback(helper){
        var longitudeDiscovery = document.getElementById("longitude2");
        var latitudeDiscovery = document.getElementById("latitude2");
        
        var longitudeTagging = document.getElementById("longitude");
        var latitudeTagging = document.getElementById("latitude");

        longitudeDiscovery.setAttribute("value", helper.longitude);
        latitudeDiscovery.setAttribute("value", helper.latitude);

        longitudeTagging.setAttribute("value", helper.longitude);
        latitudeTagging.setAttribute("value", helper.latitude);

        var manager = new MapManager("aIZ7cNFzGEGgftKYfckP0mpZv1gJtSCG");
        var map = document.getElementById("mapView")
        map.setAttribute("src", manager.getMapUrl(helper.latitude, helper.longitude));
    }

    if (document.getElementById("longitude") === "" && document.getElementById("latitude") === "") {
        LocationHelper.findLocation(callback);
    }
    var long = document.getElementById("longitude");
    var lat = document.getElementById("latitude");
    const latV = lat.getAttribute("value");
    const longV = long.getAttribute("value");
    if ((longV === "") || (latV === "")) {
        LocationHelper.findLocation(callback)}
    else{
        var manager = new MapManager("1fuMAYDadogIhChVgO3HQp5oc01EVfDb"); //????
        var map = document.getElementById("mapView");
        let taglist_json = map.getAttribute("data-tags");
        let taglist_obj = JSON.parse(taglist_json);
        map.setAttribute("src", manager.getMapUrl(latV, longV, taglist_obj, 12))
    }
   
}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});