// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
GeoTagExamples = require('./geotag-examples');
GeoTag = require('./geotag');

class InMemoryGeoTagStore{

    constructor() {
        this.populate();
    }

    
    #alltags = [];

    addGeoTag(GeoTag){
        this.#alltags.push(GeoTag);
    }

    get GeoTags(){
        return this.#alltags;
    }

    removeGeoTag(GeoTag){
        this.#alltags=this.#alltags.filter(element => {
            if (element.name!=GeoTag.name){return true;}}); //? return element???
        }

    getNearbyGeoTags(location){
        var nearby=[];
        var proximity_radius=0.5;

        this.#alltags.forEach(function(element){
            var distance= Math.sqrt(Math.pow(element.lat-location.lat,2)+Math.pow(element.long-location.long,2));
            if (distance<=proximity_radius){
                nearby.push(element);
            }
        });
        return nearby;
    }

    searchNearbyGeoTags(keyword){

        let ret = [];
        this.#alltags.find((geoTag) => {
            //console.log(geoTag,geoTag.name);
            if (geoTag.name.includes(keyword) || geoTag.hashtag.includes(keyword)) {
                this.getNearbyGeoTags(geoTag).find((tag) => {
                   if(!ret.includes(tag)){ret.push(tag)};
          });
            }
        });
        return ret;


    }


    populate() {
        GeoTagExamples.tagList.forEach((tag) => {
            //console.log(tag)
            var newGeoTag = new GeoTag(tag[0], tag[3], tag[1], tag[2]);
            //console.log(newGeoTag)
            this.addGeoTag(newGeoTag);
        });
              };

}


module.exports = InMemoryGeoTagStore
