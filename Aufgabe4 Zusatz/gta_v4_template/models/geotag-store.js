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

//Imports Fehlerhaft?
GeoTagExamples = require('./geotag-examples');
const GeoTag = require('./geotag');

class InMemoryGeoTagStore {

    constructor() {
        this.populate();
    }


    #alltags = [];

    addGeoTag(GeoTag) {
        this.#alltags.push(GeoTag);
    }

    get GeoTags() {
        return this.#alltags;
    }

    removeGeoTag(geoTag) {
        for (let i = 0; i < this.#alltags.length; i++) {
            if (this.#alltags[i].name === geoTag.name) {
                let removedGeoTag = this.#alltags[i];
                this.#alltags.splice(i, 1);
                return removedGeoTag;
            }
        }
    }

    getNearbyGeoTags(location) {
        let rad = 0.1;

        let entries = [];
        //console.log(location);

        this.#alltags.forEach((value) => {

            let longitude_difference = value.longitude - location.longitude;
            let latitude_difference = value.latitude - location.latitude;
            if (Math.sqrt(Math.pow(longitude_difference, 2) + Math.pow(latitude_difference, 2)) <= rad) {
                entries.push(value);
            }
        });

        

        return entries;
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

    getTagsWithSearchterm(searchterm, location) {
        let entries = [];

        let tags = this.getNearbyGeoTags(location);

        if(searchterm === undefined || searchterm.length === 0 || searchterm === '') {
            console.log("Searchterm ", searchterm, "Lol: \n", tags);
            return tags;
        }
        tags.forEach((value) => {
            if(value.name === searchterm || value.name.includes(searchterm) || value.hashtag.includes(searchterm)){
                entries.push(value);
            }
        });
        //console.log("Searchterm", searchterm, "Tags: \n", entries);
        return entries;
    }


    populate() {
        GeoTagExamples.tagList.forEach((tag) => {
            //console.log(tag)
            let newGeoTag = new GeoTag(tag[0], tag[3], tag[1], tag[2]);
            //console.log(newGeoTag)
            this.addGeoTag(newGeoTag);
        });
    };

    changeGeoTag(newGeoTag, id) {
        let oldGeoTag = this.searchTagId(id);
        if (oldGeoTag !== null) {
            this.removeGeoTag(oldGeoTag);
            this.addGeoTag(newGeoTag);
        }
    }

    TagsPerSite = 5;
    getGeoTagsByPage(site, GeoTags = this.#alltags) {
        let entries = [];
        for (let i = (site - 1) * this.TagsPerSite; i < (site * this.TagsPerSite); i++) {
            let entry = GeoTags[i];
            if (entry != null) {
                entries.push(entry);
            } else {
                break;
            }
        }
        return entries;
    }

}


module.exports = InMemoryGeoTagStore