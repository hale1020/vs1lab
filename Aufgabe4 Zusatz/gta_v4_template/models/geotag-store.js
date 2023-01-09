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

        this.#alltags.forEach((value) => {

            let longitude_difference = value.longitude - location.longitude;
            let latitude_difference = value.latitude - location.latitude;
            if (Math.sqrt(Math.pow(longitude_difference, 2) + Math.pow(latitude_difference, 2)) <= rad) {
                entries.push(value);
            }
        });

        return entries;
    }


    //Funktion benötigt???
    searchNearbyGeoTags(tag) {
        return this.getTagsWithSearchterm(tag.name, this.getNearbyGeoTags(tag));


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
        let nearby = this.getNearbyGeoTags(location);
        let ret = [];

        if (searchterm.charAt(0) === '#') {
            searchterm = searchterm.slice(1);
        }

        nearby.find((geoTag) => {
            if (geoTag.name.includes(searchterm) || geoTag.hashtag.includes(searchterm)) {
                this.getNearbyGeoTags(geoTag).find((tag) => {
                    if (!ret.includes(tag)) ret.push(tag);
                });
            }
        })



        return ret;
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
        for (let i = (site - 1) * this.TagsPerSite; i <= ((site - 1) * this.TagsPerSite) + (this.TagsPerSite - 1); i++) {
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