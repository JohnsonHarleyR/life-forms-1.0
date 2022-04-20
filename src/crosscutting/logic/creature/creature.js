import { FoodType } from "../../constants/objectConstants";
import { MoveMode } from "../../constants/creatureConstants";

export default class Creature {
    constructor({ size, color, gender, type, food, sightRadius, sightDistance, position, speed, 
        targetPosition, setPlants, setCreatures, setShelters }) {
        this.size = size;
        this.color = color;
        this.gender = gender;
        this.type = type;
        this.foodType = FoodType.PREY;
    
        this.width = this.size;
        this.height = this.size;
    
        this.shelter = null;
    
        this.food = food;
        this.inventory = {
            food: []
        };
        this.targetType = FoodType.BOTH;
        this.currentTarget = null;
    
        this.sightRadius = sightRadius;
        this.sightDistance = sightDistance;
        this.position = position;
        this.speed = speed;
        this.direction = {
            x: null,
            y: null
        };
        this.moveMode = MoveMode.SEARCH;
        this.targetPosition = targetPosition;
    
        this.sideOfCollision = null;
        this.previousSide = null;
        this.newDirection = null;
    
        this.setPlants = setPlants;
        this.setCreatures = setCreatures;
        this.setShelters = setShelters;
    }

    move = (objects, plants, creatures, CanvasInfo) => {

    }
}