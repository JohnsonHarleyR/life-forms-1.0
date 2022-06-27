import React, {useRef, useState, useEffect, useContext} from 'react';
import { LifeContext } from '../../../Context/LifeContext';
import AddCreatures from './subcomponents/AddCreatures/AddCreatures';

const NewGame = ({}) => {


  return (
    <>
      New Game Area
      <AddCreatures
      />
    </>
  );
}

export default NewGame;