import React, {useRef, useState, useEffect, useContext} from 'react';
import { LifeContext } from '../../../../../Context/LifeContext';
import { AllCreatureDefaults, Gender } from '../../../../../crosscutting/constants/creatureConstants';
import AddCreature from './AddCreature';

const AddCreatures = ({}) => {

  const {startingCreatureTypes, setStartingCreatureTypes} = useContext(LifeContext);

  const [typesAlreadyAdded, setTypesAlreadyAdded] = useState([]);
  const [creatureOptions, setCreatureOptions] = useState([]);

  useEffect(() => {
    if (startingCreatureTypes) {
      setStartingCreatureTypes([]);
    }
  }, []);

  useEffect(() => {
    if (startingCreatureTypes && startingCreatureTypes.length > 0) {
      let toJsonStrings = [];
      startingCreatureTypes.forEach(c => {
        let toStringify = {
          type: c.type.type,
          gender: c.gender,
          count: c.count
        };
        toJsonStrings.push(`${JSON.stringify(toStringify)}\n`);
      });
      console.log(`starting creatures: \n${toJsonStrings}`);
    }
  }, [startingCreatureTypes]);

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
  }

  const addCreatureTypeToDefaults = (newOption) => { // for creating a new creature type
    AllCreatureDefaults.push(newOption);
    populateCreatureOptions();
  }

  return (
    <div>
      <AddCreature 
        creatureOptions={creatureOptions}
        addTypeAlreadyAdded={addTypeAlreadyAdded}
        addStartingCreature={addStartingCreature}
        />
    </div>
  );
}

export default AddCreatures;