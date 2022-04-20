import NewObject from "../objects";
import { FoodType } from "../../../constants/objectConstants";

export default class Plant extends NewObject {
    constructor({id, type, color, xStart, yStart, width, height, growInterval}) {
        super(id, type, color, xStart, yStart, width, height);
        this.foodType = FoodType.PLANT;
        this.growInterval = growInterval;
    }
}