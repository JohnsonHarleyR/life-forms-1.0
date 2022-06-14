import { alterColorByAmount, getRandomIntInRange } from "../logic/universalLogic"


export const GeneticDefaults = {
    GENERATIONS_TO_BECOME_DOMINANT: 4,
    ATTEMPTS_TO_MUTATE_ALLOWED: 15
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

export const GeneType = {
    COLOR: "COLOR"
}

// COLOR

// --traits
export const COLOR_DEFAULT = {
    name: "DEFAULT",
    dominance: Dominance.DOMINANT,
    isMutation: false,
    alter: (creature) => {
        return {...creature};
    }
}
export const MORE_RED = {
    name: "MORE_RED",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = getRandomIntInRange(10, 20);
        let newColor = alterColorByAmount(originalColor, ColorType.R, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    }
}

// bringing traits together
export const ColorTrait = {
    DEFAULT: COLOR_DEFAULT,
    MORE_RED: MORE_RED
}

// --gene
export const COLOR_GENE = {
    name: "COLOR_GENE",
    dominantTraits: [COLOR_DEFAULT],
    recessiveTraits: [MORE_RED]
}



// List of all genes
export const LIST_OF_GENES = [
    {
        geneType: GeneType.COLOR,
        constant: COLOR_GENE
    }
]