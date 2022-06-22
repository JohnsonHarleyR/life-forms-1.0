import { PlantSpecies } from "./plantConstants";
import { minutesToMilliseconds } from "../logic/universalLogic";
import { GeneticDefaults } from "./geneticConstants";

export const Direction = {
    NORTH: "NORTH",
    SOUTH: "SOUTH",
    EAST: "EAST",
    WEST: "WEST",
    NONE: "NONE"
};

export const MoveMode = {
    STAND_STILL: "STAND_STILL",
    TOWARD_POINT: "TOWARD_POINT",
    SEARCH: "SEARCH",
    HIDE: "HIDE",
    WANDER: "WANDER",
    GO_TO_SHELTER: "GO_TO_SHELTER",
    COMPLETE_MATING: "COMPLETE_MATING",
    THINK: "THINK", // for determining the next action,
    NONE: "NONE"
};

export const CreatureDefaults = {
    SHOW_LINES: false,
    MUTATE_GENES: true,
    SET_UP_GENES: true,
    ALTER_COLOR_BY_GENDER: false,
    MOVE_MODE:  MoveMode.THINK,
    LARGEST_SIZE: GeneticDefaults.MAX_SIZE,
    MAX_MOVE_RECORDINGS: 50,
    PATTERN_DETECTION_SIZE: 5,
    CHILD_MIN_FRACTION: .2,
    CHILD_MIN: 2.5,
    ELDER_SHRINK: .1,
    DECEASED_SHRINK: .25,
    DEATH_COLOR: "#808080",
    FEMALE_COLOR: "#F020D1",
    MALE_COLOR: "#001CDA",
    GENDER_BLEND_AMOUNT: .15,
    INTERVALS_BEFORE_NEW_TARGET_POSITION: 25
}

export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE"
}

export const LifeStage = {
    CHILD: "CHILD",
    ADULT: "ADULT",
    ELDER: "ELDER",
    DECEASED: "DECEASED"
}

export const CauseOfDeath = {
    OLD_AGE: "OLD_AGE",
    STARVATION: "STARVATION",
    WAS_EATEN: "WAS_EATEN",
    UNKNOWN: "UNKNOWN"
}

export const AmountNeeded = {
    MIN: "MIN",
    AVG: "AVG",
    MAX: "MAX"
}

export const ActionType = {
    FIND_SAFETY: "FIND_SAFETY",
    FEED_SELF: "FEED_SELF", // if shelter, and food in shelter, eat food in shelter, otherwise eat outside shelter
    FEED_FAMILY: "FEED_FAMILY", // bring food to shelter, eat from shelter if hunger over 20%
    CREATE_SHELTER: "CREATE_SHELTER",
    LEAVE_SHELTER: "LEAVE_SHELTER",
    SLEEP_IN_SHELTER: "SLEEP_IN_SHELTER",
    SLEEP_IN_SPOT: "SLEEP_IN_SPOT",
    FIND_MATE: "FIND_MATE",
    GATHER_FOOD_TO_MATE: "GATHER_FOOD_TO_MATE",
    MATE: "MATE",
    PRODUCE_OFFSPRING: "PRODUCE_OFFSPRING",
    HAVE_CHILD: "HAVE_CHILD",
    DIE: "DIE",
    BE_DEAD: "BE_DEAD",
    LEAVE_WORLD: "LEAVE_WORLD",
    NONE: "NONE"
}

export const NeedType = {
    FOOD_FOR_SELF: "FOOD_FOR_SELF",
    FOOD_FOR_FAMILY: "FOOD_FOR_FAMILY",
    FOOD_TO_MATE: "FOOD_TO_MATE",
    SHELTER: "SHELTER",
    ESCAPE: "ESCAPE",
    SLEEP: "SLEEP",
    MATE: "MATE",
    NONE: "NONE"
}

export const SleepProps = {
    HOURS_PER_YEAR: 24,
    HOURS_FOR_FULL_RESTORE: 8
}

