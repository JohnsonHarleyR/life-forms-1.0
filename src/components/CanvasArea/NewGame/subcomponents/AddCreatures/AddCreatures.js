import React, {useRef, useState, useEffect, useContext} from 'react';
import { LifeContext } from '../../../../../Context/LifeContext';
import { AllCreatureDefaults } from '../../../../../crosscutting/constants/creatureConstants';
import AddCreature from './AddCreature';

const AddCreatures = ({}) => {

  const {startingCreatureTypes, setStartingCreatureTypes} = useContext(LifeContext);

  const [typesAlreadyAdded, setTypesAlreadyAdded] = useState([]);
  const [creatureOptions, setCreatureOptions] = useState([]);

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

  const addCreatureType = (newOption) => {
    AllCreatureDefaults.push(newOption);
    populateCreatureOptions();
  }

  const addTypeAlreadyAdded = (newType) => {
    let copy = [...typesAlreadyAdded];
    copy.push(newType);
    setTypesAlreadyAdded(copy);
  }

  return (
    <div>
      <AddCreature 
        creatureOptions={creatureOptions}
        addTypeAlreadyAdded={addTypeAlreadyAdded}
        />
    </div>
  );
}

export default AddCreatures;