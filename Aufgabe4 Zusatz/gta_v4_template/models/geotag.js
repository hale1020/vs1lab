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
    
    constructor(name,hashtag,lat,long,id){
        this.name=name;
        this.hashtag=hashtag;
        this.latitude=lat;
        this.longitude=long;
        this.id=id;
    }
    name;
    hashtag;
    latitude;
    longitude;
    id;
    

    

    toJSON() {
        return {
            name: this.name,
            hashtag: this.hashtag,
            latitude: this.latitude,
            longitude: this.longitude,
            id: this.id,
            
        }
    }
    
}

module.exports = GeoTag;
