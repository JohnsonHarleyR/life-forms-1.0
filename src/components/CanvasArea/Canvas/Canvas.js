import React, {useRef, useState, useEffect, useContext} from 'react';
import { LifeContext } from '../../../Context/LifeContext';
import { 
    renderCanvas,
    createObjects,
    createCreatures,
    setCreatureResult,
    generatePlants,
    updateShelters,
    updateCreatures,
    updatePlants
} from './canvasMethods';
import { CanvasInfo } from '../../../crosscutting/constants/canvasConstants';
import { Plants } from '../../../crosscutting/constants/plantConstants';
import { testFindArrayPatterns } from '../../../crosscutting/logic/universalLogic';
import { CreatureDefaults, CreatureType } from '../../../crosscutting/constants/creatureConstants';
import { runAllGeneticTests } from '../../../crosscutting/logic/creature/genetics/tests/geneticTests';
import { getMousePos } from '../../../crosscutting/logic/canvasLogic';
import Clock from '../Clock/Clock';

const Canvas = () => {
    
    // TODO method to set the chosen creature

    const canvasRef = useRef();

    const [time, setTime] = useState(Date.now());
    const [intervals, setIntervals] = useState(0);

    const {creatures, passedOn, shelters, plants, objects, chosenCreature, largestCreatureSize,
        setCreatures, setPassedOn, setShelters, setPlants, setObjects, setChosenCreature} = useContext(LifeContext);

    useEffect(() => {
        canvasRef.current.width = CanvasInfo.WIDTH;
        canvasRef.current.height = CanvasInfo.HEIGHT;
        let objs = createObjects();
        setObjects(objs);
        let newCreatures = createCreatures(objs, plants, shelters, setCreatures, setPlants, setShelters);
        setCreatures(newCreatures);
        renderCanvas(canvasRef, newCreatures, plants, objs, shelters);
        //setInitialTargetRefValues();

        // test area
        //testFindArrayPatterns();
    }, []);

    useEffect(() => {
        if (time) {
            
            const worker = () => {
                setInterval(() => {
                    postMessage(Date.now());
                }, 70);
            }
            
            let code = worker.toString();
            code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));
            
            const blob = new Blob([code], {type: "application/javascript"});
            const newWorker = new Worker(URL.createObjectURL(blob));
            
            newWorker.onmessage = (m) => {
                setTime(m.data);
            };
        }
    }, []);

    // TODO refactor the below part after creating creature
    useEffect(() => {
        setIntervals(intervals + 1);
        if (time && creatures && creatures.length !== 0) {

            let creaturesCopy = [...creatures];
            creaturesCopy.forEach(c => {
                let result = c.update(objects, plants, creatures, shelters, CanvasInfo);
                setCreatureResult(c, result);
            })
            //console.log(JSON.stringify(creaturesCopy));
            setCreatures(creaturesCopy);
            // update shelters too
            updateCreatures(creatures, setCreatures, setPassedOn);
            updateShelters(creatures, setShelters);
            updatePlants(plants, setPlants);
        }
        renderCanvas(canvasRef, creatures, plants, objects, shelters);
    }, [time]);

    useEffect(() => {
        if (intervals) {
            //let numberOfPlants = plants.length;
            //console.log(`plant count: ${numberOfPlants}`);
            generatePlants(intervals, plants, creatures, objects, shelters, Plants, setPlants, CreatureDefaults.LARGEST_SIZE);
        }
    }, [intervals]);

    // to run tests, uncomment this out
    useEffect(() => {
        runAllGeneticTests();
    }, []);


    const showMousePos = (evt) => {
        let mousePos = getMousePos(canvasRef.current, evt);
        console.log(`Mouse pos: {x: ${Math.round(mousePos.x)}, y: ${Math.round(mousePos.y)}}`);
    }

    return (
        <div>
            <div>
                <Clock time={time} />
            </div>
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

export default Canvas;