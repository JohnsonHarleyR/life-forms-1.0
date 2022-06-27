import React, {useRef, useState, useEffect, useContext} from 'react';
import { LifeContext } from '../../../Context/LifeContext';
import AddCreatures from './subcomponents/AddCreatures/AddCreatures';

const NewGame = ({}) => {

  const {setIsGameStarted, startingCreatureTypes} = useContext(LifeContext);

  const [creaturesIncludedDisplay, setCreaturesIncludedDisplay] = useState(<></>);
  const [startGameButton, setStartGameButton] = useState(<></>);

  const determineStartGameButtonDisplay = () => {
    let buttonDisplay = <></>
    if (canStartGame()) {
      buttonDisplay = <button onClick={handleStartGameClick}>Start Game</button>;
    }
    setStartGameButton(buttonDisplay);
  }

  useEffect(() => {
    determineStartGameButtonDisplay();
  }, [startingCreatureTypes]);

  const canStartGame = () => {
    if (startingCreatureTypes.length > 0) {
      return true;
    }

    return false;
  }

  const handleStartGameClick = (e) => {
    setIsGameStarted(true);
  }

  return (
    <>
      <AddCreatures
      />
      <br></br><br></br>
      {startGameButton}
    </>
  );
}

export default NewGame;