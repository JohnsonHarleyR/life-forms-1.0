import { PlantSpecies } from "./plantConstants";

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
    moveMode:  MoveMode.SEARCH
}

export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE"
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
    color: "purple",
    food: {
    plants: [PlantSpecies.SHRUB, PlantSpecies.WHEAT],
    prey: []
    },
    size: 10,
    sightRadius: 20,
    sightDistance: 60,
    speed: 5
};

export const Bleep = {
    type: CreatureType.BLEEP,
    color: "#03BB85",
    food: {
    plants: [PlantSpecies.WEED],
    prey: []
    },
    size: 8,
    sightRadius: 30,
    sightDistance: 60,
    speed: 5
};
