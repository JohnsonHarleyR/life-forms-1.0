import { ShelterLine } from "../../../constants/canvasConstants";

export default class Shelter {
    constructor(id, position, color, creatureSize) {
        this.id = id;
        this.position = position;
        this.color = color;
        this.size = creatureSize * ShelterLine.MULTIPLIER;

        this.inventory = {
            food: []
        };
    }

    getXStart = () => {
        let halfSize = this.size / 2;
        return this.position.x - halfSize;
    }

    getXEnd = () => {
        let halfSize = this.size / 2;
        return this.position.x + halfSize;
    }

    getYStart = () => {
        let halfSize = this.size / 2;
        return this.position.y - halfSize;
    }

    getYEnd = () => {
        let halfSize = this.size / 2;
        return this.position.y + halfSize;
    }
}