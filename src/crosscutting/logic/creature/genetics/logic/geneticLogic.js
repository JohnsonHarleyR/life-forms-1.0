import Trait from "../subclasses/trait";

// testing
export const getPrivateGeneticMethodsForTesting = () => {
    return {

    };
}


// gene and trait logic
export const createNewTraitFromConstant = ({name, dominance, alter}) => {
    let newTrait = new Trait(name, dominance, 0, alter);
    return newTrait;
}

export const determineChosenTrait = (xTrait, yTrait) => {

}

