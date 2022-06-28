import React, {useRef, useState, useEffect, useContext} from 'react';
import {
    createCreationCanvasClass,
    getEmptySelectedIndicator,
    getEmptySelectorArray,
    isSameGridPosition,
    renderCreationCanvas,
} from '../logic/creationLogic';
import { LifeContext } from '../../../../Context/LifeContext';
import { getMousePos } from '../../../../crosscutting/logic/canvasLogic';

const CreationCanvas = ({xTiles, yTiles}) => {
    
    // TODO method to set the chosen creature

    const canvasRef = useRef();
    const addObjectRef = useRef();
    
    const {} = useContext(LifeContext);
    const [creationCanvas, setCreationCanvas] // TODO allow updates to this with tiles
        = useState(createCreationCanvasClass(xTiles, yTiles));

    const [canSelectTile, setCanSelectTile] = useState(true);

    const [selectorIndex, setSelectorIndex] = useState(0);
    const [selectedTiles, setSelectedTiles] = useState(getEmptySelectorArray());
    
    const [objectColor, setObjectColor] = useState("#000000");
    const [canFinishObject, setCanFinishObject] = useState(false);
    const [isObjectFinished, setIsObjectFinished] = useState(false);

    // TODO button for completing object

    useEffect(() => {
        if (creationCanvas) {
            canvasRef.current.width = creationCanvas.width;
            canvasRef.current.height = creationCanvas.height;
            renderCreationCanvas(canvasRef, creationCanvas);
        }
    }, [creationCanvas]);

    useEffect(() => {
        if (selectedTiles) {
            renderCreationCanvas(canvasRef, creationCanvas);
        }
    }, [selectedTiles]);

    useEffect(() => {
        if (selectorIndex !== undefined) {
            if (selectorIndex === 0) {
                setCanFinishObject(false);
            } else {
                setCanFinishObject(true);
            }
        }
    }, [selectorIndex]);

    useEffect(() => {
        if (canFinishObject) {
            addObjectRef.current.disabled = false;
        } else {
            addObjectRef.current.disabled = true;
        }
    }, [canFinishObject]);

    //#region click methods
    const clickCanvas = (evt) => {
        let mousePos = getMousePos(canvasRef.current, evt);
        console.log(`Mouse pos: {x: ${Math.round(mousePos.x)}, y: ${Math.round(mousePos.y)}}`);

        // get selected grid coordinates for tile clicked
        let tileCoords = creationCanvas.getTileGridCoordinates(mousePos);

        // see if tile is already selected
        if (isTileAlreadySelected(tileCoords)) {
            // if it's already selected, deselect it and do all associated actions
            deselectTile(tileCoords);

        } // otherwise, see if tile can be selected
        else if (canTileBeSelected(tileCoords)) {
            // set object to finished
            setIsObjectFinished(false);
            // if it can, select the tile
            selectTile(tileCoords);
        }

    }

    const clickAddObjectBtn = (evt) => {

    }
    //#endregion

    //#region object methods
    

    //#endregion

    //#region selector index methods

        // for undoing a selected tile
        const decrementSelectorIndex = () => {
            let newNum = selectorIndex - 1;
            if (newNum < 0) { // cannot go below 0
                newNum = 0;
            }
            setSelectorIndex(newNum);
        }

        const incrementSelectorIndex = () => {
            let newNum = selectorIndex + 1;
            if (newNum > 2) { // cannot go below 0
                newNum = 2;
            }
            setSelectorIndex(newNum);
        }

        // after selecting a tile - if it reaches past 3, it's time to create the object
        const cycleSelectorIndexForward = () => {
            let newNum = selectorIndex + 1;
            if (newNum > 2) {
                newNum = 0;
            }
            setSelectorIndex(newNum);
        }

        const cycleSelectorIndexBackward = () => {
            let newNum = selectorIndex - 1;
            if (newNum < 0) {
                newNum = 2;
            }
            setSelectorIndex(newNum);
        }

    //#endregion

    //#region tile selector methods
    const resetSelector = () => {
        setSelectedTiles(getEmptySelectorArray());
        setSelectorIndex(0);
    }

    const canTileBeSelected = ({iX, iY}) => {
        if (selectedTiles[2].hasSelectedTile) {
            return false;
        }

        let coord0;
        let coord1;
        switch(selectorIndex) {
            case 0:
                return true;
            case 1:
                coord0 = {iX: selectedTiles[0].iX, iY: selectedTiles[0].iY};
                if (coord0.iX === iX || coord0.iY === iY) {
                    return true;
                }
                return false;
            case 2:
                coord0 = {iX: selectedTiles[0].iX, iY: selectedTiles[0].iY};
                coord1 = {iX: selectedTiles[1].iX, iY: selectedTiles[1].iY};

                if ((coord0.iX === iX && coord1.iX === iX) ||
                    (coord0.iY === iY && coord1.iY === iY)) {
                    return false;
                }
                if (coord0.iX === iX || coord0.iY === iY ||
                    coord1.iX === iX || coord1.iY === iY ) {
                    return true;
                }
                return false;
        }
    }

    const selectTile = (coords) => {
        let tileToSelect = creationCanvas.getTileAtGridPosition(coords);
        tileToSelect.isSelected = true;

        let selectedCopy = [...selectedTiles];
        selectedCopy[selectorIndex].hasSelectedTile = true;
        selectedCopy[selectorIndex].tile = tileToSelect;
        selectedCopy[selectorIndex].iX = coords.iX;
        selectedCopy[selectorIndex].iY = coords.iY;

        setSelectedTiles(selectedCopy);
        incrementSelectorIndex();
    }

    const isTileAlreadySelected = ({iX, iY}) => {
        if (selectorIndex === 0) {
            return false;
        }

        let startIndex = selectorIndex !== 2 ? selectorIndex - 1 : 2;
        for (let i = startIndex; i >= 0; i--) {
            if (isSameGridPosition(
                {iX, iY},
                {iX: selectedTiles[i].iX, iY: selectedTiles[i].iY}
                )) {
                    return true;
            }
        }

        return false;
    }

    const deselectTile = (coords) => {
        let selectedIndex = getSelectedIndexOfAlreadySelectedTile(coords);
        deselectTilesFromPointOfIndex(selectedIndex);
    }

    const getSelectedIndexOfAlreadySelectedTile = ({iX, iY}) => {
        if (selectorIndex === 0) {
            return 0;
        }

        let startIndex = selectorIndex !== 2 ? selectorIndex - 1 : 2;
        for (let i = startIndex; i >= 0; i--) {
            if (isSameGridPosition(
                {iX, iY},
                {iX: selectedTiles[i].iX, iY: selectedTiles[i].iY}
                )) {
                    return i;
            }
        }
        return 0;
    }

    const deselectTilesFromPointOfIndex = (index) => {
        let copy = [...selectedTiles];
        for (let i = selectorIndex; i >= index; i--) {
            if (copy[i].tile !== null) {
                creationCanvas.deselectTileInGrid(copy[i].iX, copy[i].iY);
                copy[i] = getEmptySelectedIndicator();
            }
        }

        setSelectedTiles(copy);
        setSelectorIndex(index);
    }
    

    //#endregion

    return (
        <div>
            <div>
                <button 
                ref={addObjectRef}
                onClick={clickAddObjectBtn}>Add Object</button>
                <br></br>
                <canvas
                ref={canvasRef}
                style={{ border: "2px solid black" }}
                onClick={clickCanvas}
                />
            </div>
        </div>

    );
}

export default CreationCanvas;