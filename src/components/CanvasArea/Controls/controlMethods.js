
import { updateCreatures } from "../Canvas/canvasMethods";

export const addCreatureToCanvas = (gender, typeInfo, objects, plants, shelters, setCreatures, setPlants, setShelters) => {
    let index = creatures.length;
    let randomPosition = getRandomCreatureStartPosition(info, creatures, objects, plants, shelters);
    let creature = new Creature({id: `cc${index}`, gender: gender, lifeStage: lifeStage, position: randomPosition, 
        mother: mother, father: father, targetPosition: randomPosition, setPlants: setPlants, setCreatures: setCreatures, setShelters: setShelters, ...typeInfo });

    let creaturesCopy = [...creatures];
    creaturesCopy.push(creature);
    updateCreatures(creaturesCopy, setCreatures);
}