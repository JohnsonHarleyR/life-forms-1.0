import React, {useState, useEffect, createContext} from 'react';

const LifeContext = createContext({creatures: [], plants: [], objects: []});

const LifeProvider = ({children}) => {

    const [creatures, setCreatures] = useState([]);
    const [shelters, setShelters] = useState([]);
    const [plants, setPlants] = useState([]);
    const [objects, setObjects] = useState([]);

    const [chosenCreature, setChosenCreature] = useState(null);


    return (
        <LifeContext.Provider value={{
            creatures, shelters, plants, objects, chosenCreature,
            setCreatures, setShelters, setPlants, setObjects, setChosenCreature
        }}>
            {children}
        </LifeContext.Provider>
    );

}

export {LifeContext};
export default LifeProvider;