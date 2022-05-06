import { PlantSpecies } from "./plantConstants";
import { minutesToMilliseconds } from "../logic/universalLogic";

export const Direction = {
    NORTH: "NORTH",
    SOUTH: "SOUTH",
    EAST: "EAST",
    WEST: "WEST"
};

export const MoveMode = {
    STAND_STILL: "STAND_STILL",
    TOWARD_POINT: "TOWARD_POINT",
    SEARCH: "SEARCH",
    HIDE: "HIDE",
    WANDER: "WANDER"
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

export const NeedType = {
    FOOD: "FOOD",
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
    fractionAsChild: .1,
    fractionAsElder: .15,
    sleepNeeded: AmountNeeded.AVG,
    foodNeeded: AmountNeeded.AVG
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
    fractionAsChild: .1,
    fractionAsElder: .15,
    sleepNeeded: AmountNeeded.MAX,
    foodNeeded: AmountNeeded.MIN
};
