import { FoodType } from "../../constants/objectConstants";
import { MoveMode, Direction, LifeStage, CreatureDefaults, AmountNeeded } from "../../constants/creatureConstants";
import { 
    determineSightDirection,
    determineSightCoordinates
} from "./creatureLogic";
import { roundToPlace, millisecondsToMinutes, blendColors } from "../universalLogic";

export default class Creature {
    constructor({id, size, color, gender, type, lifeSpanRange, lifeStage, fractionAsChild, fractionAsElder,
        food, energy, sightRadius, sightDistance, position, speed, foodNeeded, sleepNeeded,
        targetPosition, setPlants, setCreatures, setShelters }) {
        this.showLines = true;

        // do not touch the stuff in the next paragraph - as in don't refactor
        this.id = id;
        this.adultSize = size;
        this.adultColor = color;
        this.life = new CreatureLife(this, lifeSpanRange, lifeStage, fractionAsChild, fractionAsElder);
        this.energy = energy;
        this.size = this.life.determineSize();
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
            color: this.color,
            size: this.size,
            width: this.width,
            height: this.height,
            life: this.life,
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
        this.life.updateLife();
        this.movement.move(this, objects, plants, creatures, CanvasInfo);

        return this.returnProperties();
    }

    // movement methods
}

class CreatureLife {
    constructor(creature, lifeSpanRange, initialStage, fractionOfLifeAsChild, fractionOfLifeAsElder) {
        this.lifeSpan = this.determineLifeSpan(lifeSpanRange);
        this.stageRanges = { // each one has a start and end property - elder ends with null
            child: {stage: LifeStage.CHILD, range: this.determineStageRange(LifeStage.CHILD, this.lifeSpan, fractionOfLifeAsChild, fractionOfLifeAsElder)},
            adult: {stage: LifeStage.ADULT, range: this.determineStageRange(LifeStage.ADULT, this.lifeSpan, fractionOfLifeAsChild, fractionOfLifeAsElder)},
            elder: {stage: LifeStage.ELDER, range: this.determineStageRange(LifeStage.ELDER, this.lifeSpan, fractionOfLifeAsChild, fractionOfLifeAsElder)},
            deceased: {stage: LifeStage.DECEASED, range: this.determineStageRange(LifeStage.DECEASED, this.lifeSpan, fractionOfLifeAsChild, fractionOfLifeAsElder)}
        }

        this.creature = creature;
        this.age = this.determineInitialAge(initialStage);
        this.lifeStage = initialStage;
        this.birthTime = Date.now() - this.age;

        // test
        this.intervals = 0;

    }

    // this should happen every time the creature gets updated
    updateLife = () => {
        this.age = this.determineAge();
        this.lifeStage = this.determineLifeStage();
        this.creature.color = this.determineColor();
        let newSize = this.determineSize();
        this.updateSize(newSize);

        // test
        // this.intervals++;
        // if ((this.intervals < 11 && this.intervals % 10 === 0) || this.intervals % 100 === 0) {
        //     this.showAgingInfo();
        // }
    }

    showAgingInfo = () => {
        console.log(`creatureId: ${this.creature.id}`);
        console.log(`Stage: ${this.lifeStage}`);
        console.log(`Size: ${this.creature.size}`);
        console.log(`Age: ${millisecondsToMinutes(this.age)}`);
        console.log(`Lifespan: ${millisecondsToMinutes(this.lifeSpan)}`);
        let ageToStartGrowing = this.determineAgeToStartGrowing();
        if (this.age < ageToStartGrowing) {
            console.log(`Time until growth starts: ${millisecondsToMinutes(ageToStartGrowing - this.age)}`);
            console.log(`Age to start growing: ${millisecondsToMinutes(ageToStartGrowing)}`);
        }
        console.log(`Time to next stage: ${millisecondsToMinutes(this.determineTimeToNextStage())}`);
        console.log(`Age to Become Adult: ${millisecondsToMinutes(this.stageRanges.adult.range.start)}`);
        console.log(`Age to Become Elder: ${millisecondsToMinutes(this.stageRanges.elder.range.start)}`);
        console.log(`Age to Die: ${millisecondsToMinutes(this.stageRanges.deceased.range.start)}`);
        console.log('------------------------');
    }

    determineTimeToNextStage = () => {
        let nextStage = this.determineNextStage();
        switch (nextStage) {
            default:
                return 0;
            case LifeStage.ADULT:
                return this.stageRanges.adult.range.start - this.age;
            case LifeStage.ELDER:
                return this.stageRanges.elder.range.start - this.age;
            case LifeStage.DECEASED:
                return this.stageRanges.deceased.range.start - this.age;
        }
    }

    determineNextStage = () => {
        switch(this.lifeStage) {
            case LifeStage.CHILD:
                return LifeStage.ADULT;
            case LifeStage.ADULT:
                return LifeStage.ELDER;
            case LifeStage.ELDER:
                return LifeStage.DECEASED;
            default:
            case LifeStage.DECEASED: // TODO do we want it to disappear or what? Consider changing colors with different stages slightly?
                return null;
        }
    }

