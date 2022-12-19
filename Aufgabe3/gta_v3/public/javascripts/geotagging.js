console.log('geotagging.js is being executed');

import { LocationHelper } from './location-helper.js';
import { MapManager } from './map-manager.js';

// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...

function updateLocation(callback) {
    console.log("Update Location starts!!");
    let helper = new LocationHelper();
    LocationHelper.findLocation(callback);

    function callback(helper){
        var longitudeDiscovery = document.getElementById("longitude2");
        var latitudeDiscovery = document.getElementById("latitude2");
        
        var longitudeTagging = document.getElementById("longitude");
        var latitudeTagging = document.getElementById("latitude");

        longitudeDiscovery.setAttribute("value", helper.longitude);
        latitudeDiscovery.setAttribute("value", helper.latitude);

        longitudeTagging.setAttribute("value", helper.longitude);
        latitudeTagging.setAttribute("value", helper.latitude);

        var manager = new MapManager("f64689zc2fhvhu0miIiVlLaUAchTYDWv");
        var map = document.getElementById("mapView")
        map.setAttribute("src", manager.getMapUrl(helper.latitude, helper.longitude));
    }

    //LocationHelper.findLocation(callback);

    if (document.getElementById("longitude2").value === '' && document.getElementById("latitude2").value === '') {
        LocationHelper.findLocation((helper) => {

            /* Constant lat and long */
            const latitude = helper.latitude;
            const longitude = helper.longitude;

            /* Readonly Input change */
            document.getElementById(latitude).value = latitude;
            document.getElementById(longitude).value = longitude;

            /* Hidden Input change */
            document.getElementById(latitude2).value = latitude;
            document.getElementById(longitude2).value = longitude;
        });
    }

    let manager = new MapManager("f64689zc2fhvhu0miIiVlLaUAchTYDWv"); 
    var map_view = document.getElementById("mapView");
    let taglist_json = map_view.getAttribute("data-tags");
    var mapTaglist = JSON.parse(taglist_json);
    console.log(mapTaglist);
    map_view.setAttribute("src", manager.getMapUrl(helper.latitude, helper.longitude, mapTaglist, 12))


}  


//Update Location????

if(document.readyState !== 'loading') {
    console.log('document is already loaded, just execute code here');
    updateLocation();
}

else{
    document.addEventListener('DOMContentLoaded', 
    (event) => {
    console.log('DOM loaded');
    updateLocation();
});
}