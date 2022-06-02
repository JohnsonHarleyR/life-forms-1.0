
import { CanvasInfo } from "../../../constants/canvasConstants";
import { getRandomStartPosition } from "../../universalLogic";

export const getRandomPlantStartPosition = (info, creatures, objects, plants, shelters, largestCreatureSize) => {
    let result = getRandomStartPosition(info, creatures, objects, plants, shelters, largestCreatureSize);
    let startX = result.x - (info.width / 2);
    let startY = result.y - (info.width / 2);
    return {xStart: startX, yStart: startY};
}