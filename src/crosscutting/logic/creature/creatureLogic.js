import { 
    getRandomStartPosition,
    getPositionDifference,
    getStartAndEndPoints,
    isAnyCollision,
    checkAnyArrayCollision
} from "../universalLogic";
import { Direction, ActionType, NeedType, MoveMode, Gender, LifeStage } from "../../constants/creatureConstants";
import { ShelterLine } from "../../constants/canvasConstants";


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
    creature.movement.setDirection(dif.xDifference, dif.yDifference);
}

// creature Corners



// methods about creature sight
export const determineSightDirection = (creature) => {
    let m = creature.movement;

    let creatureDirection = m.direction;
    let creaturePosition = creature.position;
    let targetPosition = creature.targetPosition;
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

export const getPositionInNewDirection = (creature, direction) => {
    let newX = creature.position.x;
    let newY = creature.position.y;
    switch (direction) {
      case Direction.NORTH:
        newY = creature.position.y - creature.movement.speed;
        break;
      case Direction.SOUTH:
        newY = creature.position.y + creature.movement.speed;
        break;
      case Direction.WEST:
        newX = creature.position.x - creature.movement.speed;
        break;
      case Direction.EAST:
        newX = creature.position.x + creature.movement.speed;
        break;
      default:
        break;
    }
    return {
      x: newX,
      y: newY
    };
  };

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

// predator/prey logic
export const getListOfPredators = (preyType, creatures) => {
    let predators = [];
    creatures.forEach(c => {
        if (c.food.prey.includes(preyType)) {
            predators.push(c);
        }
    });
    return predators;
}

export const isPredatorInSightOrChasing = (creature, predator, canvasInfo) => {
    if (isPredatorInSight(creature, predator, canvasInfo) || 
        (predator.currentTarget !== null && predator.currentTarget.id === creature.id)) {
            return true;
        }
    return false;
}

export const isPredatorInSight = (creature, predator, canvasInfo) => {
    let sightCoords = creature.movement.getSightCoords(canvasInfo);
    return isInSight(sightCoords, predator);
}

export const isPreyInSight = (creature, prey, canvasInfo) => {
    let sightCoords = creature.movement.getSightCoords(canvasInfo);
    return isInSight(sightCoords, prey);
}

// sight logic
export const isInSight = (sightCoords, item) => {
    let iPoints = getStartAndEndPoints(item.id, item.position, item.width, item.height);
    if ((iPoints.xStart >= sightCoords.xStart && iPoints.xEnd <= sightCoords.xEnd) &&
    (iPoints.yStart >= sightCoords.yStart && iPoints.yEnd <= sightCoords.yEnd)) {
        return true;
    }
    return false;
}
export const checkSightAreaForItemInArray = (creature, items, canvasInfo) => {
    let sightCoords = creature.movement.getSightCoords(canvasInfo);
    let didSeeTarget = false;
    let targetsSeen = [];
    items.forEach(i => {
        if (isInSight(sightCoords, i)) {
            didSeeTarget = true;
            targetsSeen.push(i);
        }
    });

    return {
        didSeeTarget: didSeeTarget,
        targetsSeen: targetsSeen
    };
}

// mating logic
export const getOppositeGender = (gender) => {
    switch(gender) {
        case Gender.MALE:
            return Gender.FEMALE;
        case Gender.FEMALE:
            return Gender.MALE;
        default:
            return null;
    }
}
export const doesPotentialMateExist = (creature, allCreatures) => {
    let result = false;
    allCreatures.forEach(c => {
        if (isPotentialMate(creature, c)) {
            result = true;
        }
    });
    return result;
}

export const isPotentialMate = (creature, otherCreature) => {
    if (creature.type === otherCreature.type &&
        otherCreature.gender === getOppositeGender(creature.gender) &&
        otherCreature.family.mate === null && 
        otherCreature.life.lifeStage === LifeStage.ADULT) {
            return true;
        }
    return false;
}


// shelter logic
export const getRandomShelterPosition = (creature, creatures, objects, shelters) => {
    let shelterSize = creature.size * ShelterLine.MULTIPLIER;
    let shelterInfo = {width: shelterSize, height: shelterSize};
    // don't worry about plants
    let position = null;
    do {
        position = getRandomStartPosition(shelterInfo, creatures, objects, [], shelters, 0, null, false);
    } while (!canSetShelterInPosition(position, creature, creatures, objects, shelters));

    return position;
}

export const canSetShelterInPosition = (position, creature, creatures, objects, shelters) => {
    let shelterSize = creature.adultSize * ShelterLine.MULTIPLIER;
    let creationInfo = {id: null, position: position, width: shelterSize, height: shelterSize};
    let collisionResult = isAnyCollision(creationInfo, creatures, objects, [], shelters, 0, creature.id, false);

    // if the result is still false, also loop through creatures - if they are setting up shelter, check their target position
    if (!collisionResult) {
        let futureShelters = [];
        creatures.forEach(c => {
            if (c.id !== creature.id && c.needs.priority === ActionType.CREATE_SHELTER 
                && c.movement.moveMode === MoveMode.SEARCH && c.targetType ==NeedType.SHELTER) {
                let futureShelterSize = c.adultSize * ShelterLine.MULTIPLIER;
                let futureShelter = {id: null, position: c.targetPosition, width: futureShelterSize, height: futureShelterSize};
                futureShelters.push(futureShelter);
            }
        });
        if (futureShelters.length > 0) {
            let creationPoints = getStartAndEndPoints(null, creationInfo.position, creationInfo.width, creationInfo.height);
            collisionResult = checkAnyArrayCollision(creationPoints, futureShelters, 2).isCollision;
        }
    }

    // if the result 
    return !collisionResult;
}