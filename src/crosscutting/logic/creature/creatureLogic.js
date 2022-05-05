import { 
    getRandomStartPosition,
    getPositionDifference
} from "../universalLogic";
import { Direction } from "../../constants/creatureConstants";


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
    let passInfo = {width: info.size, height: info.size};
    let result = getRandomStartPosition(passInfo, creatures, objects, plants, shelters);
    return result;
}

const setCreatureDirectionByTargetPosition = (creature) => {
    let dif = getPositionDifference(creature.position, creature.targetPosition);
    creature.setDirection(dif.xDifference, dif.yDifference);
}


// methods about creature sight
export const determineSightDirection = (creature) => {
    let m = creature.movement;

    let creatureDirection = m.direction;
    let creaturePosition = creature.position;
    let targetPosition = m.targetPosition;
    // check to see if there is only one direction listed - if so, return that
    if (creatureDirection.x && !creatureDirection.y) {
        return creatureDirection.x;
    } else if (creatureDirection.y && !creatureDirection.x) {
        return creatureDirection.y;
    } else if (!creatureDirection.x && !creatureDirection.y) {
      // if neither are there then figure out the direction based on the target
        setCreatureDirectionByTargetPosition(creature);
        if (m.direction.x === null && m.direction.y === null) { // if still null, just return a default direction of south
        return Direction.SOUTH;
        }
    }

    // otherwise determine the one furthest from the target because the diagonal will be skewed in that direction
    // TODO find out if there's a way to rotate the sight
    let xDistance = Math.abs(creaturePosition.x - targetPosition.x);
    let yDistance = Math.abs(creaturePosition.y - targetPosition.y);
    if (xDistance >= yDistance) { // let x be default in case of tie
        return creatureDirection.x;
    } else {
        return creatureDirection.y;
    }
}

export const determineSightCoordinates = (creature, sightDirection, canvasInfo) => {
    let m = creature.movement;

    let xStart = null;
    let xEnd = null;
    let yStart = null;
    let yEnd = null;
    let width = null;
    let height = null;

    let sightDiameter = m.sightRadius * 2;

    switch (sightDirection) {
        case Direction.NORTH:
            width = sightDiameter;
            xStart = creature.position.x - m.sightRadius;
            xEnd = xStart + width;
            height = m.sightDistance;
            yStart = creature.position.y - height;
            yEnd = creature.position.y;
            break;
        case Direction.SOUTH:
            width = sightDiameter;
            xStart = creature.position.x - m.sightRadius;
            xEnd = xStart + width;
            height = m.sightDistance;
            yStart = creature.position.y;
            yEnd = creature.position.y + height;
            break;
        case Direction.WEST:
            width = m.sightDistance;
            xStart = creature.position.x - width;
            xEnd = creature.position.x;
            height = sightDiameter;
            yStart = creature.position.y - m.sightRadius;
            yEnd = yStart + sightDiameter;
            break;
        case Direction.EAST:
            width = m.sightDistance;
            xStart = creature.position.x;
            xEnd = creature.position.x + width;
            height = sightDiameter;
            yStart = creature.position.y - m.sightRadius;
            yEnd = yStart + sightDiameter;
            break;
    }

    // if any values are over edge, adjust them
    if (yStart < 0) {
        yStart = 0;
        height = yEnd;
    }

    if (yEnd > canvasInfo.HEIGHT) {
        yEnd = canvasInfo.HEIGHT - 1;
        height = yEnd - yStart;
    }

    if (xStart < 0) {
        xStart = 0;
        width = xEnd;
    }

    if (xEnd > canvasInfo.WIDTH) {
        xEnd = canvasInfo.WIDTH - 1;
        width = xEnd - xStart;
    }

    // return result
    let result = offsetValues(m.sightOffset, width, height, xStart, xEnd, yStart, yEnd);


    return result;
}

const offsetValues = (offset, width, height, xStart, xEnd, yStart, yEnd) => {
    if (!offset) {
        offset = {
            x: 0,
            y: 0
        };
    }
    //console.log(`sight offset: ${JSON.stringify(offset)}`);
    let result = {
        width: width,
        height: height,
        xStart: xStart + offset.x,
        xEnd: xEnd + offset.x,
        yStart: yStart + offset.y,
        yEnd: yEnd + offset.y
    };
    return result;
}