export const PlantSpecies = {
    SHRUB: "SHRUB",
    WEED: "WEED",
    WHEAT: "WJEAT"
}

export const Shrub = {
    type: PlantSpecies.SHRUB,
    color: "#228B22",
    width: 6,
    height: 6,
    growInterval: 70,
    energy: 5
}

export const Weed = {
    type: PlantSpecies.WEED,
    color: "#00FF00",
    width: 5,
    height: 10,
    growInterval: 30,
    energy: 3
}

export const Wheat = {
    type: PlantSpecies.WHEAT,
    color: "#9ACD32",
    width: 5,
    height: 15,
    growInterval: 100,
    energy: 8
}

export const Plants = [Weed, Shrub, Wheat];