    determineSize = () => {
        switch (this.lifeStage) {
            case LifeStage.CHILD:
                return this.determineChildSize();
            default:
            case LifeStage.ADULT:
                return this.creature.adultSize;
            case LifeStage.ELDER:
                return this.determineElderSize();
            case LifeStage.DECEASED:
            return this.determineDeceasedSize();
        }
    }

    determineColor = () => {
        switch (this.lifeStage) {
            case LifeStage.CHILD:
                return this.creature.adultColor;
            default:
            case LifeStage.ADULT:
                return this.creature.adultColor;
            case LifeStage.ELDER:
                return this.determineElderColor();
            case LifeStage.DECEASED:
                return CreatureDefaults.DEATH_COLOR;
        }
    }

    determineElderColor = () => {
        let c = blendColors(this.creature.adultColor, CreatureDefaults.DEATH_COLOR, .5);
        return c;
    }

    determineChildSize = () => {
        // determine what percentage the child has grown to an adult
        let fullGrownAge = this.stageRanges.adult.range.start;

        // if they're not a child, return the full grown size
        if (this.age >= fullGrownAge) {
            return this.creature.adultSize;
        }

        // otherwise, determine the percent
        let growthFraction = this.age / fullGrownAge;

        // now determine the size
        let newSize = this.creature.adultSize * growthFraction;

        // don't let it be less than min
        let minSize = this.creature.adultSize * CreatureDefaults.CHILD_MIN_FRACTION;
        minSize = minSize < CreatureDefaults.CHILD_MIN ? CreatureDefaults.CHILD_MIN : minSize;
        if (newSize < minSize) {
            newSize = minSize;
        }

        // round and return
        return roundToPlace(newSize, 1);
    }

    determineAgeToStartGrowing = () => {
        let fullGrownAge = this.stageRanges.adult.range.start;

        // figure out growthFraction first
        let minSize = this.creature.adultSize * CreatureDefaults.CHILD_MIN_FRACTION;
        minSize = minSize < CreatureDefaults.CHILD_MIN ? CreatureDefaults.CHILD_MIN : minSize;
        let growthFraction = minSize / this.creature.adultSize;

        // now determine the age to get that big
        let age = growthFraction * fullGrownAge;

        return age;
    }

    determineElderSize = () => {
        let chipAwayAmount = roundToPlace(this.creature.adultSize * CreatureDefaults.ELDER_SHRINK, 1);

        return this.creature.adultSize - chipAwayAmount;
    }

    determineDeceasedSize = () => {
        let chipAwayAmount = roundToPlace(this.creature.adultSize * CreatureDefaults.DECEASED_SHRINK, 1);

        return this.creature.adultSize - chipAwayAmount;
    }

    updateSize = (newSize) => {
        this.creature.size = newSize;
        this.creature.width = newSize;
        this.creature.height = newSize;
    }

    determineLifeStage = () => {
        let ranges = [this.stageRanges.child, this.stageRanges.adult, this.stageRanges.elder, this.stageRanges.deceased];
        for (let i = 0; i < ranges.length; i++) {
            let s = ranges[i];
            if (this.age >= s.range.start && (s.range.end === null || this.age < s.range.end)) {
                return s.stage;
            }
        }
    }

    determineAge = () => {
        let now = Date.now();
        return now - this.birthTime;
    }

    determineInitialAge = (initialStage) => {
        switch(initialStage) {
            default:
            case LifeStage.CHILD:
                return this.stageRanges.child.range.start;
            case LifeStage.ADULT:
                return this.stageRanges.adult.range.start;
            case LifeStage.ELDER:
                return this.stageRanges.elder.range.start;
            case LifeStage.DECEASED:
                return this.stageRanges.deceased.range.start;
        }
    }

    determineLifeSpan = (range) => {
        let difference = range.high - range.low;
        let random = Math.floor(Math.random() * difference);
        let result = random + range.low;
        return result;
    }

    determineStageRange = (stage, lifeSpan, fractionAsChild, fractionAsElder) => {
        let childSpan = lifeSpan * fractionAsChild;
        let elderSpan = lifeSpan * fractionAsElder;
        let adultSpan = lifeSpan - childSpan - elderSpan;

        switch (stage) {
            case LifeStage.CHILD:
                return {
                    start: 0,
                    end: childSpan
                }
            case LifeStage.ADULT:
                return {
                    start: childSpan,
                    end: childSpan + adultSpan
                }
            case LifeStage.ELDER:
                return {
                    start: childSpan + adultSpan,
                    end: lifeSpan
                }
            case LifeStage.DECEASED:
                return {
                    start: lifeSpan,
                    end: null
                }
        }
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
        //console.log('moving creature');
        // if the creature is dead, don't move at all.
        if (this.creature.life.lifeStage === LifeStage.DECEASED) {
            return;
        }

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