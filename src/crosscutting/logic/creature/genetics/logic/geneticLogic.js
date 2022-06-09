import { Dominance } from "../../../../constants/geneticConstants";
import { getRandomItemInArray } from "../../../universalLogic";
import Gene from "../subclasses/gene";
import Trait from "../subclasses/trait";

// testing
export const getPrivateGeneticMethodsForTesting = () => {
    return {

    };
}


// gene and trait logic
export const createNewGeneFromConstant = (constant, dominanceToChoose) => {
    let traitDefault = null;
    if (dominanceToChoose === Dominance.DOMINANT) {
        traitDefault = getRandomItemInArray(constant.dominantTraits);
    } else {
        traitDefault = getRandomItemInArray(constant.recessiveTraits);
    }

    let xTrait = createNewTraitFromConstant(traitDefault);
    let yTrait = createNewTraitFromConstant(traitDefault);

    let newGene = new Gene(constant.name, constant.dominantTraits, constant.recessiveTraits,
        xTrait, yTrait);
    
    return newGene;
}
export const createNewTraitFromConstant = ({name, dominance, alter}) => {
    let newTrait = new Trait(name, dominance, 0, alter);
    return newTrait;
}

export const determineChosenTrait = (xTrait, yTrait) => {

}

