import { alterColorByAmount,
    alterColorDarkOrLight,
    canColorChangeRequirementBeMet,
    getRandomIntInRange } from "../logic/universalLogic"


export const GeneticDefaults = {
    GENERATIONS_TO_BECOME_DOMINANT: 4,
    GENERATIONS_TO_BECOME_PERMANENT: 8,
    ATTEMPTS_TO_MUTATE_ALLOWED: 15,

    COLOR_CHANGE_MIN: 15,
    COLOR_CHANGE_MAX: 25,
    VALUE_CHANGE_MIN: 15,
    VALUE_CHANGE_MAX: 25,
    COLOR_DIFFERENCE_REQUIREMENT: 15
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
        let changeAmount = getRandomIntInRange(GeneticDefaults.COLOR_CHANGE_MIN, GeneticDefaults.COLOR_CHANGE_MAX);
        let newColor = alterColorByAmount(originalColor, ColorType.R, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.R,
            AddOrSubtract.ADD,
            GeneticDefaults.COLOR_CHANGE_MIN);
        return result;
    }
}

export const LESS_RED = {
    name: "LESS_RED",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = -1 * getRandomIntInRange(GeneticDefaults.COLOR_CHANGE_MIN, GeneticDefaults.COLOR_CHANGE_MAX);
        let newColor = alterColorByAmount(originalColor, ColorType.R, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.R,
            AddOrSubtract.SUBTRACT,
            GeneticDefaults.COLOR_CHANGE_MIN);
        return result;
    }
}

export const MORE_GREEN = {
    name: "MORE_GREEN",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = getRandomIntInRange(GeneticDefaults.COLOR_CHANGE_MIN, GeneticDefaults.COLOR_CHANGE_MAX);
        let newColor = alterColorByAmount(originalColor, ColorType.G, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.G,
            AddOrSubtract.ADD,
            GeneticDefaults.COLOR_CHANGE_MIN);
        return result;
    }
}

export const LESS_GREEN = {
    name: "LESS_GREEN",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = -1 * getRandomIntInRange(GeneticDefaults.COLOR_CHANGE_MIN, GeneticDefaults.COLOR_CHANGE_MAX);
        let newColor = alterColorByAmount(originalColor, ColorType.G, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.G,
            AddOrSubtract.SUBTRACT,
            GeneticDefaults.COLOR_CHANGE_MIN);
        return result;
    }
}

export const MORE_BLUE = {
    name: "MORE_BLUE",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = getRandomIntInRange(GeneticDefaults.COLOR_CHANGE_MIN, GeneticDefaults.COLOR_CHANGE_MAX);
        let newColor = alterColorByAmount(originalColor, ColorType.B, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.B,
            AddOrSubtract.ADD,
            GeneticDefaults.COLOR_CHANGE_MIN);
        return result;
    }
}

export const LESS_BLUE = {
    name: "LESS_BLUE",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = -1 * getRandomIntInRange(GeneticDefaults.COLOR_CHANGE_MIN, GeneticDefaults.COLOR_CHANGE_MAX);
        let newColor = alterColorByAmount(originalColor, ColorType.B, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.B,
            AddOrSubtract.SUBTRACT,
            GeneticDefaults.COLOR_CHANGE_MIN);
        return result;
    }
}

export const LIGHTER = {
    name: "LIGHTER",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = getRandomIntInRange(GeneticDefaults.VALUE_CHANGE_MIN, GeneticDefaults.VALUE_CHANGE_MAX);
        let newColor = alterColorDarkOrLight(originalColor, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.LIGHTER,
            AddOrSubtract.ADD,
            GeneticDefaults.VALUE_CHANGE_MIN);
        return result;
    }
}

export const DARKER = {
    name: "DARKER",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let originalColor = creature.adultColor;
        let changeAmount = -1 * getRandomIntInRange(GeneticDefaults.VALUE_CHANGE_MIN, GeneticDefaults.VALUE_CHANGE_MAX);
        let newColor = alterColorDarkOrLight(originalColor, changeAmount);
        
        creature.adultColor = newColor;
        creature.color = creature.life.determineColor();
    },
    canHaveTrait: (creature) => {
        let result = canColorChangeRequirementBeMet(
            creature.adultColor,
            ColorType.DARKER,
            AddOrSubtract.SUBTRACT,
            GeneticDefaults.VALUE_CHANGE_MIN);
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