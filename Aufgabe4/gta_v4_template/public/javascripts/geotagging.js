
// Nicht sicher ob richtig
 GeoTagStore = require('../models/geotag-store');
 var store = new GeoTagStore();


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


//Update Location????

document.addEventListener('DOMContentLoaded', 
    (event) => {
    console.log('DOM loaded');
    updateLocation();
});



const discoveryButton = document.getElementById('submit-discovery');

   discoveryButton.addEventListener('click',function(event) {
    event.preventDefault();
     console.log("YOU CLICKED IT");
     
     let newSearchterm= document.getElementById("searchterm").value;
     

     console.log();
     
     store.getTagsWithSearchterm(newSearchterm);

     async function getGeotag() {
        var response = await fetch("http://localhost:3000/api/geotags" + id);
        return await response.json();}
       
        getGeotag(newSearchterm).then(msgAlert);
     
      
  });


const taggingButton = document.getElementById('submit-tagging');

   taggingButton.addEventListener('click',function(event) {
      // console.log("YOU CLICKED IT");

      const data = { 
         

     };
      event.preventDefault();
  });

  