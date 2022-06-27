import { determineOuterTileSize } from "../logic/creationLogic";
import TileClass from "./tileInfo";


export default class CreationCanvasClass {
  constructor(xTiles, yTiles, objectColor = "#000000") {
    this.xTiles = xTiles;
    this.yTiles = yTiles;

    this.objectColor = this.objectColor;

    this.grid = this.createNewTileGrid();

    this.width = determineOuterTileSize() * this.xTiles;
    this.height = determineOuterTileSize() * this.yTiles;
  }

  getTile = (x, y) => {
    let row = this.grid[y];
    let tile = row[x];
    return tile;
  }

  createNewTileGrid = () => {
    let newGrid = [];
    for (let y = 0; y < this.yTiles; y++) {
      let row = [];
      for (let x = 0; x < this.xTiles; x++) {
        let newTile = new TileClass(x, y);
        row.push(newTile);
      }
      newGrid.push(row);
    }

    return newGrid;
  }

}