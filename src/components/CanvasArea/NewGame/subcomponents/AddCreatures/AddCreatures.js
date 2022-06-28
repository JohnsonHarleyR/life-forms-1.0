import React, {useRef, useState, useEffect, useContext} from 'react';
import { LifeContext } from '../../../../../Context/LifeContext';
import { AllCreatureDefaults, Gender } from '../../../../../crosscutting/constants/creatureConstants';
import AddCreature from './AddCreature';
import CreatureCard from './CreatureCard';

const AddCreatures = ({}) => {

  const {startingCreatureTypes, setStartingCreatureTypes} = useContext(LifeContext);
  const [addedToDisplay, setAddedToDisplay] = useState([]);

  const [typesAlreadyAdded, setTypesAlreadyAdded] = useState([]);
  const [creatureOptions, setCreatureOptions] = useState([]);

  const [startingCreaturesDisplay, setStartingCreaturesDisplay] = useState(<></>);

  useEffect(() => {
    if (startingCreatureTypes) {
      setStartingCreatureTypes([]);
    }
  }, []);

  useEffect(() => {
    if (addedToDisplay && addedToDisplay.length > 0) {
      let displayLines = [];
      //displayLines.push(<><b>Starting Creatures</b><br></br></>);
      addedToDisplay.forEach(c => {
        let line = <CreatureCard
                    typeInfo={c.type}
                    showCounts={true}
                    maleCount={c.maleCount}
                    femaleCount={c.femaleCount}
                  />;
        displayLines.push(line);
      });
      setStartingCreaturesDisplay(displayLines);
    }
  }, [addedToDisplay]);

  const populateCreatureOptions = () => {
    let newOptions = [];
    AllCreatureDefaults.forEach(d => {
      if (!typesAlreadyAdded.includes(d.type)) {
        //newOptions.push(`<option key={${d.type}}>${d.type}</option>`);
        newOptions.push({
          label: d.type,
          value: d.type
        });
      }
    });
    setCreatureOptions(newOptions);
  }

  useEffect(() => {
    if (typesAlreadyAdded && creatureOptions) {
      populateCreatureOptions();
    }
  }, [typesAlreadyAdded]);

  const addTypeAlreadyAdded = (newType) => {
    let copy = [...typesAlreadyAdded];
    copy.push(newType);
    setTypesAlreadyAdded(copy);
  }

  const addStartingCreature = (type, maleCount, femaleCount) => {
    let startingCopy = [...startingCreatureTypes];

    if (maleCount > 0) {
      startingCopy.push({
        type: type,
        gender: Gender.MALE,
        count: maleCount
      });
    }

    if (femaleCount > 0) {
      startingCopy.push({
        type: type,
        gender: Gender.FEMALE,
        count: femaleCount
      });
    }

    setStartingCreatureTypes(startingCopy);

    let addedCopy = [...addedToDisplay];
    addedCopy.push({
      type: type,
      maleCount: maleCount,
      femaleCount: femaleCount
    });
    setAddedToDisplay(addedCopy);
  }

  const addCreatureTypeToDefaults = (newOption) => { // for creating a new creature type
    AllCreatureDefaults.push(newOption);
    populateCreatureOptions();
  }

  return (
    <>
      <div style={{display: "flex"}}>
      <AddCreature 
        creatureOptions={creatureOptions}
        addTypeAlreadyAdded={addTypeAlreadyAdded}
        addStartingCreature={addStartingCreature}
        />

    </div>
    <div>
      <b>Starting Creatures</b>
      <div style={{display: "flex"}}>
        {startingCreaturesDisplay}
      </div>
    </div>
    </>

  );
}

export default AddCreatures;