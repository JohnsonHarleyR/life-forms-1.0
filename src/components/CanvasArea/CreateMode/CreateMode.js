import React, {useRef, useState, useEffect, useContext} from 'react';
import { LifeContext } from '../../../Context/LifeContext';
import CreationCanvas from './subcomponents/CreationCanvas';
import { CreationDefaults } from '../../../crosscutting/constants/creationConstants';

const CreateMode = ({}) => {


  return (
    <CreationCanvas 
      xTiles={CreationDefaults.X_TILES_DEFAULT} 
      yTiles={CreationDefaults.Y_TILES_DEFAULT}
    />
  );
}

export default CreateMode;