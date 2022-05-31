import { CreatureArray } from "../../../../constants/creatureConstants";


export const isPredator = (predator, creature) => {
    let creatureType = creature.type;

    let preyTypes = predator.food.prey;
    for (let i = 0; i < preyTypes.length; i++) {
        if (preyTypes[i] === creatureType) {
            return true;
        }
    }
    return false;
}