export const TimeProps = {
    HOURS_PER_DAY: 24,
    MS_PER_DAY: minutesToMilliseconds(2)
}

export const AddOrSubtract = {
    ADD: "ADD",
    SUBTRACT: "SUBTRACT"
}

export const InventoryLocation = {
    CREATURE: "CREATURE",
    SHELTER: "SHELTER"
}

export const CreatureType = {
    BOOP: "BOOP",
    BLEEP: "BLEEP",
    BIDDY: "BIDDY"
};

export const CreatureTypeList = [
    CreatureType.BOOP,
    CreatureType.BLEEP,
    CreatureType.BIDDY
];

export const Boop = {
    type: CreatureType.BOOP,
    color: "#A020F0",
    food: {
        plants: [
            PlantSpecies.SHRUB,
            PlantSpecies.WHEAT,
            // PlantSpecies.BUD,
            PlantSpecies.WEED
        ],
        prey: []
    },
    energy: 20,
    size: 10,
    sightRadius: 20,
    sightDistance: 60,
    speed: 5,
    lifeSpanRange: {
        low: 70,
        high: 100
    },
    fractionAsChild: .1,
    fractionAsElder: .15,
    foodToGatherAtOnce: 5,
    sleepNeeded: 8,
    foodNeeded: 3,
    matingNeeded: 1.5, // how many days before it's needed again
    genderOfProvider: Gender.FEMALE,
    genderOfCaregiver: Gender.MALE,
    genderOfShelterMaker: Gender.FEMALE,
    canHaveMultipleLitters: true,
    minOffspring: 1,
    maxOffspring: 3
};

export const Bleep = {
    type: CreatureType.BLEEP,
    color: "#03BB85",
    food: {
    plants: [PlantSpecies.WEED],
    prey: [CreatureType.BIDDY]
    //prey: []
    },
    energy: 15,
    size: 8,
    sightRadius: 30,
    sightDistance: 60,
    //speed: 5,
    speed: 6,
    lifeSpanRange: {
        low: 15,
        high: 20
    },
    fractionAsChild: .1,
    fractionAsElder: .15,
    foodToGatherAtOnce: 5,
    sleepNeeded: 6,
    foodNeeded: 2,
    matingNeeded: 3,
    genderOfProvider: Gender.MALE,
    genderOfCaregiver: Gender.FEMALE,
    genderOfShelterMaker: Gender.MALE,
    canHaveMultipleLitters: false,
    minOffspring: 2,
    maxOffspring: 5
};

export const Biddy = {
    type: CreatureType.BIDDY,
    color: "#AD1360",
    food: {
    plants: [PlantSpecies.BUD],
    prey: []
    },
    energy: 15,
    size: 5,
    sightRadius: 50,
    sightDistance: 50,
    speed: 7,
    lifeSpanRange: {
        low: 10,
        high: 25
    },
    fractionAsChild: .05,
    fractionAsElder: .15,
    foodToGatherAtOnce: 5,
    sleepNeeded: 5,
    foodNeeded: 2,
    matingNeeded: 2,
    genderOfProvider: Gender.MALE,
    genderOfCaregiver: Gender.FEMALE,
    genderOfShelterMaker: Gender.MALE,
    canHaveMultipleLitters: false,
    minOffspring: 3,
    maxOffspring: 7
};


export const StartingCreatures = [
    {
        type: Boop,
        gender: Gender.FEMALE,
        count: 2
    },
    {
        type: Boop,
        gender: Gender.MALE,
        count: 2
    },
    {
        type: Bleep,
        gender: Gender.FEMALE,
        count: 1
    },
    {
        type: Bleep,
        gender: Gender.MALE,
        count: 1
    },
    {
        type: Biddy,
        gender: Gender.FEMALE,
        count: 3
    },
    {
        type: Biddy,
        gender: Gender.MALE,
        count: 3
    }
];