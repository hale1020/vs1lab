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
class InMemoryGeoTagStore{

    constructor() {
        this.populate();
    }

    
    #alltags = [];

    addGeoTag(GeoTag){
        this.#alltags.push(GeoTag);
    }

    getGeoTags(){
        return this.#alltags;
    }

    removeGeoTag(GeoTag){
        this.#alltags=this.#alltags.filter(element => {
            if (element.name!=GeoTag.name){return true;}}); //? return element???
        }

    getNearbyGeoTags(location){
        var nearby=[];
        var proximity_radius=0.5;

        this.#alltags.forEach(element => {
            var distance= Math.sqrt(Math.pow(element.lat-location.lat,2)+Math.pow(element.long-location.long,2));
            if (distance<=radius){
                nearby.push(element);
            }
        });
        return nearby;
    }

    searchNearbyGeoTags(location, keyword){
        var nearby_tags= getNearbyGeoTags(location)
        var ret=[];
        nearby_tags.forEach(element =>{
            if (element.name.includes(keyword)||element.hashtag.includes(keyword)){
                ret.push(element);
            }

        })
        return ret;
    }


    populate() {
        GeoTagExamples.tagList.forEach((tag) => {
            var newGeoTag = new GeoTag(tag[1], tag[2], tag[0], tag[3]);
            this.addGeoTag(newGeoTag);
        });
              };

}


module.exports = InMemoryGeoTagStore
