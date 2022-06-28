
import { CanvasInfo } from "../../../../crosscutting/constants/canvasConstants"
import { CreationDefaults } from "../../../../crosscutting/constants/creationConstants";
import { CreatureDefaults } from "../../../../crosscutting/constants/creatureConstants"
import { drawBox, fillBackground } from "../../../../crosscutting/logic/canvasLogic";
import CreationCanvasClass from "../subclasses/creationCanvasInfo"

//#region Creation Canvas Logic

export const createCreationCanvasClass = (xTiles, yTiles) => {
  let newCanvas = new CreationCanvasClass(xTiles, yTiles);
  return newCanvas;
}

export const renderCreationCanvas = (canvasRef, creationCanvas) => {
  // fill background
  fillBackground(canvasRef.current, CanvasInfo.BG_COLOR);

  // render all the tiles
  renderGridTiles(canvasRef, creationCanvas);
}

const renderGridTiles = (canvasRef, creationCanvas) => {
  for (let y = 0; y < creationCanvas.grid.length; y++) {
    let row = creationCanvas.grid[y];
    for (let x = 0; x < row.length; x++) {
      let tile = row[x];
      renderTile(canvasRef, tile);
    }
  }
}

const renderTile = (canvasRef, tileInfo) => {
  // first draw outer tile lines
  let color = tileInfo.isSelected
    ? CreationDefaults.OUTER_SELECTED_COLOR
    : CreationDefaults.OUTER_TILE_COLOR;
  let thickness = CreationDefaults.OUTER_TILE_LINE_THICKNESS;

  drawBox(canvasRef.current, color, thickness,
    tileInfo.xStartO, tileInfo.xEndO,
    tileInfo.yStartO, tileInfo.yEndO);

  // draw inner tile lines
  color = CreationDefaults.INNER_TILE_COLOR;
  thickness = CreationDefaults.INNER_TILE_LINE_THICKNESS;
  drawBox(canvasRef.current, color, thickness,
    tileInfo.xStartI, tileInfo.xEndI,
    tileInfo.yStartI, tileInfo.yEndI);

  // draw object fill
  if (tileInfo.isColoredIn) {
    color = tileInfo.objectColor;
    let positions = tileInfo.getColorFillPositions();
    let ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(positions.xStart, positions.yStart,
      positions.width, positions.height);
    ctx.closePath();
  }

}


//#endregion

//#region Tile Logic

export const findTileCoordinate = (tileLength, mousePosition) => {
    return Math.floor(mousePosition / tileLength);
}

export const determineOuterTileSize = () => {
  let size = determineInnerTileSize() + (2 * getInnerTileOffset());
  return size;
}

export const determineInnerTileSize = () => {
  return CreatureDefaults.LARGEST_SIZE;
}

export const getInnerTileOffset = () => {
  return CanvasInfo.OBJECT_PADDING + 1;
}

// Tile position determining
export const determineOuterTileStartPos = (index, outerSize) => {
  return index * outerSize;
}

//#endregion