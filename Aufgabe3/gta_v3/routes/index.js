// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const app = require('../app');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const {json} = require("express");
const {stringify} = require("nodemon/lib/utils");

let store = new GeoTagStore();
/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  res.render('index', { taglist: [], currentLatitude: null, currentLongitude:null, mapTaglist:[JSON.stringify(store.geoTags)]  })
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

// TODO: ... your code here ...
router.post("/tagging", (req, res) => {
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  let name = req.body.name;
  let hashTag = req.body.Hashtag;
  console.log(req.body);

  let geoTag = new GeoTag(latitude, longitude, name, hashTag);
  let nearbyGeoTags = store.getNearbyGeoTags(geoTag);

  nearbyGeoTags.push(geoTag);
  store.addGeoTag(geoTag);

  res.render("index", {
    taglist: nearbyGeoTags,
    currentLatitude: req.body.latitude,
    currentLongitude: req.body.longitude,
    MapTaglist: JSON.stringify(store.geoTags),
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
   
  let search = req.body.searchterm;
  let nearbyGeoTags = store.searchNearbyGeoTags(search);
  
  console.log(nearbyGeoTags); //Ausgabe der nahen Tags

  res.render("index", {
    taglist: nearbyGeoTags,
    currentLatitude: req.body.latitude,
    currentLongitude: req.body.longitude,
    mapTaglist: JSON.stringify(store.geoTags),
    hashtag: req.body.hashtag,
  });
});

module.exports = router;
