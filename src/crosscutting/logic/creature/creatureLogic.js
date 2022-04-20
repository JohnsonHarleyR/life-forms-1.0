
export const getSightLineInfo = (creature) => {
    let lineInfo = {
        xStart: creature.position.x,
        yStart: creature.position.y,
        xEnd: creature.targetPosition.x,
        yEnd: creature.targetPosition.y
    };
    return lineInfo;
}