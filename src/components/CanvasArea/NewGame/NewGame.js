import React, {useRef, useState, useEffect, useContext} from 'react';
import { LifeContext } from '../../../Context/LifeContext';
import AddCreatures from './subcomponents/AddCreatures/AddCreatures';

const NewGame = ({}) => {

  const startGameRef = useRef();
  const {setIsGameStarted, startingCreatureTypes, isGameStarted} = useContext(LifeContext);


  useEffect(() => {
    if (startingCreatureTypes.length > 0) {
      startGameRef.current.disabled = false;
    } else {
      startGameRef.current.disabled = true;
    }
  }, [startingCreatureTypes]);

  const handleStartGameClick = (e) => {
    setIsGameStarted(true);
  }

  return (
    <>
      <AddCreatures
      />
      <br></br><br></br>
      {/* {startGameButton} */}
      <button ref={startGameRef} onClick={handleStartGameClick}>Start Game</button>
    </>
  );
}

export default NewGame;