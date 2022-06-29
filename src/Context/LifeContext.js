import React, {useState, useEffect, createContext} from 'react';
import { CanvasDefaults, CanvasInfo } from '../crosscutting/constants/canvasConstants';
import { StartingCreatureDefaults } from '../crosscutting/constants/creatureConstants';
import { DefaultObjects } from '../crosscutting/constants/objectConstants';
import { Plants } from '../crosscutting/constants/plantConstants';
//import { runAllGeneticTests } from '../crosscutting/logic/creature/genetics/tests/geneticTests';

const LifeContext = createContext({creatures: [], plants: [], objects: []});

const LifeProvider = ({children}) => {

    const [startTime, setStartTime] = useState(Date.now());

    const [isCreateMode, setIsCreateMode] = useState(CanvasDefaults.USE_CREATE_MODE);
    const [isGameStarted, setIsGameStarted] = useState(CanvasDefaults.START_GAME_WITH_CANVAS);
    const [isGameOver, setIsGameOver] = useState(false);

    const [creatures, setCreatures] = useState([]);
    const [passedOn, setPassedOn] = useState([]);

    const [shelters, setShelters] = useState([]);
    const [plants, setPlants] = useState([]);
    const [objects, setObjects] = useState([]);

    const [startingCreatureTypes, setStartingCreatureTypes] = useState(StartingCreatureDefaults);
    const [startingPlantTypes, setStartingPlantTypes] = useState(Plants);
    const [startingObjects, setStartingObjects] = useState(DefaultObjects);

    const [canvasWidth, setCanvasWidth] = useState(CanvasInfo.WIDTH);
    const [canvasHeight, setCanvasHeight] = useState(800);
    const [canvasBgColor, setCanvasBgColor] = useState(CanvasInfo.BG_COLOR);

    useEffect(() => {
        if (canvasWidth) {
            CanvasInfo.WIDTH = canvasWidth;
        }
    }, [canvasWidth]);

    useEffect(() => {
        if (canvasHeight) {
            CanvasInfo.HEIGHT = canvasHeight;
        }
    }, [canvasHeight]);

    useEffect(() => {
        if (canvasBgColor) {
            CanvasInfo.BG_COLOR = canvasBgColor;
        }
    }, [canvasBgColor]);



    // // to run tests, uncomment this out
    // useEffect(() => {
    //     runAllGeneticTests();
    // }, []);

    // when creatures is updated, update the largest size
    useEffect(() => { 
        if (creatures) {
            let largest = 0;
            creatures.forEach(c => {
                if (c.size > largest) {
                    largest = c.size;
                }
            });
            //showListOfCreatures();
        }

    }, [creatures]);

    useEffect(() => { 
        if (isGameStarted) {
            setStartTime(Date.now());
        }

    }, [isGameStarted]);


    return (
        <LifeContext.Provider value={{
            creatures, passedOn, shelters, plants, objects,
            startTime, isCreateMode, isGameStarted, isGameOver,
            startingCreatureTypes, startingPlantTypes, startingObjects,
            setCreatures, setPassedOn, setShelters, setPlants, setObjects,
            setIsCreateMode, setIsGameStarted, setIsGameOver,
            setStartingCreatureTypes, setStartingPlantTypes, setStartingObjects
        }}>
            {children}
        </LifeContext.Provider>
    );

}

export {LifeContext};
export default LifeProvider;