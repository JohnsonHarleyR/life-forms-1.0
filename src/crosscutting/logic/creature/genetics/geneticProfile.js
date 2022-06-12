import { 
    Dominance,
    GeneticDefaults,
    LIST_OF_GENES
} from "../../../constants/geneticConstants";
import { getRandomItemInArray } from "../../universalLogic";
import { createDefaultGeneticProfile, createNewGeneFromConstant, createNewGeneFromParentGenes, getGeneFromProfile, setProfileProperty } from "./logic/geneticLogic";


export default class GeneticProfile {
    constructor(xProfile = null, yProfile = null, doSetUpGenes = true, mutateRandomGene = true) {
        this.colorGene = null;

        if (doSetUpGenes) {
            this.setUpGenes(xProfile, yProfile, mutateRandomGene);
        }
    }

    setUpGenes = (xProfile, yProfile, mutateRandomGene) => {
        // if xProfile and yProfile are null, then create default values for them
        if (xProfile === null) {
            xProfile = createDefaultGeneticProfile();
        }

        if (yProfile === null) {
            yProfile = createDefaultGeneticProfile();
        }

        // now set up all the genes without mutating yet
        let geneConstantList = LIST_OF_GENES;
        geneConstantList.forEach(c => {
            let xGene = getGeneFromProfile(xProfile, c.geneType);
            let yGene = getGeneFromProfile(yProfile, c.geneType);
            let newGene = createNewGeneFromParentGenes(xGene, yGene);
            setProfileProperty(this, c.geneType, newGene);
        });

        // if this is set to mutate a random gene, run through the genes
        // until we find one that isn't mutated. If we do, then replace that
        // gene with random recessive traits.
        if (mutateRandomGene) {
            let geneToMutate = this.selectGeneToMutateFromList(geneConstantList);
            if (geneToMutate !== null) {
                let replacementGene = createNewGeneFromConstant(geneToMutate.constant, Dominance.RECESSIVE);
                setProfileProperty(this, geneToMutate.geneType, replacementGene);
            }
        }
    }

    selectGeneToMutateFromList = (geneConstantList) => {
        let listItem = null;
        let itemsTried = [];
        let attemptCount = 0;

        do {
            let possibleItem = getRandomItemInArray(geneConstantList);
            if (!itemsTried.includes(possibleItem.geneType) && 
            !possibleItem.xTrait.isMutated && !possibleItem.xTrait.isMutated) {
                listItem = possibleItem;
            }
            itemsTried.push(possibleItem.geneType);
            attemptCount++;
        } while (listItem === null && itemsTried.length < geneConstantList.length
        && attemptCount < GeneticDefaults.ATTEMPTS_TO_MUTATE_ALLOWED);

        // return result
        return listItem;
    }
}