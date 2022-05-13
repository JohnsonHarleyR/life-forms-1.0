import { CanvasInfo, Axis } from "../constants/canvasConstants";
import { Corner, Side } from "../constants/objectConstants";
import { Direction } from "../constants/creatureConstants";

// time and rounding methods
export const minutesToMilliseconds = (minutes) => {
    let minuteMilliseconds = Math.round(1000 * 60 * minutes);
    return minuteMilliseconds;
}

export const millisecondsToMinutes = (milliseconds) => {
    let minutes = milliseconds / 1000 / 60;
    let secondsRemainder = (minutes - Math.floor(minutes)) * 60;
    minutes = Math.floor(minutes);
    let millisecondsRemainder = (secondsRemainder - Math.floor(secondsRemainder)) * 1000;
    let seconds = Math.floor(secondsRemainder);
    let ms = Math.round(millisecondsRemainder);
    return `${minutes } min, ${seconds} sec, ${ms} ms`;
}

export const roundToPlace = (number, decimalPlaces) => {
    let timesAmount = decimalPlaces === 0 ? 1 : Math.pow(10, decimalPlaces);
    let newNumber = number * timesAmount;
    newNumber = Math.round(newNumber);
    newNumber = newNumber / timesAmount;
    return newNumber;
}

// color methods
// 0 is exactly color A, 1 is exactly color B
export const blendColors = (colorA, colorB, amount) => {
    const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
    const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
    const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
    const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
    const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
    return '#' + r + g + b;
}

// adding and removing items
export const addItemToArray = (item, array, setFunction) => {
    if (!item || !array || !setFunction) {
        return false;
    }

    let arrayCopy = [...array];
    arrayCopy.push(item);
    setFunction(arrayCopy);

    return true;
}

export const removeItemFromArray = (itemId, array, setFunction) => {
    if (!itemId || !array || !setFunction) {
        return false;
    }

    let didFind = false;
    let arrayCopy = array.map(a => {
        if (a.id !== itemId) {
            return a;
        } else {
            didFind = true;
        }
    });
    setFunction(arrayCopy);

    return didFind;
}


// position and collision methods

export const isInPosition = (currentPosition, newPosition) => {
    if (currentPosition.x === newPosition.x && 
      currentPosition.y === newPosition.y) {
        return true;
      }
    return false;
  }

export const getPositionDifference = (startPosition, endPosition) => {
    let xDifference = endPosition.x - startPosition.x;
    let yDifference = endPosition.y - startPosition.y;
    return {
        xDifference: xDifference,
        yDifference: yDifference
    };
};

export const getCenterPosition = (xStart, yStart, width, height) => {
    let halfWidth = width / 2;
    let halfHeight = height / 2;
    let x = xStart + halfWidth;
    let y = yStart + halfHeight;
    return {x: x, y: y};
}

export const getStartAndEndPoints = (id, position, width, height) => { 
    let halfWidth = width / 2;
    let halfHeight = height / 2;
    let xStart = position.x - halfWidth;
    let xEnd = position.x + halfWidth;
    let yStart = position.y - halfHeight;
    let yEnd = position.y + halfHeight;
    return {
        id: id,
        width: width,
        height: height,
        position: position,
        xStart: xStart,
        xEnd: xEnd,
        yStart: yStart,
        yEnd: yEnd
    }
}

export const getObjectStartAndEndPoints = (obj) => { 
    return {
        id: obj.id,
        width: obj.width,
        height: obj.height,
        position: obj.position,
        xStart: obj.xStart,
        xEnd: obj.xEnd,
        yStart: obj.yStart,
        yEnd: obj.yEnd
    }
}

export const getArrayOfCorners = (creationInfo) => {
    let sae = getStartAndEndPoints(creationInfo.position, creationInfo.width, creationInfo.height);
    let corners = [
        getCornerObject(Corner.TOP_LEFT,sae.xStart, sae.yStart),
        getCornerObject(Corner.TOP_RIGHT, sae.xEnd, sae.yStart),
        getCornerObject(Corner.BOTTOM_RIGHT, sae.xStart, sae.yEnd),
        getCornerObject(Corner.BOTTOM_RIGHT, sae.xEnd, sae.yEnd)
    ];
    return corners;
}

const getCornerObject = (corner, x, y) => {
    return {
        name: corner,
        x: x,
        y: y
    }
}

export const addCornerSidesToArray = (corner, array) => {
    switch (corner.name) {
        case Corner.TOP_LEFT:
          array.push(Side.TOP);
          array.push(Side.LEFT);
          break;
        case Corner.TOP_RIGHT:
          array.push(Side.TOP);
          array.push(Side.RIGHT);
          break;
        case Corner.BOTTOM_LEFT:
          array.push(Side.BOTTOM);
          array.push(Side.LEFT);
          break;
        case Corner.BOTTOM_RIGHT:
          array.push(Side.BOTTOM);
          array.push(Side.RIGHT);
          break;
      }
    return array;
}

