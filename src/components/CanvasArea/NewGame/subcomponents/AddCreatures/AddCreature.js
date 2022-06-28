import React, {useRef, useState, useEffect, useContext} from 'react';
import { LifeContext } from '../../../../../Context/LifeContext';
import { AllCreatureDefaults } from '../../../../../crosscutting/constants/creatureConstants';
import CreatureCard from './CreatureCard';
import './css/creatureCard.css';

const AddCreature = ({creatureOptions, addTypeAlreadyAdded, addStartingCreature}) => {

  // TODO add card to show creature info

  const areaRef = useRef();

  const [chosenCreature, setChosenCreature] = useState(null);
  const [maleCount, setMaleCount] = useState(null);
  const [femaleCount, setFemaleCount] = useState(null);

  const [creatureTypeDisplayOptions, setCreatureTypeDisplayOptions] = useState([
    <option key="select" value="Select a type"> -- Select a type -- </option>
  ]);
  const [genderAreaDisplay, setGenderAreaDisplay] = useState(<></>);
  const [addButtonDisplay, setAddButtonDisplay] = useState(<></>);
  const [creatureCardDisplay, setCreatureCardDisplay] = useState(<></>);

  const [dataIsSent, setDataIsSent] = useState(false);

  const resetValues = () => {
    setGenderAreaDisplay(<></>);
    setCreatureTypeDisplayOptions([
      <option key="select" value="Select a type"> -- Select a type -- </option>
    ]);
    setMaleCount(null);
    setFemaleCount(null);
    setChosenCreature(null);
    setDataIsSent(false);
  }

  useEffect(() => {
    if (creatureOptions) {
      let newDisplay = [<option key="select" value="Select a type"> -- Select a type -- </option>];
      creatureOptions.forEach(c => {
        newDisplay.push(<option key={c.label} value={c.value}>{c.label}</option>);
      });
      setCreatureTypeDisplayOptions(newDisplay);
    }
  }, [creatureOptions, chosenCreature]);

  useEffect(() => {
    if (chosenCreature) {
      console.log(`new chosen: ${chosenCreature.type}`);
      setGenderAreaDisplay(getGenderSelectors);
      setCreatureCardDisplay(
      <CreatureCard
        typeInfo={chosenCreature}
        showCounts={false}
        maleCount={0}
        femaleCount={0}
        />);
    } else {
      setGenderAreaDisplay(<></>);
      setCreatureCardDisplay(<></>);
    }
  }, [chosenCreature]);

  useEffect(() => {
    determineButtonDisplay();
  }, [dataIsSent, chosenCreature, maleCount, femaleCount]);

  useEffect(() => {
    if (dataIsSent) {
      resetValues();
    }
  }, [dataIsSent]);

  const getGenderSelectors = () => {
    let area = <>
    Male Count: <input type="number" min="0" max="10" onChange={determineMaleCount}/>
    Female Count: <input type="number" min="0" max="10" onChange={determineFemaleCount}/>
    </>;
    return area;
  }

  const determineButtonDisplay = () => {
    if (chosenCreature && maleCount !== null && femaleCount !== null &&
       (maleCount > 0 || femaleCount > 0) && !dataIsSent) {
      let display = <><button onClick={handleAddCreatureButton}>Add</button></>
      setAddButtonDisplay(display);
    } else {
      setAddButtonDisplay(<></>);
    }
  }

  const findChosenCreature = (typeName) => {
    let chosen = chosenCreature;
    AllCreatureDefaults.forEach(d => {
      if (d.type === typeName) {
        chosen = d;
      }
    });
    return chosen;
  }

  const handleAddCreatureButton = (e) => {
    addTypeAlreadyAdded(chosenCreature.type);
    addStartingCreature(chosenCreature, maleCount, femaleCount);
    setDataIsSent(true);
  }

  const determineMaleCount = (e) => {
    let newValue = e.target.value;
    if (newValue >= 0 && newValue <= 10) {
      console.log(`new male count: ${newValue}`);
      setMaleCount(newValue);
    }
  }

  const determineFemaleCount = (e) => {
    let newValue = e.target.value;
    if (newValue >= 0 && newValue <= 10) {
      console.log(`new female count: ${newValue}`);
      setFemaleCount(newValue);
    }
  }

  const handleTypeSelectChange = (e) => {
    if (e.target.value !== " -- Select a type -- ") {
      setChosenCreature(findChosenCreature(e.target.value));
    } else {
      setChosenCreature(null);
    }
  }

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
          {genderAreaDisplay}
        </div>
        {addButtonDisplay}
      </div>

      <div className="card-area">
        {creatureCardDisplay}
      </div>
    </div>
    
  );
}

export default AddCreature;