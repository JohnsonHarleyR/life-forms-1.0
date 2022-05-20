import { LifeStage, ActionType, AmountNeeded, AddOrSubtract } from "../../../constants/creatureConstants";
import { roundToPlace } from "../../universalLogic";
import { doesPotentialMateExist } from "../creatureLogic";
import { 
    getAmountNeededDecimal,
    calculateAmountLostPerMs,
    calculateNewAmount,
    calculateSleepRecoveryPerMs
} from "./logic/needLogic";

export default class CreatureNeeds {
    constructor(creature, maxFood, maxSleep, maxMating, foodNeeded, sleepNeeded, matingNeeded) {
        this.creature = creature;

        this.maxFood = maxFood;
        this.maxSleep = maxSleep;
        this.maxMating = maxMating;

        this.foodDecayRate = getAmountNeededDecimal(foodNeeded);
        this.sleepDecayRate = getAmountNeededDecimal(sleepNeeded);
        this.matingDecayRate = getAmountNeededDecimal(matingNeeded);

        this.foodLostPerMs = calculateAmountLostPerMs(this.creature.life.msPerYear, this.maxFood, this.foodDecayRate);
        this.sleepLostPerMs = calculateAmountLostPerMs(this.creature.life.msPerYear, this.maxSleep, this.sleepDecayRate);
        this.matingLostPerMs = calculateAmountLostPerMs(this.creature.life.msPerYear, this.maxMating, this.matingDecayRate);

        this.sleepPerMs = calculateSleepRecoveryPerMs(maxSleep, this.creature.life.msPerYear);
        this.isSleeping = false;

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
        this.previousPriority = null;

        this.lastUpdate = Date.now();

    }

    updateNeeds = (creatures) => {
        let newUpdate = Date.now();
        //let timeLapsed = newUpdate - this.lastUpdate;

        // TODO determine how much the points have decayed
        let timeLapsed = newUpdate - this.lastUpdate;

        let foodPoints = this.foodLevel.points;
        let sleepPoints = this.sleepLevel.points;
        let matingPoints = this.matingLevel.points;

        // let foodPoints = calculateNewAmount(this.foodLevel.points, this.foodLostPerMs, timeLapsed, AddOrSubtract.SUBTRACT); // TODO change
        // let sleepPoints = calculateNewAmount(this.sleepLevel.points, this.sleepLostPerMs, timeLapsed, AddOrSubtract.SUBTRACT);
        // let matingPoints = calculateNewAmount(this.matingLevel.points, this.matingLostPerMs, timeLapsed, AddOrSubtract.SUBTRACT);

        // double check sleep - if the creature is sleeping then recalculate sleep amount
        if (this.isSleeping) {
            console.log(`creature ${this.creature.id} is sleeping`);
            sleepPoints = calculateNewAmount(this.sleepLevel.points, this.sleepPerMs, timeLapsed, AddOrSubtract.ADD);
            if (sleepPoints > this.maxSleep) {
                sleepPoints = this.maxSleep;
            }
        }

        // now update need levels
        this.updateNeedLevels(foodPoints, sleepPoints, matingPoints);

        this.displayCreatureNeedLevels();

        // make sure creature is still alive - DONE?
        
        // set previous priority before changing the priority
        this.previousPriority = this.priority;

        // set the priority based on new levels
        this.priority = this.determinePriority(creatures);
        console.log(`priority for ${this.creature.id}: ${this.priority}`);

        this.priorityComplete = false;
        // turn sleeping back off
        this.isSleeping = false;

        // set lastUpdate after all this
        this.lastUpdate = newUpdate;
    }

    displayCreatureNeedLevels = () => {
        console.log(`Need levels for creature ${this.creature.id}: \nFood: ${this.foodLevel.percent} ` +
        `\nSleep: ${this.sleepLevel.percent} \nMating: ${this.matingLevel.percent}`);
    }


    determinePriority = (creatures) => {
        // if the priority is not none, complete action? (consider)
        let possiblePriorities = this.getPriorityOrder();

        // loop through priorities and find the one that meets a condition
        let newPriority = ActionType.NONE;
        for (let i = 0; i < possiblePriorities.length; i++) {
            if (possiblePriorities[i].meetsCondition(creatures)) {
                newPriority = possiblePriorities[i].priority;
                break;
            }
        }

        // only set the new priority is priority is complete OR new priority is about death, falling asleep, running away
        if (!this.priorityComplete && (this.priority === ActionType.DIE ||
            (this.priority === ActionType.FEED_SELF && this.foodLevel.percent <= 15) || 
            this.priority === ActionType.LEAVE_SHELTER)) {
                return  this.priority;
            }

        // What as I doing with the above part again?

        // if the priority is complete or the priority does not equal previous, set priorityComplete to false;
        if (this.priorityComplete || newPriority !== this.priority) {
            this.priorityComplete = false;
        }
        //console.log(`Creature ${this.creature.id} priority: ${newPriority}`);
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
                        || this.foodLevel.points <= 0 || (this.creature.life.age > this.creature.life.lifeSpan)
                        || this.creature.life.LifeStage === LifeStage.DECEASED) {
                        return true;
                    }
                    return false;
                },
                priority: ActionType.DIE
            },
            { // if the creature is mating, make that the priority
                meetsCondition: () => {
                    if (this.creature.family.mate !== null && this.creature.lifeStage !== LifeStage.DECEASED && 
                        this.creature.mating.isMating === true) {
                            //console.log(`creature ${this.creature.id} is mating with ${this.creature.family.mate.id}`);
                        return true;
                    }
                    return false;
                },
                priority: ActionType.MATE
            },
            { // if the creature is pregnant, have a child
                meetsCondition: () => {
                    if (this.creature.mating.isPregnant) {
                        console.log(`creature ${this.creature.id} is having a child`);
                        return true;
                    }
                    return false;
                },
                priority: ActionType.HAVE_CHILD
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
            { // check if they're a target of a mate or they have a mating target - then prioritize finding that mate
                meetsCondition: () => {
                    if(this.creature.family.mate === null && 
                        this.creature.life.lifeStage !== LifeStage.DECEASED
                        && (this.creature.mating.hasMateTarget || this.creature.mating.isMateTarget)) {
                            return true;
                        }
                        return false;
                },
                priority: ActionType.FIND_MATE
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
                meetsCondition: (creatures) => {
                    if((this.creature.family.mate === null || 
                        this.creature.family.mate.life.lifeStage === LifeStage.DECEASED)
                        && doesPotentialMateExist(this.creature, creatures)) {
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
        this.foodLevel.percent = this.determineNeedPercent(foodPoints, this.maxFood);

        this.sleepLevel.points = sleepPoints;
        this.sleepLevel.percent = this.determineNeedPercent(sleepPoints, this.maxSleep);

        this.matingLevel.points = matingPoints;
        this.matingLevel.percent = this.determineNeedPercent(matingPoints, this.maxMating);
    }

    determineNeedPercent = (level, maxLevel) => {
        let divided = level / maxLevel;
        let percent = divided * 100;
        return (roundToPlace(percent, 2));
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