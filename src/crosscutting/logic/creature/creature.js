import { FoodType } from "../../constants/objectConstants";
import { MoveMode,
        Direction,
        LifeStage,
        CreatureDefaults,
        AmountNeeded,
        Gender,
        ActionType,
        NeedType } from "../../constants/creatureConstants";
import { 
    determineSightDirection,
    determineSightCoordinates
} from "./creatureLogic";
import { roundToPlace, millisecondsToMinutes, blendColors } from "../universalLogic";

export default class Creature {
    constructor({id, size, color, gender, type, lifeSpanRange, lifeStage, fractionAsChild, fractionAsElder,
        food, energy, sightRadius, sightDistance, position, speed, foodNeeded, sleepNeeded, matingNeeded,
        mother, father, targetPosition, setPlants, setCreatures, setShelters }) {
        this.showLines = true;

        // do not touch the stuff in the next paragraph - as in don't refactor
        this.id = id;
        this.type = type;
        this.adultSize = size;
        this.adultColor = color;
        this.gender = gender;
        this.life = new CreatureLife(this, lifeSpanRange, lifeStage, fractionAsChild, fractionAsElder);
        this.energy = energy;
        this.size = this.life.determineSize();
        this.width = this.size; // Necessary?
        this.height = this.size; // Necessary?
        this.color = this.life.determineColor();
        this.foodType = FoodType.PREY; // this will always be prey - it helps a predator determine if it's food or not - this is included in plants too


        this.safety = new CreatureSafety(this, null, false); // shelter and isBeingChased
        this.family = {
            mate: null,
            children: [],
            mother: mother,
            father: father
        };
    
        this.food = food; // what types of food does the creature eat? Two categories: plants and prey, both arrays

        this.inventory = {
            food: []
        };

        this.needs = new CreatureNeeds(this, foodNeeded, sleepNeeded, matingNeeded);

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
            energy: this.energy, // TODO consider decreasing energy amount for children, seniors, dead, etc. (Maybe have option to be vulture type? add that stuff later... as enhancements)
            life: this.life,
            family: this.family,
            safety: this.safety,
            needs: this.needs,
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
        //TODO check for predators in view
        this.safety.updateSafety();
        this.needs.updateNeeds();
        this.movement.move(this, objects, plants, creatures, CanvasInfo); // act

        return this.returnProperties();
    }

    // movement methods
}

class CreatureNeeds {
    constructor(creature, foodNeeded, sleepNeeded, matingNeeded) {
        this.creature = creature;

        this.maxFood = this.determineMaxAmount(foodNeeded); // min: 25, avg: 50, max: 75
        this.maxSleep = this.determineMaxAmount(sleepNeeded);
        this.maxMating = this.determineMaxAmount(matingNeeded);

        this.foodLevel = {
            points: this.maxFood / 2,
            percent: this.determineNeedPercent(this.maxFood / 2, this.maxFood)
        } 
        this.sleepLevel = {
            points: this.maxSleep / 2,
            percent: this.determineNeedPercent(this.maxSleep / 2, this.maxSleep)
        } 

        this.matingLevel = {
            points: creature.life.lifeStage !== LifeStage.CHILD ? this.maxMating / 2 : this.maxMating,
            percent: this.determineNeedPercent(creature.life.lifeStage !== LifeStage.CHILD ? this.maxMating / 2 : this.maxMating, this.maxMating)
        } 

        this.priority = this.determinePriority();

        this.lastUpdate = Date.now();

    }

    updateNeeds = () => {
        let newUpdate = Date.now();
        //let timeLapsed = newUpdate - this.lastUpdate;

        // TODO determine how much the points have decayed
        let foodPoints = this.foodLevel.points; // TODO change
        let sleepPoints = this.sleepLevel.points;
        let matingPoints = this.matingLevel.points;

        // now update need levels
        this.updateNeedLevels(foodPoints, sleepPoints, matingPoints);

        // make sure creature is still alive - DONE?

        // set the priority based on new levels
        this.priority = this.determinePriority();
        //console.log(`priority for ${this.creature.id}: ${this.priority}`);

        // set lastUpdate after all this
        this.lastUpdate = newUpdate;
    }


    determinePriority = () => {
        // if the priority is not none, complete action? (consider)
        let possiblePriorities = this.getPriorityOrder();

        // loop through priorities and find the one that meets a condition
        let newPriority = ActionType.NONE;
        for (let i = 0; i < possiblePriorities.length; i++) {
            if (possiblePriorities[i].meetsCondition()) {
                newPriority = possiblePriorities[i].priority;
                break;
            }
        }
        return newPriority;
    }

