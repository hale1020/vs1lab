// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...

async function updateLocation() {

    let latitude = document.getElementById("latitude2").value;
    let longitude = document.getElementById("longitude2").value;

    if (longitude === '' && latitude === '') {
        await LocationHelper.findLocation((helper) => {

            /* Constant lat and long */
            latitude = helper.latitude;
            longitude = helper.longitude;

            /* Readonly Input change */
            document.getElementById("latitude").value = latitude;
            document.getElementById("longitude").value = longitude;

            /* Hidden Input change */
            document.getElementById("latitude2").value = latitude;
            document.getElementById("longitude2").value = longitude;
        });
    }


    console.log(latitude, longitude);
    var manager = new MapManager("f64689zc2fhvhu0miIiVlLaUAchTYDWv");
    var map_view = document.getElementById("mapView");
    let taglist_json_string = map_view.getAttribute("data-tags");
    let taglist = JSON.parse(taglist_json_string);

    map_view.setAttribute("src", manager.getMapUrl(latitude, longitude, taglist));

}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    updateLocation();
});
