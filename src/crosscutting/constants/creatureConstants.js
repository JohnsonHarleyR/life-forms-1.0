import { PlantSpecies } from "./plantConstants";
import { minutesToMilliseconds } from "../logic/universalLogic";

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
    moveMode:  MoveMode.SEARCH,
    CHILD_MIN_FRACTION: .2,
    CHILD_MIN: 2.5,
    ELDER_SHRINK: .1,
    DECEASED_SHRINK: .25,
    DEATH_COLOR: "#808080",
    FEMALE_COLOR: "#F020D1",
    MALE_COLOR: "#001CDA",
    GENDER_BLEND_AMOUNT: .15
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
    MATE: "MATE",
    HAVE_CHILD: "HAVE_CHILD",
    DIE: "DIE",
    NONE: "NONE"
}

export const NeedType = {
    FOOD_FOR_SELF: "FOOD_FOR_SELF",
    FOOD_FOR_FAMILY: "FOOD_FOR_FAMILY",
    SHELTER: "SHELTER",
    SLEEP: "SLEEP",
    MATE: "MATE",
    NONE: "NONE"
}

export const SleepProps = {
    HOURS_PER_YEAR: 24,
    HOURS_FOR_FULL_RESTORE: 8
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
    BLEEP: "BLEEP"
};

export const Boop = {
    type: CreatureType.BOOP,
    color: "#A020F0",
    food: {
        plants: [PlantSpecies.SHRUB, PlantSpecies.WHEAT],
        prey: []
    },
    energy: 20,
    size: 10,
    sightRadius: 20,
    sightDistance: 60,
    speed: 5,
    lifeSpanRange: {
        low: minutesToMilliseconds(10),
        high: minutesToMilliseconds(15)
    },
    maxYears: 100,
    fractionAsChild: .1,
    fractionAsElder: .15,
    foodToGatherAtOnce: 5,
    maxFood: 100,
    maxSleep: 100,
    maxMating: 100,
    sleepNeeded: AmountNeeded.AVG,
    foodNeeded: AmountNeeded.AVG,
    matingNeeded: AmountNeeded.AVG,
    genderOfProvider: Gender.FEMALE,
    genderOfCaregiver: Gender.MALE,
    genderOfShelterMaker: Gender.FEMALE,
    pregnancyTerm: 1, // TODO determine quotient
    minOffspring: 1,
    maxOffspring: 3
};

export const Bleep = {
    type: CreatureType.BLEEP,
    color: "#03BB85",
    food: {
    plants: [PlantSpecies.WEED],
    prey: []
    },
    energy: 15,
    size: 8,
    sightRadius: 30,
    sightDistance: 60,
    speed: 5,
    lifeSpanRange: {
        low: minutesToMilliseconds(5),
        high: minutesToMilliseconds(7)
    },
    maxYears: 20,
    fractionAsChild: .1,
    fractionAsElder: .15,
    foodToGatherAtOnce: 5,
    maxFood: 50,
    maxSleep: 50,
    maxMating: 50,
    sleepNeeded: AmountNeeded.MAX,
    foodNeeded: AmountNeeded.MIN,
    matingNeeded: AmountNeeded.MAX,
    genderOfProvider: Gender.MALE,
    genderOfCaregiver: Gender.FEMALE,
    genderOfShelterMaker: Gender.MALE,
    pregnancyTerm: .7,  // TODO determine quotient
    minOffspring: 2,
    maxOffspring: 5
};
