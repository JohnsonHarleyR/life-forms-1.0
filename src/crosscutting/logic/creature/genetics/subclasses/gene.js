import { getRandomItemInArray } from "../../../universalLogic";
import { determineChosenTrait, getDeepTraitCopy } from "../logic/geneticLogic";

export default class Gene {
    constructor(name, dominantTraits, recessiveTraits, xTrait, yTrait) {
        this.name = name;
        this.dominantTraits = dominantTraits;
        this.recessiveTraits = recessiveTraits;
        this.xTrait = xTrait;
        this.yTrait = yTrait;

        this.chosenTrait = determineChosenTrait(this.xTrait, this.yTrait);
    }

    getRandomTraitToPass = () => { // for passing a trait to the next generation
        let traits = [this.xTrait, this.yTrait];
        let chosen = getRandomItemInArray(traits);

        // make copy and increase generation count - also do not let it say mutation
        let alteredCopy = getDeepTraitCopy(chosen);
        alteredCopy.generationCount++;
        // let alteredCopy = {
        //     ...chosen,
        //     generationCount: chosen.generationCount + 1
        // };
        return alteredCopy;
    }
}