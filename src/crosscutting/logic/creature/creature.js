import { FoodType } from "../../constants/objectConstants";
import { MoveMode, Direction } from "../../constants/creatureConstants";
import { 
    determineSightDirection,
    determineSightCoordinates
} from "./creatureLogic";

export default class Creature {
    constructor({ size, color, gender, type, food, sightRadius, sightDistance, position, speed, 
        targetPosition, setPlants, setCreatures, setShelters }) {
        this.showLines = true;

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

    returnProperties = () => {
        return {
            position: this.position,
            speed: this.speed,
            direction: this.direction,
            moveMode: this.moveMode,
            food: this.food,
            targetType: this.targetType,
            currentTarget: this.currentTarget,
            inventory: this.inventory,
            sightRadius: this.sightRadius,
            sightDistance: this.sightDistance,
            targetPosition: this.targetPosition,
            sideOfCollison: this.sideOfCollision,
            previousSide: this.previousSide,
            newDirection: this.newDirection,
        };
    }

    // sight targeting methods
    getSightCoordinates = (canvasInfo) => {
        let direction = null;
        // if there is a newDirection set, use that for determining which way to show the site coordinates
        if (this.newDirection) {
        direction = this.newDirection;
        }

        // otherwise, use direction. For now, use the direction that is furthest from target if there's two
        // this is for simplicity - in the future maybe make it diagonal too.
        if (!direction) {
        direction = determineSightDirection(this);
        }

        // now get the coordinates and return them
        let coord = determineSightCoordinates(this, direction, canvasInfo);
        //console.log(`sight coords: ${JSON.stringify(coord)}`);
        return coord;
    }

    // movement methods
    move = (objects, plants, creatures, CanvasInfo) => {

        return this.returnProperties();
    }

    setDirection = (xDifference, yDifference) => {
        this.direction.x = xDifference > 0 ? Direction.EAST : Direction.WEST;
        if (Math.abs(xDifference) <= this.speed) {
            this.direction.x = null;
        }
        this.direction.y = yDifference > 0 ? Direction.SOUTH : Direction.NORTH;
        if (Math.abs(yDifference) <= this.speed) {
            this.direction.y = null;
        }
    };
}