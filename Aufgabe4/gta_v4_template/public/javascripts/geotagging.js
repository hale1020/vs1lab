
// Nicht sicher ob richtig
//const GeoTagStore = require('../../models/geotag-store');
//var store = new GeoTagStore();


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
        let mapUrl = manager.getMapUrl(latitude, longitude, geotags);
        document.getElementById("mapView").setAttribute("src", mapUrl);

        resolve(geotags);
    })
}


function updateList(geotags) {
    console.log("inupdatelist: ", geotags, "\n");
    let parsedResponse = geotags;
    let taglist = parsedResponse;
    let totalResults = parsedResponse;
    
    if (taglist !== undefined) {
        let list = document.getElementById("discoveryResults");
        list.innerHTML = "";
        taglist.forEach(function (tag) {
            let element = document.createElement("li");
            element.innerHTML = tag.name + "(" + tag.latitude + "," + tag.longitude + ")" + tag.hashtag;
            list.appendChild(element);
        })
    }
    return geotags;


   }

//fetch tagging
async function postAdd(geotag) {


    let response = await fetch("http://localhost:3000/api/geotags", {        
        method: "POST", headers: {"Content-Type": "application/json"},                  
        body: JSON.stringify(geotag),
    });

    let emptySearch = await fetch("http://localhost:3000/api/geotags?&offset=" + "&searchterm=" + "" +
        "&limit=" + elementsPerPage + "&latitude=" + "" + "&longitude=" + "", {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    });

    return await emptySearch.json();
}


async function getTagList(newSearchterm) {
    let response = await fetch("http://localhost:3000/api/geotags?" + "&searchterm=" + newSearchterm );         //Get mit HTTP Query Parameter
        console.log("GetTaglistResponse ", response, "\n");
         return await response.json();
    
}

async function postAdd(geotag) {


    let response = await fetch("http://localhost:3000/api/geotags", {          //Post mit HTTP
        method: "POST", headers: {"Content-Type": "application/json"},                      //MimeType
        body: JSON.stringify(geotag),
    });

    //let emptySearch = await fetch("http://localhost:3000/api/geotags?" +  "&searchterm=" + "&latitude=" + "" + "&longitude=" + "", {
    //    method: "GET",
   //     headers: {"Content-Type": "application/json"},
  //  });

  //  return await emptySearch.json();
}

document.addEventListener('DOMContentLoaded', 
    (event) => {
    console.log('DOM loaded');
    updateLocation();
    
    
    });



const discoveryButton = document.getElementById('submit-discovery');

   discoveryButton.addEventListener('click',function(event) {
    event.preventDefault();

    console.log("DiscoveryButton clicked");
     
     let newSearchterm= document.getElementById("searchterm").value;

     if (newSearchterm.charAt(0) === '#') {
        newSearchterm = newSearchterm.slice(1,newSearchterm.length);
    }

    getTagList(newSearchterm).then(updateMap).then(updateList)
     
  });


const taggingButton = document.getElementById('submit-tagging');

taggingButton.addEventListener('click',function(event) {
    event.preventDefault();

    console.log("TaggingButton clicked");
    
    let newGeotag = {
        name: document.getElementById("name").value,
        hashtag: document.getElementById("hashtag").value,
        latitude: document.getElementById("latitude").value,
        longitude: document.getElementById("longitude").value,
    }
    postAdd(newGeotag).then(updateMap);
    document.getElementById("name").value = "";
    document.getElementById("hashtag").value = "";
    document.getElementById("searchterm").value = ""; //unnötig???
  }, true);

     

  