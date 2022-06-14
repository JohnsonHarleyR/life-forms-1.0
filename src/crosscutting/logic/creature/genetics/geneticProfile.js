import { 
    Dominance,
    GeneticDefaults,
    LIST_OF_GENES
} from "../../../constants/geneticConstants";
import { getRandomItemInArray } from "../../universalLogic";
import { createDefaultGeneticProfile, createNewGeneFromConstant, createNewGeneFromParentGenes, getGeneFromProfile, setProfileProperty } from "./logic/geneticLogic";
import { getProfileLogString } from "./tests/testHelpers/resultLogging";

export default class GeneticProfile {
    constructor(creature = null, doSetUpGenes = true, mutateRandomGene = true) {
        this.creature = creature;

        this.colorGene = null;

        this.allGenes = [this.colorGene];

        //this.permanentChanges = []; // these will be determined from dominant traits before mutating anything

        if (doSetUpGenes) {
            this.setUpGenes(mutateRandomGene);
        }

        this.applyGenesToCreature();
    }

    applyGenesToCreature = () => {
        if (this.creature === null) {
            return;
        }

        this.allGenes.forEach(g => {
            if (g !== null) {
                g.chosenTrait.alter(this.creature);
            }
        })
    }

    setUpGenes = (mutateRandomGene) => {
        // if xProfile and yProfile are null, then create default values for them
        let xProfile = null;
        if (this.creature !== null && this.creature.family.mother !== null) {
            xProfile = this.creature.family.mother.GeneticProfile;
        }
        if (xProfile === null) {
            xProfile = createDefaultGeneticProfile();
        }

        let yProfile = null;
        if (this.creature !== null && this.creature.family.father !== null) {
            yProfile = this.creature.family.father.GeneticProfile;
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

        //console.log(`Profile: ${JSON.stringify(this)}`);
        console.log(getProfileLogString(this));
    }

    selectGeneToMutateFromList = (geneConstantList) => {
        let listItem = null;
        let itemsTried = [];
        let attemptCount = 0;
        // let permanentNames = [];
        // this.permanentChanges.forEach(p => {
        //     permanentNames.push(p.name);
        // });

        do {
            let possibleItem = getRandomItemInArray(this.allGenes);
            if (!itemsTried.includes(possibleItem.geneType) && 
            //(permanentNames.includes(possibleItem.chosenTrait.name) ||
            (!possibleItem.xTrait.isMutation && !possibleItem.xTrait.isMutation)) {
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