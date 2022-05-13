import {
    getArrayOfCorners,
    addCornerSidesToArray,
    getStartAndEndPoints,
    getCreatureObjectCollisionInfo,
    checkAnyArrayCollision,
    getObjectStartAndEndPoints,
    isCollision,
  determineAxisBySide,
getCornerPositionFromStartAndEndPoints } from "../universalLogic";
import { Side, Corner } from "../../constants/objectConstants";
import { Direction } from "../../constants/creatureConstants";
import { Axis } from "../../constants/canvasConstants";

export const checkCreatureObjectCollision = (creationInfo, newPosition, objects) => {
    let creationPoints = getStartAndEndPoints(creationInfo.position, creationInfo.width, creationInfo.height);

    
}

export const checkAllCreatureObjectCollisions = (creature, newPosition, objects) => {
    let endResult = {
        didCollide: false,
        objectCollided: null,
        collisionSide: null
    }
    let creaturePoints = getStartAndEndPoints(creature.id, newPosition, creature.width, creature.height);
    let prevCreaturePoints = getStartAndEndPoints(creature.id, creature.position, creature.width, creature.height);


    // isCollision: yes or no
    // smallerId: id of the smaller object colliding
    //pointsOfCollision: points on the creature where there is a collision
    //collidedWith: object collided with
    let result = checkAnyArrayCollision(creaturePoints, objects, 3, creature.id);
    // for (let i = 0; i < objects.length; i++) {
    //     let obj = objects[i];
    //     let result = isCreatureObjectCollision(creature, newPosition, obj);
    //     if (result.isCollision) {
    //         endResult.didCollide = true;
    //         endResult.objectCollided = obj;
    //         endResult.collisionSide = result.collisionSide;
    //         break;
    //     }
    // }
    
    endResult.didCollide = result.isCollision;
    endResult.objectCollided = result.collidedWith;

    if (endResult.didCollide) { // determine object's side of collision if there was a collision 
      let points = [];
      result.pointsOfCollision.forEach(p => points.push(p.point));
        //console.log(`creature ${result.smallerId} collided with object ${result.collidedWith.id} at points: ${points}`);

        // first add all corners and sides and cornerSides to arrays
        let corners = [];
        let sides = [];
        //let cornerSides = [];
        result.pointsOfCollision.forEach(p => {
          if (isCorner(p.point)) {
            let newPos = getCornerPositionFromStartAndEndPoints(p.point, prevCreaturePoints);
            corners.push({
              name: p.point,
              x: newPos.x,
              y: newPos.y
            });
            //addCornerSidesToArray(p, cornerSides);
          } else if (isSide(p.point) && !sides.includes(p.point)) {
            sides.push(p.point);
          }
        });

        // get start and end points of the object
        let obj = result.collidedWith;
        let objStartAndEndPositions = getObjectStartAndEndPoints(obj);

        // now determine collision side by the above info
        endResult.collisionSide = determineCollisionSideByCollidingPoints(corners, sides, objStartAndEndPositions);
    }

    return endResult;
}

const isCorner = (point) => {
  switch (point) {
    case Corner.TOP_LEFT:
    case Corner.TOP_RIGHT:
    case Corner.BOTTOM_LEFT:
    case Corner.BOTTOM_RIGHT:
      return true;
    default:
      return false;
  }
}

const isSide = (point) => { // does not count center points
  switch (point) {
    case Side.TOP:
    case Side.LEFT:
    case Side.RIGHT:
    case Side.BOTTOM:
      return true;
    default:
      return false;
  }
}

