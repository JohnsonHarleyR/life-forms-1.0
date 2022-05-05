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
    
        this.width = this.size; // Necessary?
        this.height = this.size; // Necessary?
    
        this.shelter = null;
    
        this.food = food;
        this.inventory = {
            food: []
        };
        this.targetType = FoodType.BOTH;
        this.currentTarget = null;
        this.targetPosition = targetPosition;

        this.position = position;
        this.movement = new CreatureMovement(sightRadius, sightDistance, speed, MoveMode.SEARCH);
        // this.movement = {
        //     sightRadius: sightRadius,
        //     sightDistance: sightDistance,
        //     speed: speed,
        //     direction: {
        //         x: null,
        //         y: null
        //     },
        //     moveMode: MoveMode.SEARCH,
        
        //     sideOfCollision: null,
        //     previousSide: null,
        //     newDirection: null,
        // }
    

    
        this.setPlants = setPlants;
        this.setCreatures = setCreatures;
        this.setShelters = setShelters;
    }

    returnProperties = () => {
        return {
            food: this.food,
            targetType: this.targetType,
            currentTarget: this.currentTarget,
            targetPosition: this.targetPosition,
            inventory: this.inventory,
            position: this.position,
            movement: this.movement
            // speed: this.speed,
            // direction: this.direction,
            // moveMode: this.moveMode,
            // sightRadius: this.sightRadius,
            // sightDistance: this.sightDistance,
            // sideOfCollison: this.sideOfCollision,
            // previousSide: this.previousSide,
            // newDirection: this.newDirection,
        };
    }

    // sight targeting methods
    getSightCoordinates = (canvasInfo) => {
        let direction = null;
        let m = this.movement;
        // if there is a newDirection set, use that for determining which way to show the site coordinates
        if (m.newDirection) {
        direction = m.newDirection;
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
        let m = this.movement;

        return this.returnProperties();
    }
}

class CreatureMovement {
    constructor(sightRadius, sightDistance, speed, moveMode) {
        this.sightRadius = sightRadius;
        this.sightDistance = sightDistance;
        this.speed = speed;
        this.direction = {
            x: null,
            y: null
        };
        this.moveMode = moveMode;

        this.sideOfCollision = null;
        this.previousSide = null;
        this.newDirection = null;
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