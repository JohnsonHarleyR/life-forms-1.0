import { Corner } from "../../constants/objectConstants";
import { getCenterPosition } from "../universalLogic";

export default class NewObject {
    constructor(id, type, color, xStart, yStart, width, height) {
        this.id = id;
        this.type = type;
        this.color = color;
        this.width = width;
        this.height = height;
        this.xStart = xStart;
        this.xEnd = xStart + width;
        this.yStart = yStart;
        this.yEnd = yStart + height;
        this.position = getCenterPosition(xStart, yStart, width, height);
    }
}