    getPriorityOrder = () => {
        

        // special priorities for  child and deceased
        if (this.creature.life.lifeStage === LifeStage.CHILD) {
            return this.getChildPriorityOrder();
        } else if (this.creature.life.lifeStage === LifeStage.DECEASED) {
            return [
                {
                    meetsCondition: () => {
                            return true;
                        },
                    priority: ActionType.NONE
                }
            ]
        }

        // otherwise return the default
        return [
            {
                // TODO write if statement for if creature is eaten
                meetsCondition: () => { // death condition - old age, hunger 0, or gets eaten
                    if ((this.creature.safety.isBeingChased && this.creature.safety.isBeingEaten)
                        || this.foodLevel.percent <= 0 || (this.creature.life.age > this.creature.life.lifeSpan)) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.DIE
            },
            {
                meetsCondition: () => { // if sleep is less than 5%, they are going to sleep no matter what...
                    if (this.sleepLevel.percent <= 5) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.SLEEP_IN_SPOT
            },
            { // check if creature needs to leave the shelter - mainly for growing up
                meetsCondition: () => {
                    if (this.creature.safety.isLeavingShelter) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.LEAVE_SHELTER
            },
            {
                meetsCondition: () => { // TODO also search for threat
                    if (this.creature.safety.isBeingChased || this.creature.safety.predatorDetected !== null) {
                        return  true;
                    }
                    return false;
                },
                priority: ActionType.FIND_SAFETY // in this case, if there is no shelter find it first!
            },
            {
                meetsCondition: () => {
                    if (this.foodLevel.percent <= 15) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.FEED_SELF
            },
            {
                meetsCondition: () => {
                    if (this.creature.safety.shelter === null) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.CREATE_SHELTER
            },
            {
                meetsCondition: () => { // if sleep is less than 10%
                    if (this.sleepLevel.percent <= 10) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.SLEEP_IN_SHELTER
            },
            {
                meetsCondition: () => {
                    if (this.foodLevel.percent <= 20 || 
                        this.determineFamilyFoodPercentAverage() <= 20) {
                            return true;
                        }
                        return false;
                },
                priority: ActionType.FEED_FAMILY
            },
            {
                meetsCondition: () => {
                    if (this.sleepLevel.percent <= 20) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.SLEEP_IN_SHELTER
            },
            {
                meetsCondition: () => {
                    if (this.foodLevel.percent <= 60 || 
                        this.determineFamilyFoodPercentAverage() <= 60) {
                            return true;
                        }
                        return false;
                },
                priority: ActionType.FEED_FAMILY
            },
            {
                meetsCondition: () => {
                    if(this.creature.family.mate === null || 
                        this.creature.family.mate.life.lifeStage === LifeStage.DECEASED) {
                            return true;
                        }
                        return false;
                },
                priority: ActionType.FIND_MATE
            },
            {
                meetsCondition: () => { // if sleep is less than 10%
                    if (this.sleepLevel.percent <= 60) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.SLEEP_IN_SHELTER
            },
            {
                meetsCondition: () => {
                    if (this.matingLevel.percent <= 50) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.MATE
            },
            {
                meetsCondition: () => {
                    if (this.foodLevel.percent <= 80 || 
                        this.determineFamilyFoodPercentAverage() <= 80) {
                            return true;
                        }
                        return false;
                },
                priority: ActionType.FEED_FAMILY
            },
            {
                meetsCondition: () => { // if sleep is less than 10%
                    if (this.sleepLevel.percent <= 80) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.SLEEP_IN_SHELTER
            },
            {
                meetsCondition: () => {
                    if (this.foodLevel.percent <= 90 || 
                        this.determineFamilyFoodPercentAverage() <= 90) {
                            return true;
                        }
                        return false;
                },
                priority: ActionType.FEED_FAMILY
            },
            {
                meetsCondition: () => {
                    if (this.matingLevel.percent <= 80) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.MATE
            },
            {
                meetsCondition: () => { // if sleep is less than 10%
                    if (this.sleepLevel.percent <= 95) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.SLEEP_IN_SHELTER
            },
            {
                meetsCondition: () => {
                    return true;
                },
                priority: ActionType.NONE
            }
        ];
    }

    getChildPriorityOrder = () => {
        return [
            {
                // TODO write if statement for if creature is eaten
                meetsCondition: () => { // death condition - old age, hunger 0, or gets eaten
                    if ((this.creature.safety.isBeingChased && this.creature.safety.isBeingEaten)
                        || this.foodLevel.percent <= 0) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.DIE
            },
            {
                meetsCondition: () => { // if sleep is less than 5%, they are going to sleep no matter what...
                    if (this.sleepLevel.percent < 5) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.SLEEP_IN_SPOT
            },
            {
                meetsCondition: () => { // food less than 20%;
                    if (this.foodLevel.percent < 20 && 
                        this.creature.safety.shelter !== null && 
                        this.creature.safety.shelter.inventory.food.length > 0) { // also check that there is food in shelter - a child should always have a shelter, otherwise they will die
                        return true;
                    }
                    return false;
                },
                priority: ActionType.FEED_SELF
            },
            {
                meetsCondition: () => { // sleep less than 20%;
                    if (this.sleepLevel.percent <= 20) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.SLEEP_IN_SHELTER
            },
            {
                meetsCondition: () => { // food less than equal to sleep;
                    if (this.foodLevel.percent <= this.sleepLevel.percent && 
                        this.creature.safety.shelter !== null && 
                        this.creature.safety.shelter.inventory.food.length > 0) { // also check that there is food in shelter - a child should always have a shelter, otherwise they will die
                        return true;
                    }
                    return false;
                },
                priority: ActionType.FEED_SELF
            },
            {
                meetsCondition: () => {
                    if (this.sleepLevel.percent < 100) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.SLEEP_IN_SHELTER
            },
            {
                meetsCondition: () => {
                    // if it gets to this point
                    return true;
                },
                priority: ActionType.NONE
            }
        ]
    }

    updateNeedLevels = (foodPoints, sleepPoints, matingPoints) => {
        this.foodLevel.points = foodPoints;
        this.foodLevel.percent = this.determineNeedPercent(foodPoints);

        this.sleepLevel.points = sleepPoints;
        this.sleepLevel.percent = this.determineNeedPercent(sleepPoints);

        this.matingLevel.points = matingPoints;
        this.matingLevel.percent = this.determineNeedPercent(matingPoints);
    }

    determineNeedPercent = (level, maxLevel) => {
        let divided = level / maxLevel;
        let percent = divided * 100;
        return (roundToPlace(percent, 2));
    }

    determineMaxAmount = (amountNeeded) => {
        switch(amountNeeded) {
            case AmountNeeded.MIN:
                return 25;
            default:
            case AmountNeeded.AVG:
                return 50;
            case AmountNeeded.MAX:
                return 75;
        }
    }

    
    determineFamilyFoodPercentAverage = () => {
        let memberCount = 0;
        let foodTotal = 0;

        // parents don't live with family (unless elder? For now they don't so don't worry about them--YET)
        // ACTUALLY, just add all family members. If they live in that shelter, count them.
        let members = [this.creature.family.mate];
        this.creature.family.children.forEach(c => { // don't feel grown children
            members.push(c);
        });
        members.push(this.creature.family.mother);
        members.push(this.creature.family.father);

        // loop through members
        members.forEach(m => {
            if (m !== null && m.life.lifeStage !== LifeStage.DECEASED && 
                m.safety.shelter === this.creature.safety.shelter) {
                    memberCount++;
                    foodTotal += m.needs.foodLevel.percent;
                }
        })

        // find the average and return
        let average = foodTotal / memberCount;
        return average;

    }
}

class CreatureSafety {
    constructor(creature, shelter, isBeingChased) {
        this.creature = creature;

        this.shelter = shelter;
        this.isInShelter = false;
        this.isLeavingShelter = false;

        this.predatorDetected = null;
        this.isBeingChased = isBeingChased;
        this.isBeingEaten = false;
    }

    updateSafety = () => {

    }

    // TODO write method to check if creature is inside of shelter
    isInShelter = () => {

    }
}

class CreatureLife { // TODO - make the creature grow up - and perform actions if they do
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
        let newStage = this.determineLifeStage();
        if (newStage !== this.lifeStage && this.lifeStage === LifeStage.CHILD && newStage === LifeStage.ADULT) {
            this.creature.safety.isLeavingShelter = true;
        }
        this.lifeStage = newStage;
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
        let def = this.creature.adultColor;

        switch(this.creature.gender) {
            case Gender.MALE:
                def = blendColors(def, CreatureDefaults.MALE_COLOR, CreatureDefaults.GENDER_BLEND_AMOUNT);
                break;
            case Gender.FEMALE:
                def = blendColors(def, CreatureDefaults.FEMALE_COLOR, CreatureDefaults.GENDER_BLEND_AMOUNT);
                break;
            default:
                break;
        }

        switch (this.lifeStage) {
            case LifeStage.CHILD:
                return def;
            default:
            case LifeStage.ADULT:
                return def;
            case LifeStage.ELDER:
                return this.determineElderColor(def);
            case LifeStage.DECEASED:
                return this.determineDeceasedColor(def);
        }
    }

    determineElderColor = (def) => {
        let c = blendColors(def, CreatureDefaults.DEATH_COLOR, .5);
        return c;
    }

    determineDeceasedColor = (def) => {
        let c = blendColors(def, CreatureDefaults.DEATH_COLOR, .9);
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