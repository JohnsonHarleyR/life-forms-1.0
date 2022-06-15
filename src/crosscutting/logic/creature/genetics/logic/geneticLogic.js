import { Dominance, GeneticDefaults, GeneType, LIST_OF_GENES } from "../../../../constants/geneticConstants";
import { getRandomItemInArray } from "../../../universalLogic";
import GeneticProfile from "../geneticProfile";
import Gene from "../subclasses/gene";
import Trait from "../subclasses/trait";
import { CreatureDefaults } from "../../../../constants/creatureConstants";

// testing
export const getPrivateGeneticMethodsForTesting = () => {
    return {
        getDominantTrait: getDominantTrait,
        getTraitsWithHighestGenerationCount: getTraitsWithHighestGenerationCount,
        areTraitsIdentical: areTraitsIdentical,
        combineDominantTraits: combineDominantTraits,
        combineRecessiveTraits: combineRecessiveTraits
    };
}

// deep copy methods
export const getDeepTraitCopy = (trait) => {
    let newTrait = new Trait(trait.name, trait.dominance, trait.generationCount, trait.isMutation, trait.alter);
    return newTrait;
}

// genetic profile logic
export const createGeneticProfileForCreature = (creature, doSetUpGenes = CreatureDefaults.SET_UP_GENES, mutateRandomGene = CreatureDefaults.MUTATE_GENES) => {
    let newProfile = new GeneticProfile(creature, doSetUpGenes, mutateRandomGene);
    return newProfile;
}

export const createDefaultGeneticProfile = () => {
    let newProfile = new GeneticProfile(null, false, false);

    let geneConstantList = LIST_OF_GENES;
    geneConstantList.forEach(c => {
        let newGene = createNewGeneFromConstant(c.constant, Dominance.DOMINANT);
        setProfileProperty(newProfile, c.geneType, newGene);
    });

    return newProfile;
}

export const setProfileProperty = (profile, geneType, newValue) => {
    switch(geneType) {
        default:
            break;
        case GeneType.COLOR:
            profile.colorGene = newValue;
            break;
    }
}

export const getGeneFromProfile = (profile, geneType) => {
    switch(geneType) {
        default:
            throw `No valid geneType was passed into getGeneFromProfile. This should not happen. (GeneticLogic.js)`;
        case GeneType.COLOR:
            return profile.colorGene;
    }
}


// gene and trait logic

// create

export const createNewGeneFromParentGenes = (xGene, yGene) => {
    let name = xGene.name;
    let geneType = xGene.geneType;
    let xTrait = xGene.getRandomTraitToPass();
    let yTrait = yGene.getRandomTraitToPass();
    let dominantTraits = combineDominantTraits(xGene.dominantTraitsToPass, yGene.dominantTraitsToPass);
    let recessiveTraits = combineRecessiveTraits(xGene.recessiveTraitsToPass, yGene.recessiveTraitsToPass);
    
    let newGene = new Gene(name, geneType, dominantTraits, recessiveTraits,
        xTrait, yTrait);
    return newGene;
}

// exclusive (for when a recessive trait gets moved to dominant)
// do not include any traits that are not included in both sets
const combineRecessiveTraits = (xRecessive, yRecessive) => {
    let combined = [];
    xRecessive.forEach(x => {
        let canCombine = false;
        yRecessive.forEach(y => {
            if (x.name === y.name) {
                canCombine = true;
            }
        });
        if (canCombine) {
            combined.push(getDeepTraitCopy(x));
        }
    });
    return combined;
}

// inclusive - use all traits even if only in one set
const combineDominantTraits = (xDominant, yDominant) => {
    let combined = [];
    xDominant.forEach(x => {
        combined.push(getDeepTraitCopy(x));
    });

    let traitsToAdd = [];
    yDominant.forEach(y => {
        combined.forEach(c => {
            if (c.name !== y.name) {
                traitsToAdd.push(getDeepTraitCopy(y));
            }
        })
    });

    traitsToAdd.forEach(a => {
        combined.push(a);
    });

    return combined;
}

