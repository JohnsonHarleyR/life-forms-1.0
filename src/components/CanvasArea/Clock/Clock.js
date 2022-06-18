import React, {useRef, useState, useEffect, useContext} from 'react';
import { LifeContext } from '../../../Context/LifeContext';
import { getDaysPassed, getHoursPassed, getHoursPassedToday, getMsPassed, getTimeStringFromHoursToday } from './clockMethods';
import { TimeProps } from '../../../crosscutting/constants/creatureConstants';
import { CanvasInfo } from '../../../crosscutting/constants/canvasConstants';

const Clock = () => {

    const msPerHour = TimeProps.MS_PER_DAY / TimeProps.HOURS_PER_DAY;
    const {startTime} = useContext(LifeContext);

    //let startTime = Date.now();
    const [time, setTime] = useState(Date.now());

    const [msPassed, setMsPassed] = useState(0);
    const [hoursPassed, setHoursPassed] = useState(0);
    const [currentDay, setCurrentDay] = useState(1);
    const [hoursPassedToday, setHoursPassedToday] = useState(0);
    const [timeString, setTimeString] = useState("12:00 AM");

    useEffect(() => {
        //startTime = Date.now();
        if (time) {
          //console.log(time);
        const interval = setInterval(
            () => setTime(Date.now()),
            CanvasInfo.INTERVAL
        );
        return () => clearInterval(interval);
        }
    }, []);

    useEffect(() => { 
        if (time) {
            let passed = getMsPassed(startTime, time);
            setMsPassed(passed);
        }
    }, [time]);

    useEffect(() => { 
        if (msPassed) {
            let hoursPassed = getHoursPassed(msPassed, msPerHour);
            setHoursPassed(hoursPassed);
        }
    }, [msPassed]);

    useEffect(() => { 
        if (hoursPassed) {
            let daysPassed = getDaysPassed(hoursPassed);
            if (daysPassed + 1 > currentDay) {
                setCurrentDay(daysPassed + 1);
            }
            let hoursToday = getHoursPassedToday(hoursPassed, daysPassed);
            setHoursPassedToday(hoursToday);
        }
    }, [hoursPassed]);

    useEffect(() => { 
        if (hoursPassedToday) {
            let tString = getTimeStringFromHoursToday(hoursPassedToday);
            setTimeString(tString);
        }
    }, [hoursPassedToday]);

    return (
        <>
            <h2>
            {timeString} - Day {currentDay}
            </h2>
        </>
    );
}

export default Clock;