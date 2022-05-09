import {
    getArrayOfCorners,
    addCornerSidesToArray,
    getStartAndEndPoints } from "../universalLogic";
import { Side } from "../../constants/objectConstants";

export const checkCreatureObjectCollision = (creationInfo, newPosition, objects) => {
    let creationPoints = getStartAndEndPoints(creationInfo.position, creationInfo.width, creationInfo.height);

    
}

export const checkAllCreatureObjectCollisions = (creature, newPosition, objects) => {
    let endResult = {
        didCollide: false,
        objectCollided: null,
        collisionSide: null
    }
    for (let i = 0; i < objects.length; i++) {
        let obj = objects[i];
        let result = isCreatureObjectCollision(creature, newPosition, obj);
        if (result.isCollision) {
            endResult.didCollide = true;
            endResult.objectCollided = obj;
            endResult.collisionSide = result.collisionSide;
            break;
        }
    }
    return endResult;
}

export const isCreatureObjectCollision = (creature, newPosition, obj) => {
    let creatureCornersStart = getArrayOfCorners(
        {
            position: creature.position,
            width: creature.width,
            height: creature.height
        });

    let creatureCorners = getArrayOfCorners(
        {
            position: newPosition,
            width: creature.width,
            height: creature.height
        });

    let result = false;
    let corners = [];
    let cornerSides = [];

    for (let i = 0; i < creatureCorners.length; i++) {
        let corner = creatureCorners[i];
        let startCorner = creatureCornersStart[i];

        if (
            corner.x >= obj.xStart &&
            corner.x <= obj.xEnd &&
            corner.y >= obj.yStart &&
            corner.y <= obj.yEnd
        ) {
    
            corners.push(startCorner);
            addCornerSidesToArray(corner, cornerSides);
    
            result = true;
        }
    }

    let collisionSide = null;
    if (result === true) {
        let objPositions = {
            xStart: obj.xStart,
            xEnd: obj.xEnd,
            yStart: obj.yStart,
            yEnd: obj.yEnd
    };
    collisionSide = determineCollisionSideByCorners(corners, cornerSides,objPositions);
    if (!collisionSide) {
        console.log(`Phantom collision object: ${JSON.stringify(objPositions)}`);
        result = false;
    }
    }
    return {
        isCollision: result,
        collisionSide: collisionSide
    };
}

export const determineCollisionSideByCorners = (corners, cornerSides, objPositions) => {

    // if there's more than one corner, use that to decide
    if (corners.length > 1) {
        let mostFrequent = getMostFrequentSide(cornerSides);
        let collisionSide = getOppositeSide(mostFrequent)
        return collisionSide;
    }


    // otherwise, use the one corner to determine
    console.log( `corners: ${corners.length}`);
    let corner = corners[0];
    let position = {x: corner.x, y: corner.y};
    let result = null;
    cornerSides.forEach(s => {
      // if a side was not over an axis before the collision but is over after, then that's the side it collided with
      // it will be the opposite of that side of the corner
        let isOverAxisBeforeCollision = isOverAxis(s, objPositions, position);
        if (!isOverAxisBeforeCollision) {
            result = getOppositeSide(s);
        }
    })
    if (result) {
        return result;
    }
    console.log("No collision side could be determined.");
    return null;
    //throw "No collision side could be determined.";
}

const getOppositeSide = (side) => {
    switch (side){
      case Side.TOP:
        return Side.BOTTOM;
      case Side.BOTTOM:
        return Side.TOP;
      case Side.LEFT:
        return Side.RIGHT;
      case Side.RIGHT:
        return Side.LEFT;
      default:
        throw 'No opposite side could be determined.';
    }
  }
  
  const isOverAxis = (side, objPositions, position) => {
    switch (side) {
      case Side.BOTTOM:
        if (position.y >= objPositions.yStart) {
          return true;
        }
        return false;
      case Side.TOP:
        if (position.y <= objPositions.yEnd) {
          return true;
        }
        return false;
      case Side.RIGHT:
        if (position.x >= objPositions.xStart) {
          return true;
        }
        return false;
      case Side.LEFT:
        if (position.x <= objPositions.xEnd) {
          return true;
        }
        return false;
      default:
        throw "cound not determine if side was over the axis."
    }
  }
  
  const getMostFrequentSide = (sides) => {
    let side = null;
    let count = 0;
  
    let possible = [Side.TOP, Side.LEFT, Side.RIGHT, Side.BOTTOM];
    possible.forEach(p => {
      let newCount = 0;
      sides.forEach(s => {
        if (p === s) {
          newCount++;
        }
        if (newCount > count) {
          side = p;
          count = newCount;
        }
      })
    });
    return side;
  }