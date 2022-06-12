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

const Canvas = () => {
    
    // TODO method to set the chosen creature

    const canvasRef = useRef();

    const [time, setTime] = useState(Date.now());
    const [intervals, setIntervals] = useState(0);

    const {creatures, shelters, plants, objects, chosenCreature, largestCreatureSize,
        setCreatures, setShelters, setPlants, setObjects, setChosenCreature} = useContext(LifeContext);

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
        if (time && creatures && creatures.length !== 0) {
            let creaturesCopy = [...creatures];
            creaturesCopy.forEach(c => {
                let result = c.update(objects, plants, creatures, shelters, CanvasInfo);
                setCreatureResult(c, result);
            })
            //console.log(JSON.stringify(creaturesCopy));
            setCreatures(creaturesCopy);
            // update shelters too
            updateCreatures(creatures, setCreatures);
            updateShelters(creatures, setShelters);
            updatePlants(plants, setPlants);
        }
        renderCanvas(canvasRef, creatures, plants, objects, shelters);
    }, [time]);

    useEffect(() => {
        if (intervals) {
            generatePlants(intervals, plants, creatures, objects, shelters, Plants, setPlants, CreatureDefaults.LARGEST_SIZE);
        }
    }, [intervals]);

    // to run tests, uncomment this out
    useEffect(() => {
        runAllGeneticTests();
    }, []);


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