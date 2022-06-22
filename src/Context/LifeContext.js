import React, {useState, useEffect, createContext} from 'react';
//import { runAllGeneticTests } from '../crosscutting/logic/creature/genetics/tests/geneticTests';

const LifeContext = createContext({creatures: [], plants: [], objects: []});

const LifeProvider = ({children}) => {

    const [startTime, setStartTime] = useState(Date.now());

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

    const showListOfCreatures = () => {
        let str = "creatures: ";
        creatures.forEach(c => {
            str += `${c.id}, `;
        });
        console.log(str);
    }


    return (
        <LifeContext.Provider value={{
            creatures, passedOn, shelters, plants, objects, chosenCreature,
            largestCreatureSize, startTime,
            setCreatures, setPassedOn, setShelters, setPlants, setObjects, setChosenCreature
        }}>
            {children}
        </LifeContext.Provider>
    );

}

export {LifeContext};
export default LifeProvider;