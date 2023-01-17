// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
var store = new GeoTagStore();

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

/**router.get('/', (req, res) => {
  res.render('index', { taglist: [] })
});*/

router.get('/', (req, res) => {
  res.render('index', {currentLatitude: null, currentLongitude:null, taglist: store.GeoTags, mapTaglist: ''})
});

//Routes from A3

router.post("/tagging", (req, res) => {
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  let name = req.body.name;
  let hashtag = req.body.hashtag;
  //console.log(req.body);

  let geoTag = new GeoTag(name, hashtag,latitude, longitude);
  let nearbyGeoTags = store.getNearbyGeoTags(geoTag);

  nearbyGeoTags.push(geoTag);
  //console.log(store.geoTags);
  store.addGeoTag(geoTag);
  //console.log(store.geoTags);
  res.render("index", {
    taglist: nearbyGeoTags,
    currentLatitude: latitude,
    currentLongitude: longitude,
    mapTaglist: JSON.stringify(store.geoTags),
    hashtag: hashTag
  });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

router.post("/discovery", (req, res) => {
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  let name = req.body.name;
  let hashtag = req.body.hashtag;
  //console.log(req.body);

  let geoTag = new GeoTag(name, hashtag, latitude, longitude);
  let search = req.body.searchterm;
  let nearbyGeoTags = store.getNearbyGeoTags(geoTag, search);
  
  //console.log(nearbyGeoTags); //Ausgabe der nahen Tags

  res.render("index", {
    taglist: (nearbyGeoTags),
    currentLatitude: req.body.latitude,
    currentLongitude: req.body.longitude,
    mapTaglist: JSON.stringify(nearbyGeoTags),
    hashTag: req.body.hashtag,
  });
});




// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags/', (req, res) =>{
  let latitudeQuery = req.query.latitude;
  let longitudeQuery = req.query.longitude;
  let discoveryQuery = req.query.searchterm;
 
  /**
   * location contains latitude and longitude, which is sufficient for a use in geotag-store.getNearbyGeoTags()
   * @type {{latitude: (*|Document.latitude|number), longitude: (*|Document.longitude|number)}}
   */

  let referenceTag= new GeoTag("","",latitudeQuery, longitudeQuery);

  let filterArray = store.getTagsWithSearchterm(discoveryQuery);
  console.log("Filter1: ",filterArray);

  //console.log(nearbyGeoTags);

  if(longitudeQuery != null && latitudeQuery != null) {
    filterArray = store.getNearbyGeoTags(referenceTag,filterArray);
    console.log("Filter2: ",filterArray);
  }
  res.status(200).json(filterArray);

});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post("/api/geotags", (req, res) => {
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  let name = req.body.name;
  let hashtag = req.body.hashtag;
  let newtag = new GeoTag(name, hashtag, latitude, longitude);

  store.addGeoTag(newtag)

  let id= newtag.id;
  //console.log("Added geo tag", tag);
  
  res.append('Location', "api/geotags/" + id);
  res.status(201).json(newtag);
});


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get("/api/geotags/:id", (req, res) => {
    let id=req.params.id;
    let foundGeoTags=store.searchTagId(id);
    console.log("!!!",foundGeoTags);

    res.status(200).json(foundGeoTags);


});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put("/api/geotags/:id", (req, res) => {
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  let hashtag = req.body.hashtag;
  let name = req.body.name;
  let id =Number(req.params.id);
  let newtag = new GeoTag(name, hashtag, latitude, longitude, id);
  store.changeGeoTag(newtag, id)
  res.status(200).json(newtag);
});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete("/api/geotags/:id", (req, res) => {
  let id = Number(req.params.id);
  let newtag = new GeoTag("", "", "", "", id);
  let deletedResource = store.removeGeoTag(newtag);
  res.status(200).json(deletedResource);
});

/**Pagination */

router.get('/api/geotags/page/:id', (req, res) => {
  let page = parseInt(req.params.id);
  let longitudeQuery = req.query.longitude;
  let latitudeQuery = req.query.latitude ;
  let searchTermQuery = req.query.searchterm;

  let filterArray = store.getTagsWithSearchterm(searchTermQuery);
  

  if(longitudeQuery != null && latitudeQuery != null) {
    
    filterArray = store.getNearbyGeoTags(new GeoTag('', '', latitudeQuery,longitudeQuery), filterArray);
  }

  let result = store.getGeoTagsByPage(page, filterArray);

  //console.log("Result", result)
  res.status(200).json(result);
});

module.exports = router;