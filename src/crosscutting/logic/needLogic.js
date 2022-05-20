import { AmountNeeded } from "../constants/creatureConstants";

export const getAmountNeededDecimal = (amountNeeded) => {
    switch (amountNeeded) {
        default:
            throw "Error: Invalid value inside of getAmountNeededDecimal. (needLogic.js)";
        case AmountNeeded.MIN:
            return 0.25;
        case AmountNeeded.AVG:
            return 0.50;
        case AmountNeeded.MAX:
            return 0.75;
    }
}

export const calculateAmountLostPerYear = (maxAmount, decayRate) => {
    let amountLostPerYear = maxAmount * decayRate;
    return amountLostPerYear;
}

export const calculateAmountLostPerMs = (msPerYear, maxAmount, decayRate) => {
    let amountLostPerYear = calculateAmountLostPerYear(maxAmount, decayRate);
    let amountLostPerMs = amountLostPerYear / msPerYear;
    return amountLostPerMs;
}

export const calculateAmountLost = (msPassed, amountPerMs) => {
    let amountLost = msPassed * amountPerMs;
    return amountLost;
}

export const calculateNewAmount = (currentAmount, amountLostPerMs, msPassed) => {
    let amountLost = calculateAmountLost(msPassed, amountLostPerMs);
    let newAmount = currentAmount - amountLost;
    if (newAmount < 0) {
        newAmount = 0;
    }
    return newAmount;
}