import React, {useRef, useState, useEffect, useContext} from 'react';
import { LifeContext } from '../../../Context/LifeContext';
import AddCreatures from './subcomponents/AddCreatures/AddCreatures';

const NewGame = ({}) => {

  const {setIsGameStarted, startingCreatureTypes} = useContext(LifeContext);

  const [startGameButton, setStartGameButton] = useState(<></>);

  const determineStartGameDisplay = () => {
    let display = <></>
    if (canStartGame()) {
      display = <button onClick={handleStartGameClick}>Start Game</button>;
    }
    setStartGameButton(display);
  }

  useEffect(() => {
    determineStartGameDisplay();
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
      New Game Area
      <AddCreatures
      />
      <br></br>
      {startGameButton}
    </>
  );
}

export default NewGame;