export const isOnCanvas = (points) => {
    let width = CanvasInfo.WIDTH;
    let height = CanvasInfo.HEIGHT;
    if (points.xStart < 0 || points.xEnd >= width || points.yStart < 0 || points.yEnd >= height) {
        return false;
    }
    return true;
}

export const getRandomStartPosition = (info, creatures, objects, plants, shelters, largestCreatureSize = 0, excludeCreatureId = null, checkForPlants = true) => {
    let maxX = CanvasInfo.WIDTH - (info.width); // this prevents going over edge
    let maxY = CanvasInfo.HEIGHT - (info.height);
  
    let isCollision = true;
    let randomPosition = null;
    do {
        let x = Math.floor((Math.random() * maxX));
        let y = Math.floor((Math.random() * maxY));
        randomPosition = {x: x, y: y};
        let creationInfo = {id: null, position: randomPosition, width: info.width, height: info.height};
  
      // validate position
      isCollision = isAnyCollision(creationInfo, creatures, objects, plants, shelters, largestCreatureSize, excludeCreatureId, checkForPlants);
  
    } while (isCollision);
  
    return randomPosition;
}



export const isAnyCollision = (creationInfo, creatures, objects, plants, shelters,
    largestCreatureSize = 0, excludeCreatureId = null, checkForPlants = true, isShelterAndObject = false) => {
    let id = creationInfo.id ? creationInfo.id : null;
    let creationPoints = getStartAndEndPoints(id, creationInfo.position, creationInfo.width, creationInfo.height);

    if (!isOnCanvas(creationPoints)) {
        return true;
    }

    // loop through each one
    //console.log('checking objects');
    let result = checkAnyArrayCollision(creationPoints, objects, largestCreatureSize);
    if (result.isCollision) {
        return true;
    }
    //console.log('checking plants');
    if (checkForPlants) {
        result = checkAnyArrayCollision(creationPoints, plants, largestCreatureSize);
        if (result.isCollision) {
            return true;
        }
    }
    //console.log('checking shelters');
    result = checkAnyArrayCollision(creationPoints, shelters, largestCreatureSize);
    if (result.isCollision) {
        return true;
    }

    // THIS IS SPECIFICALLY FOR IF THE COLLISION BEING CHECKED IS FOR A CREATURE
    if (excludeCreatureId) {
        let creaturesCopy = [];
        creatures.forEach(c => {
            if (c.id !== excludeCreatureId) {
                creaturesCopy.push(c);
            }
        });
        //console.log(`checking creatures without id ${excludeCreatureId}`);
        result = checkAnyArrayCollision(creationPoints, creaturesCopy, largestCreatureSize);
    } else {
        //console.log('checking creatures');
        result = checkAnyArrayCollision(creationPoints, creatures, largestCreatureSize);
    }
    // it's the last check so return the result
    return result.isCollision;
}

// idForSmaller is in case we want to specify which item to count as "smaller"
//(mainly for creature object collisions in case an object is smaller than the creature)
export const checkAnyArrayCollision = (creationPoints, array, padding = CanvasInfo.OBJECT_PADDING, idForSmaller = null) => {
    let result = false;
    let collidedWith = null;
    let pointsToCollide = null;
    let smallerId = idForSmaller;
    for (let i = 0; i < array.length; i++) {
        let a = array[i];
        let id = a.id ? a.id : null;
        let comparePoints = getStartAndEndPoints(id, a.position, a.width, a.height);
        let collisionResult = isCollision(creationPoints, comparePoints, padding, idForSmaller)
        if(collisionResult.isCollision) {
            result = true;
            collidedWith = a;
            pointsToCollide = collisionResult.collisionPoints;
            smallerId = collisionResult.smallId;
            break;
        }
    }
    return {
        isCollision: result,
        smallerId: smallerId,
        pointsOfCollision: pointsToCollide,
        collidedWith: collidedWith
    };
}

