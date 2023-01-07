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

    removeGeoTag(geoTag){
        for (let i = 0; i < this.#alltags.length; i++) {
            if (this.#alltags[i].name === geoTag.name) {
                let removedGeoTag = this.#alltags[i];
                this.#alltags.splice(i, 1);
                return removedGeoTag;
            }
        }
        }

    getNearbyGeoTags(location){
        let rad = 0.1;

        let entries = [];

        this.#alltags.forEach((value, index, array) => {

            let longitude_difference = value.longitude - location.longitude;
            let latitude_difference = value.latitude - location.latitude;
            if(Math.sqrt(Math.pow(longitude_difference, 2) + Math.pow(latitude_difference, 2)) <= rad) {
                entries.push(value);
            }
        });

        return entries;
    }


    //Funktion benötigt???
    searchNearbyGeoTags(location, keyword){

        let ret = [];
        let nearby = this.getNearbyGeoTags(location);
        
        nearby.find((value) => {
            //console.log(geoTag,geoTag.name);
            if (value.name.includes(keyword) || value.hashtag.includes(keyword)) {
                ret.push(value);
            }
                
        });
        return ret


    }

    searchTagId(id) {
        let ret = null;
        this.#alltags.find((tag) => {
            if (tag.name == id) {
                ret = tag;
            }
        });
        return ret;
    }

    getTagsWithSearchterm(searchterm){
        let ret = [];
        if (searchterm.charAt(0) === '#'){
            searchterm= searchterm.slice(1); 
            this.#alltags.find((geoTag) => {
                let hashtag = geoTag.hashtag.slice(1); //2. slice nötig???
                if (hashtag.includes(searchterm)) {
                    this.getNearbyGeoTags(geoTag).find((tag) => {
                        if (!ret.includes(tag)) ret.push(tag);
                    });
                }
        })
        }
        else{
            for (let i = 0; i < this.#alltags.length; i++) {
                if (this.#alltags[i].name.includes(searchterm)) {
                    if (!ret.includes(this.#alltags[i])){
                        ret.push(this.#alltags[i]);
                    }
                    
                }
            }
        }

        
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

    changeGeoTag(newGeoTag,id) {
        let oldGeoTag= this.searchTagId(id);
        if (oldGeoTag !== null){
            this.removeGeoTag(oldGeoTag);
            this.addGeoTag(newGeoTag);
        }
    }

}


module.exports = InMemoryGeoTagStore