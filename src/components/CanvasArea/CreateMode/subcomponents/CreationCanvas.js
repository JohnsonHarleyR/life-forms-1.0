import React, {useRef, useState, useEffect, useContext} from 'react';
import {
    createCreationCanvasClass,
    getEmptySelectorArray,
    renderCreationCanvas,
} from '../logic/creationLogic';
import { LifeContext } from '../../../../Context/LifeContext';
import { getMousePos } from '../../../../crosscutting/logic/canvasLogic';

const CreationCanvas = ({xTiles, yTiles}) => {
    
    // TODO method to set the chosen creature

    const canvasRef = useRef();
    
    const {} = useContext(LifeContext);
    const [creationCanvas, setCreationCanvas] // TODO allow updates to this with tiles
        = useState(createCreationCanvasClass(xTiles, yTiles));

    const [canSelectTile, setCanSelectTile] = useState(true);

    const [selectorIndex, setSelectorIndex] = useState(0);
    const [selectedTiles, setSelectedTiles] = useState(getEmptySelectorArray());
    

    useEffect(() => {
        if (creationCanvas) {
            canvasRef.current.width = creationCanvas.width;
            canvasRef.current.height = creationCanvas.height;
            renderCreationCanvas(canvasRef, creationCanvas);
        }
    }, [creationCanvas]);

    // after selecting a tile - if it reaches past 3, it's time to create the object
    const cycleSelectorIndexForward = () => {
        let newNum = selectorIndex + 1;
        if (newNum >= 3) {
            newNum = 0;
        }
        setSelectorIndex(newNum);
    }

    // for undoing a selected tile
    const decrementSelectorIndex = () => {
        let newNum = selectorIndex - 1;
        if (newNum < 0) { // cannot go below 0
            newNum = 0;
        }
        setSelectorIndex(newNum);
    }


    const clickCanvas = (evt) => {
        let mousePos = getMousePos(canvasRef.current, evt);
        console.log(`Mouse pos: {x: ${Math.round(mousePos.x)}, y: ${Math.round(mousePos.y)}}`);
    }

    return (
        <div>
            <div>
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