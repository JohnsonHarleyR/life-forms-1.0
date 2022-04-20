import React, {useRef, useState, useContext} from 'react';
import { LifeContext } from '../../../Context/LifeContext';

const Canvas = () => {

    const canvasRef = useRef();

    const [time, setTime] = useState(Date.now());
    const [intervals, setIntervals] = useState(0);

    const {creatures, shelters, plants, objects,
        setCreatures, setShelters, setPlants, setObjects} = useContext(LifeContext);

    const showMousePos = (evt) => {

    }

    return (
        <div>
            <canvas
            ref={canvasRef}
            style={{ border: "2px solid black" }}
            onClick={showMousePos}
            />
        </div>
    );
}

export default Canvas;