import React, {useState, useEffect, createContext} from 'react';
import { CanvasDefaults, CanvasInfo } from '../crosscutting/constants/canvasConstants';
import { StartingCreatureDefaults } from '../crosscutting/constants/creatureConstants';
import { DefaultObjects } from '../crosscutting/constants/objectConstants';
import { PlantConstants } from '../crosscutting/constants/plantConstants';
//import { runAllGeneticTests } from '../crosscutting/logic/creature/genetics/tests/geneticTests';

const LifeContext = createContext({creatures: [], plants: [], objects: []});

const LifeProvider = ({children}) => {

    const [startTime, setStartTime] = useState(Date.now());

    const [isCreateMode, setIsCreateMode] = useState(CanvasDefaults.USE_CREATE_MODE);
    const [isGameStarted, setIsGameStarted] = useState(CanvasDefaults.START_GAME_WITH_CANVAS);
    const [isGameOver, setIsGameOver] = useState(false);

    const [shelters, setShelters] = useState([]);
    const [objects, setObjects] = useState([]);

    useEffect(() => { 
        if (isGameStarted) {
            setStartTime(Date.now());
        }

    }, [isGameStarted]);


    return (
        <LifeContext.Provider value={{
            shelters, objects,
            startTime, isCreateMode, isGameStarted, isGameOver,
            setShelters, setObjects,
            setIsCreateMode, setIsGameStarted, setIsGameOver,
        }}>
            {children}
        </LifeContext.Provider>
    );

}

export {LifeContext};
export default LifeProvider;