import React, {useState, useEffect} from 'react';
import { getDaysPassed, getHoursPassed, getHoursPassedToday, getMsPassed, getTimeStringFromHoursToday } from './clockMethods';
import { TimeProps } from '../../../../crosscutting/constants/creatureConstants';
import { CanvasInfo } from '../../../../crosscutting/constants/canvasConstants';

const Clock = ({time}) => {

    const msPerHour = TimeProps.MS_PER_DAY / TimeProps.HOURS_PER_DAY;
    const msToAdd = msPerHour * CanvasInfo.STARTING_HOUR;

    const [msPassed, setMsPassed] = useState(0);
    const [hoursPassed, setHoursPassed] = useState(0);
    const [currentDay, setCurrentDay] = useState(1);
    const [hoursPassedToday, setHoursPassedToday] = useState(0);
    const [timeString, setTimeString] = useState("12:00 AM");


    useEffect(() => { 
        if (time) {
            let passed = getMsPassed(CanvasInfo.START_TIME, time) + msToAdd;
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