import React, {useState, useEffect, createContext} from 'react';
import { CanvasDefaults } from '../crosscutting/constants/canvasConstants';
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

    const [chosenCreature, setChosenCreature] = useState(null);
    const [largestCreatureSize, setLargestCreatureSize] = useState(0);

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
            setLargestCreatureSize(largest);
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
            creatures, passedOn, shelters, plants, objects, chosenCreature,
            largestCreatureSize, startTime, isCreateMode, isGameStarted, isGameOver,
            setCreatures, setPassedOn, setShelters, setPlants, setObjects, setChosenCreature,
            setIsCreateMode, setIsGameStarted, setIsGameOver
        }}>
            {children}
        </LifeContext.Provider>
    );

}

export {LifeContext};
export default LifeProvider;