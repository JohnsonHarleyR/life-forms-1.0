

export default class Alteration {
    constructor (type, color, energy) {
        this.type = type;
        this.color = color;
        this.energy = energy;
    }

}

export class PlantSpeciesAlteration {
    constructor ({type, color, width, height, growInterval, energy}) {
        super(type, color, energy);
        this.width = width;
        this.height = height;
        this.growInterval = growInterval;
    }

    // getSpeciesInfo = () => {
    //     return {
    //         type: this.type,
    //         color: this.color,
    //         width: this.width,
    //         height: this.height,
    //         growInterval: this.growInterval,
    //         energy: this.energy
    //     };
    // }
}