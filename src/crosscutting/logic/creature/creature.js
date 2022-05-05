import { FoodType } from "../../constants/objectConstants";
import { MoveMode, Direction } from "../../constants/creatureConstants";
import { 
    determineSightDirection,
    determineSightCoordinates
} from "./creatureLogic";

export default class Creature {
    constructor({id, size, color, gender, type, food, sightRadius, sightDistance, position, speed, 
        targetPosition, setPlants, setCreatures, setShelters }) {
        this.showLines = true;

        this.id = id;
        this.size = size;
        this.color = color;
        this.gender = gender;
        this.type = type;
        this.foodType = FoodType.PREY; // this will always be prey - it helps a predator determine if it's food or not - this is included in plants too
    
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
        this.movement = new CreatureMovement(this, sightRadius, sightDistance, speed, MoveMode.SEARCH);
    
    
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
        };
    }

    update = (objects, plants, creatures, CanvasInfo) => {
        // do other update stuff
        this.movement.move(this, objects, plants, creatures, CanvasInfo);

        return this.returnProperties();
    }

    // movement methods
}

class CreatureLife {
    constructor() {
        
    }
}

class CreatureMovement {
    constructor(creature, sightRadius, sightDistance, speed, moveMode) {
        this.creature = creature;
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

    move = (objects, plants, creatures, CanvasInfo) => {
        console.log('moving creature');

        //return this.returnProperties();
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
        direction = determineSightDirection(this.creature);
        }

        // now get the coordinates and return them
        let coord = determineSightCoordinates(this.creature, direction, canvasInfo);
        //console.log(`sight coords: ${JSON.stringify(coord)}`);
        return coord;
    }
}