export const isOverlap = (smallerPoints, obj) => {
    let isOverlap = false;
    let overlapSides = [];

    let sidesToCheck = getSidesForOverlapMethod(smallerPoints);

    // check all positions along smaller edges for if position is on object
    sidesToCheck.forEach(s => {
        if (isAxisPositionInObjectRange(s.axis, s.otherCoord, obj)) {

            for (let i = 0; i < s.length; i++) {
                let position = {x: null, y: null};
                switch (s.axis) {
                    case Axis.X:
                        position.x = s.startCoord + i;
                        position.y = s.otherCoord;
                        break;
                    case Axis.Y:
                        position.y = s.startCoord + i;
                        position.x = s.otherCoord;
                        break;
                    default:
                        throw "Error in isOverlap. No x or y axis specified.";
                }
                let isOnObject = isPositionOnObject(position, obj);
                if (isOnObject) {
                    isOverlap = true;
                    overlapSides.push({
                        point: s.side,
                        x: position.x,
                        y: position.y
                    });
                }
            }
        }
    });
    return {
        isOverlap: isOverlap,
        overlapSides: overlapSides
    }
}

const isAxisPositionInObjectRange = (axis, coord, obj) => {
    switch (axis) {
        case Axis.X:
            if (coord >= obj.yStart && coord <= obj.yEnd) {
                return true;
            }
            return false;
        case Axis.Y:
            if (coord >= obj.xStart && coord <= obj.xEnd) {
                return true;
            }
            return false;
        default:
            throw "Error in isAxisPositionInObjectRange. Invalid axis specified.";
    }
}

const getSidesForOverlapMethod = (smallerPoints) => {
    let width = smallerPoints.width;
    let height = smallerPoints.height;
    let array =
    [
        {
            side: Side.TOP,
            axis: Axis.X,
            startCoord: smallerPoints.xStart,
            otherCoord: smallerPoints.yStart,
            length: width
        },
        {
            side: Side.BOTTOM,
            axis: Axis.X,
            startCoord: smallerPoints.xStart,
            otherCoord: smallerPoints.yEnd,
            length: width
        },
        {
            side: Side.LEFT,
            axis: Axis.Y,
            startCoord: smallerPoints.yStart,
            otherCoord: smallerPoints.xStart,
            length: height
        },
        {
            side: Side.RIGHT,
            axis: Axis.Y,
            startCoord: smallerPoints.yStart,
            otherCoord: smallerPoints.xEnd,
            length: height
        }
    ];
    return array;
}

export const isPositionOnObject = (position, objectStartAndEndPoints) => {
    if (position.x >= objectStartAndEndPoints.xStart &&
        position.x <= objectStartAndEndPoints.xEnd && 
        position.y >= objectStartAndEndPoints.yStart &&
        position.y <= objectStartAndEndPoints.yEnd) {
            return true;
    }
    
    return false;
}


// idForSmaller is in case we want to specify which item to count as "smaller"
//(mainly for creature object collisions in case an object is smaller than the creature)
export const isCollision = (creation1, creation2, padding = CanvasInfo.OBJECT_PADDING, idForSmaller = null) => {

    let creation1Points = getStartAndEndPoints(creation1.id, creation1.position, creation1.width, creation1.height);
    let creation2Points = getStartAndEndPoints(creation2.id, creation2.position, creation2.width, creation2.height);

    let creationsBySize = determineLargest(creation1Points, creation2Points);

    if (idForSmaller !== null && creation1Points.id === idForSmaller) {
        creationsBySize.large = creation2Points;
        creationsBySize.small = creation1Points;
    } else if (idForSmaller !== null && creation2Points.id === idForSmaller) {
        creationsBySize.large = creation1Points;
        creationsBySize.small = creation2Points;
    }

    let result = compareLargeAndSmallForCollisionCheck(creationsBySize, padding);

    // if the collision resulted false, switch creationsBySize just to double check collision
    if (!result.isCollision) {
        // let creationsBySizeSwitched = switchCreationsBySize(creationsBySize);
        // result = compareLargeAndSmallForCollisionCheck(creationsBySizeSwitched, padding);

        // try using the isOverlap method
        let overlapResult = isOverlap(creationsBySize.small, creationsBySize.large);
        if (overlapResult.isOverlap) {
            result.isCollision = overlapResult.isOverlap;
            result.collisionPoints = overlapResult.overlapSides;
            result.collidedWith = creationsBySize.large;
            result.smallId = creationsBySize.small.id;
        }

    }

    return result;

}

const compareLargeAndSmallForCollisionCheck = (creationsBySize, padding) => {
    let large = {...creationsBySize.large};
    let small = getCollisionCheckPoints({...creationsBySize.small});

    let halfPadding = padding / 2;
    large.xStart = large.xStart - halfPadding;
    large.xEnd = large.xEnd + halfPadding;
    large.yStart = large.yStart - halfPadding;
    large.yEnd = large.yEnd + halfPadding;

    let collision = false;
    let collisionPoints = [];
    for (let i = 0; i < small.length; i++) {
        let point = small[i];
        if (isPositionOnObject(point, large)) {
            collision = true;
            collisionPoints.push(point);
        }
        // if (point.x >= large.xStart && point.x <= large.xEnd && 
        //     point.y >= large.yStart && point.y <= large.yEnd) {
        //         collision = true;
        //         collisionPoints.push(point);
        //     }
    }
    return {
        isCollision: collision,
        collisionPoints: collisionPoints,
        collidedWith: large,
        smallId: creationsBySize.small.id
    };
}

