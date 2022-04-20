import React, {useRef, useContext} from 'react';
import { LifeContext } from '../../../Context/LifeContext';

const Controls = () => {

    // TODO create drop down of current creatures so the creature used to test the controls can be chosen - like in the sims!

    const moveModeRef = useRef();
    const targetXRef = useRef();
    const targetYRef = useRef();
    const changeTargetRef = useRef();

    const {creatures, chosenCreature,
        setCreatures, setChosenCreatures} = useContext(LifeContext);

    const setInitialTargetRefValues = () => {
        targetXRef.current.value = endPosition.x;
        targetYRef.current.value = endPosition.y;
    }

    const changeMoveMode = () => { // TODO (Canvas.js in old)

    }

    const changeTarget = () => { // TODO (Canvas.js in old)

    }

    return (
        <div>
            <select ref={moveModeRef} onChange={changeMoveMode}>
                <option value="SEARCH">Search</option>
                <option value="STAND_STILL">Stand Still</option>
                <option value="TOWARD_POINT">Toward Point</option>
                <option value="HIDE">Hide</option>
                <option value="WANDER">Wander</option>
            </select>
            <br></br>
            <div style={{display:"flex"}}>
                X: <input type="number" ref={targetXRef}/>
                Y: <input type="number" ref={targetYRef}/>
                <button ref={changeTargetRef} onClick={changeTarget}>Change Target</button>
            </div>
        </div>
    );
}

export default Controls;