import React, {useRef, useState, useEffect, useContext} from 'react';
import { LifeContext } from '../../../../../Context/LifeContext';
import { AllCreatureDefaults, Gender } from '../../../../../crosscutting/constants/creatureConstants';
import { createBlankCreatureCountArray, createStartingCreatureTypeArray, getInfoFromCreatureCountArray, updateCreatureCountInArray } from '../../logic/newGameLogic';
import CreatureCard from './CreatureCard';
import './css/creatureCard.css';

const AddCreatures = ({}) => {

  const maleCountRef = useRef();
  const femaleCountRef = useRef();

  const {startingCreatureTypes, setStartingCreatureTypes} = useContext(LifeContext);

  const [creatureOptions, setCreatureOptions] = useState([]);
  const [creatureCountArray, setCreatureCountArray] = useState([]);

  const [chosenCreature, setChosenCreature] = useState(null);
  // const [maleCount, setMaleCount] = useState(null);
  // const [femaleCount, setFemaleCount] = useState(null);

  const [creatureTypeDisplayOptions, setCreatureTypeDisplayOptions] = useState([]);

  useEffect(() => {
    if (startingCreatureTypes) {
      setStartingCreatureTypes([]);
    }
    if (creatureOptions) {
      populateCreatureOptions();
    }
    setCreatureCountArray(createBlankCreatureCountArray());
    maleCountRef.current.value = 0;
    femaleCountRef.current.value = 0;

  }, []);

  useEffect(() => {
    if (creatureOptions) {
      let newDisplay = [];
      creatureOptions.forEach(c => {
        newDisplay.push(<option key={c.label} value={c.value}>{c.label}</option>);
      });
      setCreatureTypeDisplayOptions(newDisplay);
    }
  }, [creatureOptions]);

  useEffect(() => {
    if (creatureCountArray && creatureCountArray.length > 0) {
      setChosenCreature(creatureCountArray[0].type);
    }
  }, [creatureCountArray]);

  useEffect(() => {
    if (chosenCreature) {
      let typeName = chosenCreature.type;
      let info = getInfoFromCreatureCountArray(typeName, creatureCountArray);
      maleCountRef.current.value = info.maleCount;
      femaleCountRef.current.value = info.femaleCount;
    }
  }, [chosenCreature]);


  const populateCreatureOptions = () => {
    let newOptions = [];
    AllCreatureDefaults.forEach(d => {
      newOptions.push({
        label: d.type,
        value: d.type
      });
    });
    setCreatureOptions(newOptions);
  }

  const handleTypeSelectChange = (e) => {
    let typeName = e.target.value;
    let info = getInfoFromCreatureCountArray(typeName, creatureCountArray);
    setChosenCreature(info.type);
    // setMaleCount(info.maleCount);
    // setFemaleCount(info.femaleCount);
    maleCountRef.current.value = info.maleCount;
    femaleCountRef.current.value = info.femaleCount;
  }

  const updateMaleCount = (e) => {
    updateCreatureCountInArray(chosenCreature.type, parseInt(e.target.value), "male", creatureCountArray);
    setStartingCreatureTypes(createStartingCreatureTypeArray(creatureCountArray));
  }

  const updateFemaleCount = (e) => {
    updateCreatureCountInArray(chosenCreature.type, parseInt(e.target.value), "female", creatureCountArray);
    setStartingCreatureTypes(createStartingCreatureTypeArray(creatureCountArray));
  }



  // const addStartingCreature = (type, maleCount, femaleCount) => {
  //   let startingCopy = [...startingCreatureTypes];

  //   if (maleCount > 0) {
  //     startingCopy.push({
  //       type: type,
  //       gender: Gender.MALE,
  //       count: maleCount
  //     });
  //   }

  //   if (femaleCount > 0) {
  //     startingCopy.push({
  //       type: type,
  //       gender: Gender.FEMALE,
  //       count: femaleCount
  //     });
  //   }

  //   setStartingCreatureTypes(startingCopy);

  //   let addedCopy = [...addedToDisplay];
  //   addedCopy.push({
  //     type: type,
  //     maleCount: maleCount,
  //     femaleCount: femaleCount
  //   });
  //   setAddedToDisplay(addedCopy);
  // }

  // const addCreatureTypeToDefaults = (newOption) => { // for creating a new creature type
  //   AllCreatureDefaults.push(newOption);
  //   populateCreatureOptions();
  // }

  return (
    <div className="add-creature-type">
      <div className="add-area">
        <b>Add Creature Type</b>
        <div>
          <label>Type</label>
          <select onChange={handleTypeSelectChange}>
            {creatureTypeDisplayOptions}
          </select>
        </div>
        <div>
        Male Count: <input type="number" min="0" ref={maleCountRef} onChange={updateMaleCount}/>
        Female Count: <input type="number" min="0" ref={femaleCountRef} onChange={updateFemaleCount}/>
        </div>
      </div>

      <div className="card-area">
        {/* {creatureCardDisplay} */}
      </div>
    </div>
    // <>
    //   <div style={{display: "flex"}}>
    //   <AddCreature 
    //     creatureOptions={creatureOptions}
    //     addStartingCreature={addStartingCreature}
    //     />

    // </div>
    // </>

  );
}

export default AddCreatures;