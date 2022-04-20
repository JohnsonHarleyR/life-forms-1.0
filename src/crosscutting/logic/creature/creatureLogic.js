import { getRandomStartPosition } from "../universalLogic";


export const getSightLineInfo = (creature) => {
    let lineInfo = {
        xStart: creature.position.x,
        yStart: creature.position.y,
        xEnd: creature.targetPosition.x,
        yEnd: creature.targetPosition.y
    };
    return lineInfo;
}

// position methods

export const getRandomCreatureStartPosition = (info, creatures, objects, plants, shelters) => {
    let result = getRandomStartPosition(info, creatures, objects, plants, shelters);
    return result;
}