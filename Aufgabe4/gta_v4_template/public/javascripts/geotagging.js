
// Nicht sicher ob richtig
// GeoTagStore = require('../../models/geotag-store');
// var store = new GeoTagStore();


async function updateLocation(callback) {
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

        var manager = new MapManager("f64689zc2fhvhu0miIiVlLaUAchTYDWv");
    var map = document.getElementById("mapView")
    var map_view = document.getElementById("mapView");
    let taglist_json_string = map_view.getAttribute("data-tags");
    let taglist_json = JSON.parse(taglist_json_string);


    map.setAttribute("src", manager.getMapUrl(helper.latitude, helper.longitude, taglist_json));
    }

    //LocationHelper.findLocation(callback);

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
    return new Promise((resolve, reject) => {
        let manager = new MapManager("1fuMAYDadogIhChVgO3HQp5oc01EVfDb");
        let latitude = parseFloat(document.getElementById("latitude2").getAttribute("value"));
        let longitude = parseFloat(document.getElementById("longitude2").getAttribute("value"));
        let mapUrl = manager.getMapUrl(latitude, longitude, JSON.parse(geotags).tagFiltered);
        document.getElementById("mapView").setAttribute("src", mapUrl);

        resolve(geotags);
    })
}

function updateList(tags) {
    console.log("UpdateListFunktion:", JSON.parse(tags), "\n");
    let parsedResponse = JSON.parse(tags);
    let taglist = parsedResponse.tagFiltered;
    let totalResults = parsedResponse.tagCount;
    /*maxPage = Math.ceil(totalResults / elementsPerPage);
    document.getElementById("maxPage").innerHTML = maxPage.toString();*/

    if (taglist !== undefined) {
        let list = document.getElementById("discoveryResults");
        list.innerHTML = "";
        taglist.forEach(function (tag) {
            let element = document.createElement("li");
            element.innerHTML = tag.name + "(" + tag.latitude + "," + tag.longitude + ")" + tag.hashtag; //Wie im HTML
            list.appendChild(element);
        })
    }
    //(De-)aktiviere Buttons in Abhängigkeit von Seite
    /*document.getElementById("prevPage").disabled = page <= 1;
    document.getElementById("nextPage").disabled = page === maxPage;
    return tags;
}



//fetch Discovery-Filter
async function getTagList(newSearchterm = "") {
    let response = await fetch("http://localhost:3000/api/geotags?" + "&searchterm=" + newSearchterm + "&longitude="
        + document.getElementById("longitude2").getAttribute("value")
        + "&latitude=" + document.getElementById("latitude2").getAttribute("value"));         //Get mit HTTP Query Parameter
    return await response.json();
}

const discoveryButton = document.getElementById('submit-discovery');

discoveryButton.addEventListener('click',function(event) {
    event.preventDefault();
    console.log("DiscoveryButton clicked");
     
     let newSearchterm= document.getElementById("searchterm").value;

     console.log(newSearchterm);
     
     if (newSearchterm.charAt(0) === '#') {
        newSearchterm = newSearchterm.slice(1,newSearchterm.length);
    }

    getTagList(newSearchterm).then(updateMap).then(updateList)
    .catch(error => alert("Search term does not exist"));

    /* async function getGeotag() {
        var response = await fetch("http://localhost:3000/api/geotags" + id);
        return await response.json();}
       
        getGeotag(newSearchterm).then(msgAlert);*/
     
  });


const taggingButton = document.getElementById('submit-tagging');

taggingButton.addEventListener('click',function(event) {
    console.log("TaggingButton clicked");

      const data = { 
         

     };
      event.preventDefault();
  });


document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM loaded');
    updateLocation();
});