// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
    
    constructor(name,hashtag,lat,long){
        this.name=name;
        this.hashtag=hashtag;
        this.latitude=lat;
        this.longitude=long;
    }
    name;
    hashtag;
    latitude;
    longitude;
    

    

    toJSON() {
        return {
            name: this.name,
            hashtag: this.hashtag,
            latitude: this.latitude,
            longitude: this.longitude,
            
        }
    }
    
}

module.exports = GeoTag;
