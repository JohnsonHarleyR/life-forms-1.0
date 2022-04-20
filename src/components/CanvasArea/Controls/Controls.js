import React, {useRef, useContext} from 'react';

const Controls = () => {

    const moveModeRef = useRef();
    const targetXRef = useRef();
    const targetYRef = useRef();
    const changeTargetRef = useRef();

    const changeMoveMode = () => {

    }

    const changeTarget = () => {
        
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