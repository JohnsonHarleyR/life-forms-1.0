import React, {useRef, useState, useEffect, useContext} from 'react';
import { LifeContext } from '../../../Context/LifeContext';
import { convertJsonCodeToLandscapeObject } from '../CreateMode/logic/creationLogic';
import AddCreatures from './subcomponents/AddCreatures/AddCreatures';
import AddPlants from './subcomponents/AddPlants/AddPlants';
import { ChooseLandscape } from './subcomponents/ChooseLandscape/ChooseLandscape';

const NewGame = ({}) => {

  const startGameRef = useRef();
  const {setIsGameStarted, startingCreatureTypes, isGameStarted,
    setStartingObjects, setCanvasWidth, setCanvasHeight,
    setCanvasBgColor} = useContext(LifeContext);
  const [landscapeJson, setLandscapeJson] = useState("");


  useEffect(() => {
    if (startingCreatureTypes.length > 0) {
      startGameRef.current.disabled = false;
    } else {
      startGameRef.current.disabled = true;
    }
  }, [startingCreatureTypes]);

  const handleStartGameClick = (e) => {
    // before starting game, set the landscape stuff
    let obj = convertJsonCodeToLandscapeObject(landscapeJson);
    setCanvasBgColor(obj.bgColor);
    setCanvasWidth(obj.width);
    setCanvasHeight(obj.height);
    setStartingObjects(obj.objects);

    setIsGameStarted(true);
  }

  return (
    <>
      <AddCreatures/>
      <AddPlants />
      <ChooseLandscape setLandscapeJson={setLandscapeJson} />
      <br></br>
      {/* {startGameButton} */}
      <button ref={startGameRef} onClick={handleStartGameClick}>Start Game</button>
    </>
  );
}

export default NewGame;