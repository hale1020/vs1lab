/*import { LocationHelper } from './location-helper.js';
import { MapManager } from './map-manager.js';*/

const paging = true;

async function updateLocation() {

    let latitude = document.getElementById("latitude").getAttribute("value");
    let longitude = document.getElementById("longitude").getAttribute("value");

    //console.log( latitude, longitude);

    if (longitude === '' || latitude === '') {
        //console.log("Vor LOCATION HELPER");
        await LocationHelper.findLocation((helper) => {

            /* Constant lat and long */
            latitude = helper.latitude;
            longitude = helper.longitude;

            /* Readonly Input change */
            document.getElementById("latitude").setAttribute("value", latitude);
            document.getElementById("longitude").setAttribute("value", longitude);

            /* Hidden Input change */
            document.getElementById("latitude2").value = latitude;
            document.getElementById("longitude2").value = longitude;
        });
    }

    //console.log("Sollte nicht lehr sein:", latitude, longitude);

    var manager = new MapManager("f64689zc2fhvhu0miIiVlLaUAchTYDWv");
    var map_view = document.getElementById("mapView");
    let taglist_json_string = map_view.getAttribute("data-tags");

    //console.log(taglist_json_string);

    let taglist = [];
    if(taglist_json_string != '') {
        taglist = JSON.parse(taglist_json_string);
    }
    

    /*setTimeout(function () {
        map_view.setAttribute("src", manager.getMapUrl(latitude, longitude, taglist));
    }, 100)*/

    map_view.setAttribute("src", manager.getMapUrl(latitude, longitude, taglist));

    return true //unsicher ob wichtig
}





async function updateMap(geotags) {
    //console.log(geotags);
    return new Promise((resolve, reject) => {
        let manager = new MapManager("f64689zc2fhvhu0miIiVlLaUAchTYDWv");
        let latitude = parseFloat(document.getElementById("latitude2").getAttribute("value"));
        let longitude = parseFloat(document.getElementById("longitude2").getAttribute("value"));
        let mapUrl = manager.getMapUrl(latitude, longitude, geotags);
        document.getElementById("mapView").setAttribute("src", mapUrl);

        resolve(geotags);

    })
}

function updateList(tags) {
    let list = "";
    for (let tag of tags) {
        list += "<li> " + tag.name + " ( " + tag.latitude + "," + tag.longitude + " ) " + tag.hashtag + "</li>"
    }
    document.getElementById("discoveryResults").innerHTML = list;
    return tags;
}


async function getTagList(newSearchterm) {

    let response = await fetch("http://localhost:3000/api/geotags?" + "searchterm=" + newSearchterm + "&longitude="
        + document.getElementById("longitude").getAttribute("value")
        + "&latitude=" + document.getElementById("latitude").getAttribute("value"));
    //let antwort= await response.clone().json();
    //console.log("Return response: " + antwort);
    return await response.json();


}

async function postAdd(geotag) {
    let response = await fetch("http://localhost:3000/api/geotags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geotag),
    });
    return await response.json();
}


async function getGeoTags(query) {
    //console.log("Before",query);
    if (query.searchterm.charAt(0) === '#') {
        query.searchterm = query.searchterm.slice(1, query.searchterm.length);
    }
    let response = await fetch("http://localhost:3000/api/geotags?latitude=" + query.latitude + "&longitude=" + query.longitude + "&searchterm=" + query.searchterm);
    return await response.json();
}

async function getGeoTagsByPage(query, page) {
    if (query.searchterm.charAt(0) === '#') {
        query.searchterm = query.searchterm.slice(1, query.searchterm.length);
    }
    console.log(query.searchterm);
    
    let response = await fetch("http://localhost:3000/api/geotags/page/" + page + "?searchterm=" + query.searchterm+ "&latitude=" + query.latitude + "&longitude=" + query.longitude);
    return await response.json();
}

//EVENT LISTENERS

document.addEventListener('DOMContentLoaded',async () => {
    console.log('DOM loaded');
    let query;
    await updateLocation();
    query = {
        longitude: document.getElementById("longitude2").value,
        latitude: document.getElementById("latitude2").value,
        searchterm: document.getElementById("searchterm").value
    }
    if (paging) getGeoTagsByPage(query, 1).then(updateList).then(updateMap);
    else getGeoTags(query).then(updateList).then(updateMap);
});




//Fehlerhaft??
const discoveryButton = document.getElementById("submit-discovery");

discoveryButton.addEventListener("click", function (event) {
    event.preventDefault();

    console.log("DiscoveryButton clicked");

    let newSearchterm = document.getElementById("searchterm").value;

    let query = {
        longitude: document.getElementById("longitude2").value,
        latitude: document.getElementById("latitude2").value,
        searchterm: newSearchterm
    }

    

    if (paging) getGeoTagsByPage(query, 1).then(updateList).then(updateMap);
    else getGeoTags(query).then(updateList).then(updateMap);

});

document.getElementById("tag-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    console.log("TaggingButton clicked");

    let newGeotag = {
        name: document.getElementById("name").value,
        hashtag: document.getElementById("hashtag").value,
        latitude: document.getElementById("latitude").value,
        longitude: document.getElementById("longitude").value,
    }
    //console.log(newGeotag);
    await postAdd(newGeotag);

    let query = {
        longitude: document.getElementById("longitude2").value,
        latitude: document.getElementById("latitude2").value,
        searchterm: document.getElementById("searchterm").value
    }

    if (paging) getGeoTagsByPage(query, 1).then(updateList).then(updateMap);
    else getGeoTags(query).then(updateList).then(updateMap);
});


document.getElementById("next_page").addEventListener('click', function (event) {
    event.preventDefault();
    newSearchterm = document.getElementById("searchterm").value
    let query = {
        longitude: document.getElementById("longitude2").value,
        latitude: document.getElementById("latitude2").value,
        searchterm: newSearchterm
    }
    let page = parseInt(document.getElementById("page").value);

    getGeoTagsByPage(query, page + 1).then(function (value) {
        if (value.length === 0) {
            //console.log(query, page);
            return getGeoTagsByPage(query, page);
        } else {
            document.getElementById("page").value = page + 1;
            return value;
        }
    }).then(updateList);
});

document.getElementById("prev_page").addEventListener('click', function (event) {
    event.preventDefault();
    newSearchterm = document.getElementById("searchterm").value
    //console.log(newSearchterm);
    let query = {
        longitude: document.getElementById("longitude2").value,
        latitude: document.getElementById("latitude2").value,
        searchterm: newSearchterm
    }
    let page = parseInt(document.getElementById("page").value);
    console.log("Page: " + page)
    getGeoTagsByPage(query, page - 1).then(function (value) {
        if (page - 1 === 0) {
            return getGeoTagsByPage(query, 1);
        }
        document.getElementById("page").value = page - 1;
        return value;
    }).then(updateList).then(updateMap);
});

