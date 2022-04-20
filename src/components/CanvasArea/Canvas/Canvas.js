import React, {useRef, useState, useEffect, useContext} from 'react';
import { LifeContext } from '../../../Context/LifeContext';
import { 
    renderCanvas,
    createObjects,
    createCreatures,
    setCreatureResult,
    generatePlant
} from './canvasMethods';
import { CanvasInfo } from '../../../crosscutting/constants/canvasConstants';

const Canvas = () => {
    
    // TODO method to set the chosen creature

    const canvasRef = useRef();

    const [time, setTime] = useState(Date.now());
    const [intervals, setIntervals] = useState(0);

    const {creatures, shelters, plants, objects, chosenCreature,
        setCreatures, setShelters, setPlants, setObjects, setChosenCreature} = useContext(LifeContext);

    useEffect(() => {
        canvasRef.current.width = CanvasInfo.WIDTH;
        canvasRef.current.height = CanvasInfo.HEIGHT;
        setObjects(createObjects());
        setCreatures(createCreatures());
        renderCanvas(canvasRef, creatures, plants, objects);
        //setInitialTargetRefValues();
    }, []);

    useEffect(() => {
        if (time) {
          //console.log(time);
        const interval = setInterval(
            () => setTime(Date.now()),
            CanvasInfo.INTERVAL
        );
        return () => clearInterval(interval);
        }
    }, []);

    // TODO refactor the below part after creating creature
    useEffect(() => {
        setIntervals(intervals + 1);
        if (time && creatures) {
            // let creaturesCopy = [...creatures];
            // creaturesCopy.forEach(c => {
            //     let result = c.move(objects, plants, creatures, canvasInfo);
            //     setCreatureResult(c, result);
            // })
            // //console.log(JSON.stringify(creaturesCopy));
            // setCreatures(creaturesCopy);
        }
        renderCanvas(canvasRef, creatures, plants, objects);
    }, [time]);


    const showMousePos = (evt) => {

    }

    return (
        <div>
            <canvas
            ref={canvasRef}
            style={{ border: "2px solid black" }}
            onClick={showMousePos}
            />
        </div>
    );
}

export default Canvas;