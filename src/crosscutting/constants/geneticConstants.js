import { alterColorByAmount, getRandomIntInRange } from "../logic/universalLogic"


export const GeneticDefaults = {
    GENERATIONS_TO_BECOME_DOMINANT: 4
}

export const Dominance = {
    DOMINANT: "DOMINANT",
    RECESSIVE: "RECESSIVE"
}

// misc
export const ColorType = {
    R: "R",
    G: "G",
    B: "B"
}

// genes and accompanying traits


// COLOR
// --gene
export const COLOR_GENE = {
    name: "COLOR_GENE",
    dominantTraits: [COLOR_DEFAULT],
    recessiveTraits: [MORE_RED]
}

// --traits
export const ColorTrait = {
    DEFAULT: COLOR_DEFAULT,
    MORE_RED: MORE_RED
}
export const COLOR_DEFAULT = {
    name: "DEFAULT",
    dominance: Dominance.DOMINANT,
    alter: (creature) => {
        return {...creature};
    }
}
export const MORE_RED = {
    name: "MORE_RED",
    dominance: Dominance.RECESSIVE,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = getRandomIntInRange(10, 20);
        let newColor = alterColorByAmount(originalColor, ColorType.R, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    }
}