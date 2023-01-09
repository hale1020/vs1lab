import { LocationHelper } from './location-helper.js';
import { MapManager } from './map-manager.js';

const paging = true;

export async function updateLocation(callback) {
    let helper = new LocationHelper();
    await LocationHelper.findLocation(callback);

    function callback(helper){
        var longitudeDiscovery = document.getElementById("longitude2");
        var latitudeDiscovery = document.getElementById("latitude2");
        
        var longitudeTagging = document.getElementById("longitude");
        var latitudeTagging = document.getElementById("latitude");

        longitudeDiscovery.setAttribute("value", helper.longitude);
        latitudeDiscovery.setAttribute("value", helper.latitude);

        longitudeTagging.setAttribute("value", helper.longitude);
        latitudeTagging.setAttribute("value", helper.latitude);

        let manager = new MapManager("f64689zc2fhvhu0miIiVlLaUAchTYDWv");
        var map = document.getElementById("mapView")
        var map_view = document.getElementById("mapView");
        let taglist_json_string = map_view.getAttribute("data-tags");
        
        let taglist_json = JSON.parse(taglist_json_string);

        setTimeout(function(){
            map.setAttribute("src", manager.getMapUrl(helper.latitude, helper.longitude, taglist_json));
        },1000)
       return true 
    }


    //LocationHelper.findLocation(callback); wichtig???

    if (document.getElementById("longitude2").value === '' && document.getElementById("latitude2").value === '') {
        await LocationHelper.findLocation((helper) => {

            /* Constant lat and long */
            const latitude = helper.latitude;
            const longitude = helper.longitude;

            /* Readonly Input change */
            document.getElementById("latitude").value = latitude;
            document.getElementById("longitude").value = longitude;

            /* Hidden Input change */
            document.getElementById("latitude2").value = latitude;
            document.getElementById("longitude2").value = longitude;
        });

        
        
    }
    
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
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(geotag),
    });
    return await response.json();
}


async function getGeoTags(query) {
    let response = await fetch("http://localhost:3000/api/geotags?latitude=" + query.latitude + "&longitude=" + query.longitude + "&searchterm=" + query.searchterm);
    return await response.json();
}

async function getGeoTagsByPage(query, page) {
    let response = await fetch("http://localhost:3000/api/geotags/page/" + page + "/?latitude=" + query.latitude + "&longitude=" + query.longitude + "&searchterm=" + query.searchterm);
    return await response.json();
}

//EVENT LISTENERS

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    updateLocation().then(function (value) {
        query = {
            longitude: document.getElementById("discovery_hidden_longitude").value,
            latitude: document.getElementById("discovery_hidden_latitude").value,
            searchterm: document.getElementById("disc_name").value
        }
        getGeoTagsByPage(query, 1).then(updateGeoTags).then(updateLocation);
    });
    
    });


//Fehlerhaft??
const discoveryButton = document.getElementById("submit-discovery");

   discoveryButton.addEventListener("click",function(event) {
    event.preventDefault();

    console.log("DiscoveryButton clicked");
     
     let newSearchterm= document.getElementById("searchterm").value;

     if (newSearchterm.charAt(0) === '#') {
        newSearchterm = newSearchterm.slice(1,newSearchterm.length);
    }
    

    let query = {
        longitude: document.getElementById("longitude2").value,
        latitude: document.getElementById("latitude2").value,
        searchterm: newSearchterm
    }

    //console.log("newSearchterm:", newSearchterm);
    getTagList(newSearchterm).then(updateList).then(updateMap);

    if(paging) getGeoTagsByPage(query, 1).then(updateGeoTags);
    else getGeoTags(query).then(updateGeoTags)
     
  });


const taggingButton = document.getElementById("submit-tagging");

taggingButton.addEventListener("click",function(event) {
    event.preventDefault();

    console.log("TaggingButton clicked");
    
    let newGeotag = {
        name: document.getElementById("name").value,
        hashtag: document.getElementById("hashtag").value,
        latitude: document.getElementById("latitude").value,
        longitude: document.getElementById("longitude").value,
    }
    //console.log(newGeotag);
    postAdd(newGeotag).then(updateList).then(updateMap);
    document.getElementById("name").value = "";
    document.getElementById("hashtag").value = "";
    document.getElementById("searchterm").value = "";
  }, true);


  document.getElementById("next_page").addEventListener('click', function (evt) {
    evt.preventDefault();
    let query = {
        longitude: document.getElementById("longitude2").value,
        latitude: document.getElementById("latitude2").value,
        searchterm: document.getElementById("searchterm").value
    }
    let page = parseInt(document.getElementById("page").value);

    getGeoTagsByPage(query, page+1).then(function (value) {
        if(value.length === 0) {
            console.log(query, page);
            return getGeoTagsByPage(query, page);
        }else {
            document.getElementById("page").value = page+1;
            return value;
        }
    }).then(updateGeoTags);
});

document.getElementById("prev_page").addEventListener('click', function (evt) {
    evt.preventDefault();
    let query = {
        longitude: document.getElementById("longitude2").value,
        latitude: document.getElementById("latitude2").value,
        searchterm: document.getElementById("searchterm").value
    }
    let page = parseInt(document.getElementById("page").value);
    console.log("Page: " + page)
    getGeoTagsByPage(query, page-1).then(function (value) {
        if(page-1 === 0) {
            return getGeoTagsByPage(query, 1);
        }
        document.getElementById("page").value = page-1;
        return value;
    }).then(updateGeoTags).then(updateLocation);
});

  