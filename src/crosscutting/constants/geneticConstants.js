import { alterColorByAmount,
    alterColorDarkOrLight,
    canColorChangeRequirementBeMet,
    getRandomIntInRange } from "../logic/universalLogic"


export const GeneticDefaults = {
    GENERATIONS_TO_BECOME_DOMINANT: 4,
    GENERATIONS_TO_BECOME_PERMANENT: 8,
    ATTEMPTS_TO_MUTATE_ALLOWED: 15,
    COLOR_DIFFERENCE_REQUIREMENT: 10
}

export const Dominance = {
    DOMINANT: "DOMINANT",
    RECESSIVE: "RECESSIVE"
}

// misc
export const ColorType = {
    R: "R",
    G: "G",
    B: "B",
    DARKER: "DARKER",
    LIGHTER: "LIGHTER"
}

export const AddOrSubtract = {
    ADD: "ADD",
    SUBTRACT: "SUBTRACT"
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
    },
    canHaveTrait: () => {
        return true;
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
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.R,
            AddOrSubtract.ADD);
        return result;
    }
}

export const LESS_RED = {
    name: "LESS_RED",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = -1 * getRandomIntInRange(10, 20);
        let newColor = alterColorByAmount(originalColor, ColorType.R, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.R,
            AddOrSubtract.SUBTRACT);
        return result;
    }
}

export const MORE_GREEN = {
    name: "MORE_GREEN",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = getRandomIntInRange(10, 20);
        let newColor = alterColorByAmount(originalColor, ColorType.G, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.G,
            AddOrSubtract.ADD);
        return result;
    }
}

export const LESS_GREEN = {
    name: "LESS_GREEN",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = -1 * getRandomIntInRange(10, 20);
        let newColor = alterColorByAmount(originalColor, ColorType.G, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.G,
            AddOrSubtract.SUBTRACT);
        return result;
    }
}

export const MORE_BLUE = {
    name: "MORE_BLUE",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = getRandomIntInRange(10, 20);
        let newColor = alterColorByAmount(originalColor, ColorType.B, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.B,
            AddOrSubtract.ADD);
        return result;
    }
}

export const LESS_BLUE = {
    name: "LESS_BLUE",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = -1 * getRandomIntInRange(10, 20);
        let newColor = alterColorByAmount(originalColor, ColorType.B, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.B,
            AddOrSubtract.SUBTRACT);
        return result;
    }
}

export const LIGHTER = {
    name: "LIGHTER",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = -1 * getRandomIntInRange(15, 25);
        let newColor = alterColorDarkOrLight(originalColor, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.LIGHTER,
            AddOrSubtract.ADD);
        return result;
    }
}

export const DARKER = {
    name: "DARKER",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = -1 * getRandomIntInRange(15, 25);
        let newColor = alterColorDarkOrLight(originalColor, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.DARKER,
            AddOrSubtract.SUBTRACT);
        return result;
    }
}

// bringing traits together
export const ColorTrait = {
    DEFAULT: COLOR_DEFAULT,
    MORE_RED: MORE_RED,
    LESS_RED: LESS_RED,
    MORE_GREEN: MORE_GREEN,
    LESS_GREEN: LESS_GREEN,
    MORE_BLUE: MORE_BLUE,
    LESS_BLUE: LESS_BLUE,
    LIGHTER: LIGHTER,
    DARKER: DARKER,
}

// --gene
export const COLOR_GENE = {
    name: "COLOR_GENE",
    geneType: GeneType.COLOR,
    dominantTraits: [COLOR_DEFAULT],
    recessiveTraits: [
        MORE_RED,
        LESS_RED,
        MORE_GREEN,
        LESS_GREEN,
        MORE_BLUE,
        LESS_BLUE,
        LIGHTER,
        DARKER
    ]
}



// List of all genes
export const LIST_OF_GENES = [
    {
        geneType: GeneType.COLOR,
        constant: COLOR_GENE
    }
]