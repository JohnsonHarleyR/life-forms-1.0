import React, {useState, useEffect, createContext} from 'react';
import { CanvasDefaults, CanvasInfo } from '../crosscutting/constants/canvasConstants';
import { StartingCreatureDefaults } from '../crosscutting/constants/creatureConstants';
import { DefaultObjects } from '../crosscutting/constants/objectConstants';
import { PlantConstants } from '../crosscutting/constants/plantConstants';
//import { runAllGeneticTests } from '../crosscutting/logic/creature/genetics/tests/geneticTests';

const LifeContext = createContext({creatures: [], plants: [], objects: []});

const LifeProvider = ({children}) => {

    const [isCreateMode, setIsCreateMode] = useState(CanvasDefaults.USE_CREATE_MODE);
    const [isGameStarted, setIsGameStarted] = useState(CanvasDefaults.START_GAME_WITH_CANVAS);
    const [isGameOver, setIsGameOver] = useState(false);


    return (
        <LifeContext.Provider value={{
            isCreateMode, isGameStarted, isGameOver,
            setIsCreateMode, setIsGameStarted, setIsGameOver,
        }}>
            {children}
        </LifeContext.Provider>
    );

}

export {LifeContext};
export default LifeProvider;