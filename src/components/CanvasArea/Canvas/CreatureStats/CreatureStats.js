import React, { useRef, useState } from 'react';
import { getStartingCreatureTypes, getStatsForCreatureType } from './logic/statLogic';

const CreatureStats = () => {

  const updateRef = useRef();

  const types = getStartingCreatureTypes();
  const [display, setDisplay] = useState(<div></div>);

  const handleUpdateClick = (e) => {
    setDisplay(createDisplay());
  }

  const createDisplay = () => {
    let creatureStats = [];
    let count = 0;
    types.forEach(t => {
      creatureStats.push(createTypeDisplay(t, count));
      count++;
    });

    let newDisplay = <div><h2>Creature Stats</h2><div style={{display: "flex"}}>{creatureStats}</div></div>;
    return newDisplay;
  }

  const createTypeDisplay = (type, count) => {
    let stats = getStatsForCreatureType(type);
    return (
      <div key={`ct${count}`}>
        <b>Type: {type}</b><br></br>
        <br></br>
        <b>Generations: </b>{stats.highestGeneration}<br></br>
        <br></br>
        <b>Living: </b> {stats.livingCount}<br></br>
        <b>Passed Away: </b> {stats.passedOnCount}<br></br>
        <b>Total Count: </b> {stats.totalCount}<br></br>
      </div>
    );
  }

  return (
    <div>
      <button ref={updateRef} onClick={handleUpdateClick}>Update Stats</button>
      <br></br>
      {display}
    </div>
  );

}

export default CreatureStats;