export const isCreatureObjectCollision = (creature, newPosition, obj) => {

    let creaturePoints = getStartAndEndPoints(creature.id, creature.position, creature.width, creature.height);
    let newCreaturePoints = getStartAndEndPoints(creature.id, newPosition, creature.width, creature.height);

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
    collisionSide = determineCollisionSideByCollidingPoints(corners, cornerSides, objPositions);
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


// determine which side of an object a creature/other collided with
export const determineCollisionSideByCollidingPoints = (corners, sides, objPositions) => {


  let initialSide = null;

  // if there is a side in sides, that is going to be the side of interest
  if (sides.length > 0) {
    initialSide = sides[0];
  }

    if (initialSide) {
      return getOppositeSide(initialSide);
    }

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
    let cornerSides = [];
    cornerSides = addCornerSidesToArray(corner, cornerSides);
    cornerSides.forEach(s => {
      // if a side was not over an axis before the collision but is over after, then that's the side it collided with
      // it will be the opposite of that side of the corner
        let isOverAxisBeforeCollision = isOverAxis(s, objPositions, position);
        if (!isOverAxisBeforeCollision) {
            initialSide = s;
        }
    })
    if (initialSide) {
        return getOppositeSide(initialSide);
    }

    // if there's still no initial side and cornerSides is not empty,
    // that means it might be a tie so just return the first one?
    if (cornerSides.length > 0) {
      console.log(`Tie for collision side - choosing side ${cornerSides[0]}`);
      initialSide = cornerSides[0];
    }

    if (initialSide) {
      return getOppositeSide(initialSide);
  }

    console.log("No collision side could be determined.");
    return null;
    //throw "No collision side could be determined.";
}


export const determineDirectionByTarget = (creature, objectSide, obj, canvasInfo) => {
  // determine the axis of the side - if it's x axis that's top or bottom, y is left or right
  let axis = determineAxisBySide(objectSide);

  // attempt to grab travel direction based on target distance from each corner
  let direction = getDirectionByCornerDistancesToTarget(obj, objectSide, axis, creature.targetPosition);

  // if it was null or anything attempt to grab direction from creature directions
  if (!direction) {
    if (axis === Axis.X) {
      direction = creature.movement.direction.x;
    } else if (axis === Axis.Y) {
      direction = creature.movement.direction.y;
    }
    console.log(`direction by creature direction: ${direction}`);
  }

    // if the direction is still null, choose a direction by the side furthest from the wall
    if (!direction) {
      direction = chooseDirectionByFurthestSideFromWall(axis, obj, canvasInfo);
      console.log(`direction based on side furthest from wall: ${direction}`);
    }
  
    // if it's still null, just choose a default...
    if (!direction) {
      direction = chooseDirectionByAxisDefault(axis);
      console.log(`choosing default direction: ${direction}`);
    }
    
    return direction;

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

  export const getDirectionByCornerDistancesToTarget = (obj, collisionSide, axis, targetPosition) => {
    let cornerA = null;
    let cornerB = null;
    switch (collisionSide) {
      case Side.TOP:
        cornerA = Corner.TOP_LEFT;
        cornerB = Corner.TOP_RIGHT;
        break;
      case Side.BOTTOM:
        cornerA = Corner.BOTTOM_LEFT;
        cornerB = Corner.BOTTOM_RIGHT;
        break;
      case Side.LEFT:
        cornerA = Corner.TOP_LEFT;
        cornerB = Corner.BOTTOM_LEFT;
        break;
      case Side.RIGHT:
        cornerA = Corner.TOP_RIGHT;
        cornerB = Corner.BOTTOM_RIGHT;
        break;
      default:
        throw "no side was passed into getDirectionCornerTargetDifference.";
    }
  
    let cornerAPos = getObjectCornerPosition(obj, cornerA);
    let cornerBPos = getObjectCornerPosition(obj, cornerB);
  
    let cornerADif = getPositionDifferenceFromCorner(axis, cornerAPos, targetPosition);
    let cornerBDif = getPositionDifferenceFromCorner(axis, cornerBPos, targetPosition);
  
    let cornerToMoveToward = null;
    if (cornerADif < cornerBDif) {
      cornerToMoveToward = cornerA;
    } else if (cornerBDif < cornerADif) {
      cornerToMoveToward = cornerB;
    }
    console.log(`moving to corner: ${cornerToMoveToward}`);
  
    // now use the gathered info to find the direction
    return determineDirectionByAxisAndCorner(axis, cornerToMoveToward);
  }

  const getPositionDifferenceFromCorner = (axis, cornerPos, position) => {
    let cornerNum;
    let positionNum;
    if (axis === Axis.X) {
      cornerNum = cornerPos.x;
      positionNum = position.x;
    } else {
      cornerNum = cornerPos.y;
      positionNum = position.y;
    }
    return Math.abs(cornerNum - positionNum);
  }

  export const getObjectCornerPosition = (obj, corner) => {
    let position = null;
    switch (corner) {
      case Corner.TOP_LEFT:
        position = {
          x: obj.xStart,
          y: obj.yStart
        };
        break;
      case Corner.TOP_RIGHT:
        position = {
          x: obj.xEnd,
          y: obj.yStart
        };
        break;
      case Corner.BOTTOM_LEFT:
        position = {
          x: obj.xStart,
          y: obj.yEnd
        };
        break;
      case Corner.BOTTOM_RIGHT:
        position = {
          x: obj.xEnd,
          y: obj.yEnd
        };
        break;
      default:
        break;
    }
    return position;
  }

  const determineDirectionByAxisAndCorner = (axis, corner) => {
    switch (corner) {
      case Corner.TOP_LEFT:
        if (axis === Axis.X) {
          return Direction.WEST;
        } else if (axis === Axis.Y) {
          return Direction.NORTH;
        }
        break;
      case Corner.TOP_RIGHT:
        if (axis === Axis.X) {
          return Direction.EAST;
        } else if (axis === Axis.Y) {
          return Direction.NORTH;
        }
        break;
      case Corner.BOTTOM_LEFT:
        if (axis === Axis.X) {
          return Direction.WEST;
        } else if (axis === Axis.Y) {
          return Direction.SOUTH;
        }
        break;
      case Corner.BOTTOM_RIGHT:
        if (axis === Axis.X) {
          return Direction.EAST;
        } else if (axis === Axis.Y) {
          return Direction.SOUTH;
        }
        break;
      default:
        break;
    }
    return null;
  }

  const chooseDirectionByAxisDefault = (axis) => {
    if (axis === Axis.X) {
      return Direction.EAST;
    } else if (axis === Axis.Y) {
      return Direction.SOUTH;
    }
    throw "Error: no valid axis value in chooseDirectionByDefault method.";
  }

  const chooseDirectionByFurthestSideFromWall = (axis, obj, canvasInfo) => {
    let direction = null;
    if (axis === Axis.X) {
      let topPos = obj.yStart;
      let topDif = topPos; // it would be the top minus 0
      let bottomPos = obj.yEnd;
      let bottomDif = canvasInfo.HEIGHT - bottomPos;
      if (topDif < bottomDif) {
        direction = Direction.NORTH;
      } else if (bottomDif < topDif) {
        direction = Direction.SOUTH;
      }
    } else {
      let leftPos = obj.xStart;
      let leftDif = leftPos; // it would be left minus 0
      let rightPos = obj.xEnd;
      let rightDif = canvasInfo.WIDTH - rightPos;
      if (leftDif < rightDif) {
        direction = Direction.WEST;
      } else if (rightDif < leftDif) {
        direction = Direction.EAST;
      }
    }
  
    // if it's still null that means no direction could be determined this way.
    return direction;
  }