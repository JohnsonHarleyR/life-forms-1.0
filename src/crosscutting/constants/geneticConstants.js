import { alterColorByAmount,
    alterColorDarkOrLight,
    canColorChangeRequirementBeMet,
    getRandomDecimalInRange,
    getRandomIntInRange, 
    roundToPlace} from "../logic/universalLogic"


export const GeneticDefaults = {
    GENERATIONS_TO_BECOME_DOMINANT: 4,
    GENERATIONS_TO_BECOME_PERMANENT: 8,
    
    CHANCE_OF_MUTATION: .75,
    POSSIBLE_MUTATIONS: 2,
    ATTEMPTS_TO_MUTATE_ALLOWED: 15,

    MIN_SPEED: 1,
    MAX_SPEED: 14,
    SPEED_CHANGE_MIN: .10,
    SPEED_CHANGE_MAX: .20,

    MIN_SIZE: 4,
    MAX_SIZE: 14,
    SIZE_CHANGE_MIN: .10,
    SIZE_CHANGE_MAX: .20,

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
    COLOR: "COLOR",
    SIZE: "SIZE",
    SPEED: "SPEED"
}

// SPEED
// --traits
export const SPEED_DEFAULT = {
    name: "DEFAULT",
    dominance: Dominance.DOMINANT,
    isMutation: false,
    alter: () => {
        return;
    },
    canHaveTrait: () => {
        return true;
    }
}

export const FASTER = {
    name: "FASTER",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let changePercent = 1 + getRandomDecimalInRange(
            GeneticDefaults.SPEED_CHANGE_MIN,
            GeneticDefaults.SPEED_CHANGE_MAX);
        let newSpeed = creature.movement.speed * changePercent;
        if (newSpeed > GeneticDefaults.MAX_SPEED) {
            newSpeed = GeneticDefaults.MAX_SPEED;
        }
        creature.movement.speed = roundToPlace(newSpeed, 2);
    },
    canHaveTrait: (creature) => {
        let minNewSpeed = (1 + GeneticDefaults.SPEED_CHANGE_MIN) * creature.movement.speed;
        if (minNewSpeed > GeneticDefaults.MAX_SPEED) {
            return false;
        } else {
            return true;
        }
    }
}

// --gene
export const SPEED_GENE = {
    name: "SPEED_GENE",
    geneType: GeneType.SPEED,
    dominantTraits: [SPEED_DEFAULT],
    recessiveTraits: [
        FASTER
    ]
}


// SIZE
// --traits
export const SIZE_DEFAULT = {
    name: "DEFAULT",
    dominance: Dominance.DOMINANT,
    isMutation: false,
    alter: () => {
        return;
    },
    canHaveTrait: () => {
        return true;
    }
}

export const LARGER = {
    name: "LARGER",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let changePercent = 1 + getRandomDecimalInRange(
            GeneticDefaults.SIZE_CHANGE_MIN,
            GeneticDefaults.SIZE_CHANGE_MAX);
        let newSize = creature.adultSize * changePercent;
        if (newSize > GeneticDefaults.MAX_SIZE) {
            newSize = GeneticDefaults.MAX_SIZE;
        }
        creature.adultSize = roundToPlace(newSize, 2);
        creature.size = creature.life.determineSize();
    },
    canHaveTrait: (creature) => {
        let minNewSize = (1 + GeneticDefaults.SIZE_CHANGE_MIN) * creature.adultSize;
        if (minNewSize > GeneticDefaults.MAX_SIZE) {
            return false;
        } else {
            return true;
        }
    }
}

export const SMALLER = {
    name: "SMALLER",
    dominance: Dominance.RECESSIVE,
    isMutation: true,
    alter: (creature) => {
        let changePercent = 1 - getRandomDecimalInRange(
            GeneticDefaults.SIZE_CHANGE_MIN,
            GeneticDefaults.SIZE_CHANGE_MAX);
        let newSize = creature.adultSize * changePercent;
        if (newSize < GeneticDefaults.MIN_SIZE) {
            newSize = GeneticDefaults.MIN_SIZE;
        }
        creature.adultSize = roundToPlace(newSize, 2);
        creature.size = creature.life.determineSize();
    },
    canHaveTrait: (creature) => {
        let maxNewSize = (1 - GeneticDefaults.SIZE_CHANGE_MIN) * creature.adultSize;
        if (maxNewSize < GeneticDefaults.MIN_SIZE) {
            return false;
        } else {
            return true;
        }
    }
}

// --gene
export const SIZE_GENE = {
    name: "SIZE_GENE",
    geneType: GeneType.SIZE,
    dominantTraits: [SIZE_DEFAULT],
    recessiveTraits: [
        LARGER,
        SMALLER
    ]
}

// COLOR

// --traits
export const COLOR_DEFAULT = {
    name: "DEFAULT",
    dominance: Dominance.DOMINANT,
    isMutation: false,
    alter: () => {
        return;
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

// // bringing traits together
// export const ColorTrait = {
//     DEFAULT: COLOR_DEFAULT,
//     MORE_RED: MORE_RED,
//     LESS_RED: LESS_RED,
//     MORE_GREEN: MORE_GREEN,
//     LESS_GREEN: LESS_GREEN,
//     MORE_BLUE: MORE_BLUE,
//     LESS_BLUE: LESS_BLUE,
//     LIGHTER: LIGHTER,
//     DARKER: DARKER,
// }

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
    },
    {
        geneType: GeneType.SIZE,
        constant: SIZE_GENE
    },
    {
        geneType: GeneType.SPEED,
        constant: SPEED_GENE
    }
]