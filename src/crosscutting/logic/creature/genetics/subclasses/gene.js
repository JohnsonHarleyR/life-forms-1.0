import { determineChosenTrait } from "../logic/geneticLogic";

export default class Gene {
    constructor(name, dominantTraits, recessiveTraits, xTrait, yTrait) {
        this.name = name;
        this.dominantTraits = dominantTraits;
        this.recessiveTraits = recessiveTraits;
        this.xTrait = {...xTrait, generationCount: xTrait.generationCount + 1};
        this.yTrait = {...yTrait, generationCount: yTrait.generationCount + 1};

        this.chosenTrait = determineChosenTrait(this.xTrait, this.yTrait);
    }
}