import { CanvasInfo } from "../constants/canvasConstants";

export const getCenterPosition = (xStart, yStart, width, height) => {
    let halfWidth = width / 2;
    let halfHeight = height / 2;
    let x = xStart + halfWidth;
    let y = yStart + halfHeight;
    return {x: x, y: y};
}

export const getStartAndEndPoints = (position, width, height) => { 
    let halfWidth = width / 2;
    let halfHeight = height / 2;
    let xStart = position.x - halfWidth;
    let xEnd = position.x + halfWidth;
    let yStart = position.y - halfHeight;
    let yEnd = position.y + halfHeight;
    return {
        width: width,
        height: height,
        position: position,
        xStart: xStart,
        xEnd: xEnd,
        yStart: yStart,
        yEnd: yEnd
    }
}

export const isOnCanvas = ({startX, endX, startY, endY}) => {
    let width = CanvasInfo.WIDTH;
    let height = CanvasInfo.HEIGHT;
    if (startX < 0 || endX >= width || startY < 0 || endY >= height) {
        return false;
    }
    return true;
}

export const getRandomStartPosition = (info, creatures, objects, plants, shelters, largestCreatureSize = 0, excludeCreatureId = null) => {
    let maxX = CanvasInfo.WIDTH - (info.width); // this prevents going over edge
    let maxY = CanvasInfo.HEIGHT - (info.height);
  
    let isCollision = true;
    let randomPosition = null;
    do {
        let x = Math.floor((Math.random() * maxX));
        let y = Math.floor((Math.random() * maxY));
        randomPosition = {x: x, y: y};
        let creationInfo = {position: randomPosition, width: info.width, height: info.height};
  
      // validate position
      isCollision = isAnyCollision(creationInfo, creatures, objects, plants, shelters, largestCreatureSize, excludeCreatureId);
  
    } while (isCollision);
  
    return randomPosition;
}

export const isAnyCollision = (creationInfo, creatures, objects, plants, shelters, largestCreatureSize = 0, excludeCreatureId = null) => {
    let creationPoints = getStartAndEndPoints(creationInfo.position, creationInfo.width, creationInfo.height);

    if (!isOnCanvas({...creationPoints})) {
        return true;
    }

    // loop through each one
    console.log('checking objects');
    if (checkAnyArrayCollision(creationPoints, objects, largestCreatureSize)) {
        return true;
    }
    console.log('checking plants');
    if (checkAnyArrayCollision(creationPoints, plants, largestCreatureSize)) {
        return true;
    }
    console.log('checking shelters');
    if (checkAnyArrayCollision(creationPoints, shelters, largestCreatureSize)) {
        return true;
    }

    // THIS IS SPECIFICALLY FOR IF THE COLLISION BEING CHECKED IS FOR A CREATURE
    let result;
    if (excludeCreatureId) {
        let creaturesCopy = creatures.map(c => {
            if (c.id !== excludeCreatureId) {
                return c;
            }
        });
        console.log(`checking creatures without id ${excludeCreatureId}`);
        result = checkAnyArrayCollision(creationPoints, creaturesCopy, largestCreatureSize);
    } else {
        console.log('checking creatures');
        result = checkAnyArrayCollision(creationPoints, creatures, largestCreatureSize);
    }
    // it's the last check so return the result
    return result;
}

const checkAnyArrayCollision = (creationPoints, array, padding = 0) => {
    for (let i = 0; i < array.length; i++) {
        let a = array[i];
        let comparePoints = getStartAndEndPoints(a.position, a.width, a.height);
        if(isCollision(creationPoints, comparePoints, padding)) {
            return true;
        }
    }
    return false;
}


export const getCollisionInfo = () => { // TODO write method - this will include corner information

}



export const isCollision = (creation1, creation2, padding = 0) => {

    let creation1Points = getStartAndEndPoints(creation1.position, creation1.width, creation1.height);
    let creation2Points = getStartAndEndPoints(creation2.position, creation2.width, creation2.height);

    let creationsBySize = determineLargest(creation1Points, creation2Points);

    let large = creationsBySize.large;
    let small = getCollisionCheckPoints({...creationsBySize.small});

    let halfPadding = padding / 2;
    large.xStart = large.xStart - halfPadding;
    large.xEnd = large.xEnd + halfPadding;
    large.yStart = large.yStart - halfPadding;
    large.yEnd = large.yEnd + halfPadding;

    let collision = false;
    for (let i = 0; i < small.length; i++) {
        let point = small[i];
        if (point.x >= large.xStart && point.x <= large.xEnd && 
            point.y >= large.yStart && point.y <= large.yEnd) {
                collision = true;
                break;
            }
    }
    return collision;
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

    points.push({ // 0
        x: xStart,
        y: yStart
    });

    points.push({ // 1
        x: xStart + halfWidth,
        y: yStart
    });

    points.push({ // 2
        x: xEnd,
        y: yStart
    });

    points.push({ // 3
        x: xStart,
        y: yStart + halfHeight
    });

    points.push({ // 4
        x: xStart + halfWidth,
        y: yStart + halfHeight
    });

    points.push({ // 5
        x: xEnd,
        y: yStart + halfHeight
    });

    points.push({ // 6
        x: xStart,
        y: yEnd
    });

    points.push({ // 7
        x: xStart + halfWidth,
        y: yEnd
    });

    points.push({ // 8
        x: xEnd,
        y: yEnd
    });

    return points;
}