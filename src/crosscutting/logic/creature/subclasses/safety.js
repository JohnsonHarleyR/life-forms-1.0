import { getListOfPredators, isPredatorInSight, isPredatorChasing } from "./logic/safetyLogic";

export default class CreatureSafety {
    constructor(creature, shelter, isBeingChased) {
        this.creature = creature;

        this.shelter = shelter;
        this.isInShelter = false;
        this.isLeavingShelter = false;

        this.predatorsDetected = [];
        this.isBeingChased = isBeingChased;
        this.isBeingEaten = false;
    }

    updateSafety = (creatures) => {
        // scan for predators 
        this.scanForPredators(creatures);

        // update shelter is there is a shelter
        if (this.shelter !== null) {
            this.shelter.updateShelter();
        }
    }

    isPredatorDetected = () => {
        if (this.predatorsDetected.length > 0) {
            return true;
        }
        return false;
    }

    scanForPredators = (creatures) => {
        // if creature is inside shelter then they are safe
        if (this.shelter !== null && this.shelter.isPositionInsideThisShelter(this.creature.position)) {
            this.predatorsDetected = [];
            this.isBeingChased = false;
        } else {

            let possiblePredators = getListOfPredators(this.creature.type, creatures);
            this.isBeingChased = this.isBeingChased ? true : false;
            this.predatorsDetected = [];
            possiblePredators.forEach(p => {
                if (isPredatorInSight(this.creature, p)) {
                    this.predatorsDetected.push(p);
                    if (isPredatorChasing(this.creature, p)) {
                        this.isBeingChased = true;
                    }
                }
            });
        }


    }

}