const switchCreationsBySize = (creationsBySize) => {
    let large = creationsBySize.small;
    let small = creationsBySize.large;
    creationsBySize.large = large;
    creationsBySize.small = small;
    return creationsBySize;
}

const determineLargest = (creation1, creation2) => {
    let creation1Area = creation1.width * creation1.height;
    let creation2Area = creation2.width * creation2.height;

    if (creation1Area > creation2Area) {
        return {
            large: creation1,
            small: creation2
        };
    } else {
        return {
            large: creation2,
            small: creation1
        }
    }
}

const getCollisionCheckPoints = ({xStart, xEnd, yStart, yEnd, width, height}) => {

    let points = [];

    let halfWidth = width / 2;
    let halfHeight = height / 2;

    //let quarterWidth = halfWidth / 2;
    //let threeQuarterWidth = width - quarterWidth;

    //let quarterHeight = halfHeight / 2;
    //let threeQuarterHeight = height - quarterHeight;

    points.push({ // 0
        point: Corner.TOP_LEFT,
        x: xStart,
        y: yStart
    });

    points.push({ // 1
        point: Side.TOP,
        x: xStart + halfWidth,
        y: yStart
    });

    points.push({ // 2
        point: Corner.TOP_RIGHT,
        x: xEnd,
        y: yStart
    });

    points.push({ // 3
        point: Side.LEFT,
        x: xStart,
        y: yStart + halfHeight
    });

    points.push({ // 4
        point: Side.CENTER,
        x: xStart + halfWidth,
        y: yStart + halfHeight
    });

    points.push({ // 5
        point: Side.RIGHT,
        x: xEnd,
        y: yStart + halfHeight
    });

    points.push({ // 6
        point: Corner.BOTTOM_LEFT,
        x: xStart,
        y: yEnd
    });

    points.push({ // 7
        point: Side.BOTTOM,
        x: xStart + halfWidth,
        y: yEnd
    });

    points.push({ // 8
        point: Corner.BOTTOM_RIGHT,
        x: xEnd,
        y: yEnd
    });

    return points;
}

export const getTriangleMovePosition = (
    currentPosition,
    xTotal,
    xDirection,
    yTotal,
    yDirection,
    speed
  ) => {
    if (!xTotal || !yTotal) {
      return currentPosition;
    }
  
    // console.log(
    //   `xDirection: ${xDirection}, yDirection: ${yDirection}, speed: ${speed}`
    // );
  
    //console.log(`xTotal: ${xTotal}, yTotal: ${yTotal}`);
    let zTotal = Math.sqrt(Math.pow(xTotal, 2) + Math.pow(yTotal, 2));
  
    //console.log(`zTotal: ${zTotal}`);
    let ratio = speed / zTotal;
  
    let xDistance = xTotal * ratio;
    let yDistance = yTotal * ratio;
  
    let x =
      xDirection === Direction.EAST
        ? currentPosition.x + xDistance
        : currentPosition.x - xDistance;
  
    let y =
      yDirection === Direction.SOUTH
        ? currentPosition.y + yDistance
        : currentPosition.y - yDistance;
  
  
    //console.log(`new Y: ${y}`);
    // TODO consider adding an offet to this for the sake of sight direction stuff
  
    return { x: Math.round(x), y: Math.round(y) };
  };

export const determineAxisBySide = (side) => {
    if (!side) {
        throw "Side is null or undefined for determineAxisBySide.";
      }
      if (side === Side.TOP || side === Side.BOTTOM) {
        return Axis.X;
      }
      return Axis.Y;
}

export const getCornerPositionFromStartAndEndPoints = (cornerName, points) => {
    let position = {
        x: null,
        y: null
    }
    switch (cornerName) {
        case Corner.TOP_LEFT:
            position.x = points.xStart;
            position.y = points.yStart;
            break;
        case Corner.TOP_RIGHT:
            position.x = points.xEnd;
            position.y = points.yStart;
            break;
        case Corner.BOTTOM_LEFT:
            position.x = points.xStart;
            position.y = points.yEnd;
            break;
        case Corner.BOTTOM_RIGHT:
            position.x = points.xEnd;
            position.y = points.yEnd;
            break;
        default:
            break;
    }

    return position;
}