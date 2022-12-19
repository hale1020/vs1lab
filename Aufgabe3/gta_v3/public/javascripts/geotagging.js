import { LocationHelper } from './location-helper.js';
import { MapManager } from './map-manager.js';

// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

function updateLocation() {


    function callback(helper){
        /*Hidden Input Field Variables */
        var disc_hidden_long = document.getElementById("discovery_hidden_longitude");
        var disc_hidden_lat = document.getElementById("discovery_hidden_latitude");
        disc_hidden_lat.setAttribute("value", helper.latitude);
        disc_hidden_long.setAttribute("value", helper.longitude);

        /*Input Field Variables */
        let tag_long = document.getElementById("long");
        let tag_lat = document.getElementById("lat");
        tag_lat.setAttribute("value", helper.latitude);
        tag_long.setAttribute("value", helper.longitude);

        var manager = new MapManager("f64689zc2fhvhu0miIiVlLaUAchTYDWv");

        /* Map View Image Element */
        var map_view = document.getElementById("mapView");
        let taglist_json = map_view.getAttribute("data-tags");
        let mapTaglist = JSON.parse(taglist_json);
        console.log(taglist_obj);
        map_view.setAttribute("src", manager.getMapUrl(helper.latitude, helper.longitude, mapTaglist, 12))

    }
    

    if (document.getElementById("discovery_hidden_longitude").value === '' || document.getElementById("discovery_hidden_latitude").value === '') {
        LocationHelper.findLocation(callback);
    }

    var longitude = document.getElementById("longitude_id");
    var latitude = document.getElementById("latitude_id");
    const latConst = latitude.getAttribute("value");
    const longConst = longitude.getAttribute("value");
    if ((longConst === "") || (latConst === "")) {
        LocationHelper.findLocation(callback);}
    
    else {
        let manager = new MapManager("f64689zc2fhvhu0miIiVlLaUAchTYDWv"); 

        /* Map View Image Element */
        var map_view = document.getElementById("mapView");
        let taglist_json = map_view.getAttribute("data-tags");
        let mapTaglist = JSON.parse(taglist_json);
        console.log(taglist_obj);
        map_view.setAttribute("src", manager.getMapUrl(latConst, longConst, mapTaglist, 12))
    }

}

//Update Location laden wenn die Seite ganz geladen wurde
document.addEventListener('DOMContentLoaded', () => {
    updateLocation();
});


var submitTagging = document.getElementById('submit-tagging');
submitTagging.addEventListener('click',function(){updateLocation()});

var submitDiscovery = document.getElementById('submit-discovery');//same thing
submitDiscovery.addEventListener('click',function(){updateLocation()});


