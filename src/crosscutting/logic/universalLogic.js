
export const getCenterPosition = (xStart, yStart, width, height) => {
    let halfWidth = width / 2;
    let halfHeight = height / 2;
    let x = xStart + halfWidth;
    let y = yStart + halfHeight;
    return {x: x, y: y};
}

export const getStartAndEndPoints = (center, width, height) => { // TODO write thiss
    let halfWidth = width / 2;
    let halfHeight = height / 2;
    let xStart = center.x - halfWidth;
    let xEnd = center.x + halfWidth;
    let yStart = center.y - halfHeight;
    let yEnd = center.y + halfHeight;
    return {
        xStart: xStart,
        xEnd: xEnd,
        yStart: yStart,
        yEnd: yEnd
    }
}

