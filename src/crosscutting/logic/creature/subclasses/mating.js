import { isPotentialMate } from "../creatureLogic";
import { LifeStage, Gender } from "../../../constants/creatureConstants";
import { getRandomIntInRange } from "../../universalLogic";
export default class CreatureMating {
    constructor(creature, genderOfProvider, genderOfCaregiver, genderOfShelterMaker,
        pregnancyTerm, minOffspring, maxOffspring) {
        this.creature = creature;

        this.genderOfProvider = genderOfProvider;
        this.genderOfCaregiver = genderOfCaregiver;
        this.genderOfShelterMaker = genderOfShelterMaker;

        this.isMating = false;

        this.isPregnant = false;
        this.pregnancyTerm = pregnancyTerm;
        this.offspringCount = null;

        this.minOffspring = minOffspring;
        this.maxOffspring = maxOffspring;

        this.hasMateTarget = false;
        this.mateTarget = null;
        this.isMateTarget = false;
        this.mateTargetOf = null;
    }

    updateMating = () => {
        this.checkIfMateStillAlive();
        this.checkIfStillMateTarget();
        this.checkIfStillMating();
    }

    produceOffspring = () => {
        console.log(`creature ${this.creature.id} producing offspring with ${this.creature.family.mate.id}`);
        if (this.creature.gender === Gender.FEMALE) {
            // if female, make them pregnant
            this.isPregnant = true;
            // get random number of offspring
            let newOffspringCount = getRandomIntInRange(this.minOffspring, this.maxOffspring);
            this.offspringCount = newOffspringCount;
            console.log(`creature ${this.creature.id} is female and is now pregnant and will produce ${newOffspringCount} children`);
        }
        // turn off mating
        this.isMating = false;
    }

    haveChild = () => {
        console.log(`Creature ${this.creature.id} is giving birth. Offspring left: ${this.offspringCount}`);
        if (this.isPregnant && this.offspringCount > 0) {
            // TODO create child
            this.offspringCount--;
            console.log(`having child - ${this.offspringCount} left`);
        } else if (this.isPregnant && this.offspringCount === 0) {
            console.log(`creature ${this.creature.id} has 0 children left to birth - stopping pregnancy`);
            this.isPregnant = false;
            this.offspringCount = null;
        }
    }

    makeMate = (newMate) => {
        // make sure they haven't already been given a mate 
        if (this.creature.family.mate === null) {
            // first make them each other's mate
            this.creature.family.mate = newMate;
            newMate.family.mate = this.creature;
            this.updateMating();
            newMate.mating.updateMating();
            
            // determine whose shelter to make the main shelter
            if (this.genderOfShelterMaker === this.creature.gender) {
                // first remove the mates shelter from the mate
                let mateShelter = newMate.safety.shelter;
                if (mateShelter !== null) {
                    mateShelter.removeMemberFromShelter(newMate);
                    mateShelter.updateShelter();
                }

                // now add members to this creatures shelter
                let shelter = this.creature.safety.shelter;
                if (shelter !== null) {
                    shelter.addMemberToShelter(newMate);
                    shelter.updateShelter();
                }
            } else {
                // first remove creature from their shelter
                let shelter = this.creature.safety.shelter;
                if (shelter !== null) {
                    shelter.removeMemberFromShelter(this.creature);
                    shelter.updateShelter();
                }

                // now add members to this creatures shelter
                let mateShelter = newMate.safety.shelter;
                if (mateShelter !== null) {
                    mateShelter.addMemberToShelter(this.creature);
                    mateShelter.updateShelter();
                }
            }
            
            // set is mating
            this.isMating = true;
            newMate.mating.isMating = true;

        }

    }

    makeMateTarget = (newMate) => {
        this.hasMateTarget = true;
        this.mateTarget = newMate;

        newMate.mating.isMateTarget = true;
        newMate.mating.mateTargetOf = this.creature;
    }

    checkIfMateStillAlive = () => {
        if (this.creature.family.mate !== null &&
            (this.creature.life.lifeStage === LifeStage.DECEASED ||
            this.creature.family.mate.life.lifeStage === LifeStage.DECEASED)) {
            this.creature.family.mate = null;
        }
    }

    checkIfStillMateTarget = () => {
        if (this.creature.family.mate !== null) { // cancel targeting if creature has a mate
            if (this.isMateTarget) {
                this.isMateTarget = false;
                this.mateTargetOf = null;
            }

            if (this.hasMateTarget) {
                this.hasMateTarget = false;
                this.mateTarget = null;
            }

        } else { // if there's no mate but they are a target/have a target, ensure that target is still an option
            if (this.hasMateTarget) {
                if (!isPotentialMate(this.creature, this.mateTarget)) {
                    this.hasMateTarget = false;
                    this.mateTarget = null;
                }
            }

            if (this.isMateTarget) {
                if (!isPotentialMate(this.creature, this.mateTargetOf)) {
                    this.isMateTarget = false;
                    this.mateTargetOf = null;
                }
            }
        }
    }

    checkIfStillMating = () => {
        if (this.isMating) {
            if (this.isPregnant || 
                (this.creature.family.mate !== null && this.creature.family.mate.mating.isPregnant) || 
                this.creature.life.lifeStage === LifeStage.DECEASED) {
                    this.isMating = false;
                }
        }
    }
}