// NOTE: the below is for creating a default gene - if you pass in Dominance.DOMINANT,
// it will select the dominant trait... If you want a random mutation to take place
// for this gene, then choose Dominance.RECESSIVE
export const createNewGeneFromConstant = (constant, dominanceToChoose) => {
    let traitDefault = null;
    if (dominanceToChoose === Dominance.DOMINANT) {
        traitDefault = getRandomItemInArray(constant.dominantTraits);
    } else {
        traitDefault = getRandomItemInArray(constant.recessiveTraits);
    }

    let xTrait = createFirstGenerationTraitFromConstant(traitDefault);
    let yTrait = createFirstGenerationTraitFromConstant(traitDefault);


    let newGene = new Gene(constant.name, constant.geneType, constant.dominantTraits, constant.recessiveTraits,
        xTrait, yTrait);
    
    return newGene;
}

// NOTE: When using this method, it will assume generation 1
export const createFirstGenerationTraitFromConstant = ({name, dominance, alter, isMutation}) => {
    let newTrait = new Trait(name, dominance, 0, isMutation, alter);
    return newTrait;
}


// trait logic
export const determineChosenTrait = (xTrait, yTrait) => {
    let dominantTraitCount = 0;

    // is one or both traits dominant?
    let traits = [xTrait, yTrait];
    traits.forEach(t => {
        if (t.dominance === Dominance.DOMINANT) {
            dominantTraitCount++;
        }
    });

    let chosen = null;
    switch (dominantTraitCount) {
        case 2: // dominant
            chosen = getRandomItemInArray(traits);
            break;
        case 1: // 1 dominant, 1 recessive
            chosen = getDominantTrait(traits);
            break;
        case 0:
            let highest = getTraitsWithHighestGenerationCount(traits);
            if (highest.length > 1) {
                chosen = getRandomItemInArray(highest);
            } else {
                chosen = highest[0];
            }
            break;
    }

    // the generation count should already be increased while creating the gene - so it should be the same
    let newTrait = getDeepTraitCopy(chosen);

    // determine whether to make a trait dominant
    if (newTrait.Dominance === Dominance.RECESSIVE &&
        newTrait.generationCount >= GeneticDefaults.GENERATIONS_TO_BECOME_DOMINANT) {
        newTrait.dominance = Dominance.DOMINANT;
        // also change dominance of original trait - as it is now mutating!
        // NOTE: if traits were the same, then alter both traits
        if (!areTraitsIdentical(traits)) {
            chosen.dominance = Dominance.DOMINANT;
            chosen.isMutation = false; // set to false so it is ignored in trait changes
        } else {
            traits.forEach(t => {
                t.dominance = Dominance.DOMINANT;
                chosen.isMutation = false;
            });
        }
    }

    return newTrait;
}

// this method assumes an array with more than one trait
const areTraitsIdentical = (traits) => {
    if (traits.length < 2) {
        return false;
    }

    let areSame = true;
    let previousTrait = traits[0];
    for (let i = 1; i < traits.length; i++) {
        if (traits[i].name !== previousTrait.name || // BUG WARNING: Logic may be fuzzy with generation count
            traits[i].generationCount !== previousTrait.generationCount) {
                areSame = false;
                break;
        }

        previousTrait = traits[i];
    }

    return areSame;
}

const getDominantTrait = (traits) => {
    let dominant = null;
    for (let i = 0; i < traits.length; i++) {
        if (traits[i].dominance === Dominance.DOMINANT) {
            dominant = traits[i];
            break;
        }
    }

    return dominant;
}

// Should return array with all traits that have highest count
const getTraitsWithHighestGenerationCount = (traits) => {
    let highestCount = 0;
    let highest = [];
    for (let i = 0; i < traits.length; i++) {
        if (traits[i] === null) {
            continue;
        }
        
        if (traits[i].generationCount > highestCount) {
            highestCount = traits[i].generationCount;
            highest = [traits[i]];
        } else if (traits[i].generationCount === highestCount) {
            highest.push(traits[i]);
        }
    }

    return highest;
}
