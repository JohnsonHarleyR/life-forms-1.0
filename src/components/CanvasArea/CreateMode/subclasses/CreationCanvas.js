import React, {useRef, useState, useEffect, useContext} from 'react';
import {
    createCreationCanvasClass,
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

    useEffect(() => {
        if (creationCanvas) {
            canvasRef.current.width = creationCanvas.width;
            canvasRef.current.height = creationCanvas.height;
            renderCreationCanvas(canvasRef, creationCanvas);
        }
    }, [creationCanvas]);


    const showMousePos = (evt) => {
        let mousePos = getMousePos(canvasRef.current, evt);
        console.log(`Mouse pos: {x: ${Math.round(mousePos.x)}, y: ${Math.round(mousePos.y)}}`);
    }

    return (
        <div>
            <div>
                <canvas
                ref={canvasRef}
                style={{ border: "2px solid black" }}
                onClick={showMousePos}
                />
            </div>
        </div>

    );
}

export default CreationCanvas;