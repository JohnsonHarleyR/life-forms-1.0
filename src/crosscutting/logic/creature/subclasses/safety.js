export default class CreatureSafety {
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
        // update shelter is there is a shelter
        if (this.shelter !== null) {
            this.shelter.updateShelter();
        }
    }

    // TODO write method to check if creature is inside of shelter
    isInShelter = () => {

    }
}