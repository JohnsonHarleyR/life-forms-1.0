import { getRandomItemInArray } from "../../../universalLogic";
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

    getRandomTraitToPass = () => { // for passing a trait to the next generation
        let traits = [this.xTrait, this.yTrait];
        let chosen = getRandomItemInArray(traits);

        // make copy and increase generation count - also do not let it say mutation
        let alteredCopy = {
            ...chosen,
            generationCount: chosen.generationCount + 1
        };
        return alteredCopy;
    }
}