import React, {useState, useEffect, createContext} from 'react';

const LifeContext = createContext({creatures: [], plants: [], objects: []});

const LifeProvider = ({children}) => {

    const [creatures, setCreatures] = useState([]);
    const [plants, setPlants] = useState([]);
    const [objects, setObjects] = useState([]);

    const [chosenCreature, setChosenCreature] = useState(null);


    return (
        <LifeContext.Provider value={{
            creatures, plants, objects, chosenCreature,
            setCreatures, setPlants, setObjects, setChosenCreature
        }}>
            {children}
        </LifeContext.Provider>
    );

}

export {LifeContext};
export default LifeProvider;