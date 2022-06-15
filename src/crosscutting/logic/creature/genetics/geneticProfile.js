import { 
    Dominance,
    GeneticDefaults,
    LIST_OF_GENES
} from "../../../constants/geneticConstants";
import { getRandomItemInArray } from "../../universalLogic";
import { createDefaultGeneticProfile, createNewGeneFromConstant, createNewGeneFromParentGenes, geneHasValidRecessiveTraitForCreature, getGeneFromProfile, setProfileProperty } from "./logic/geneticLogic";
import { getProfileLogString } from "./tests/testHelpers/resultLogging";

export default class GeneticProfile {
    constructor(creature = null, doSetUpGenes = true, mutateRandomGene = true) {
        this.creature = creature;
        this.traitsAreApplied = false;

        this.colorGene = null;

        //this.permanentChanges = []; // these will be determined from dominant traits before mutating anything

        if (doSetUpGenes) {
            this.setUpGenes(mutateRandomGene);
        }

        this.applyGenesToCreature();
    }

    getAllGenes = () => {
        return [this.colorGene];
    }

    applyGenesToCreature = () => {
        if (this.traitsAreApplied || this.creature === null) {
            return;
        }

        let allGenes = this.getAllGenes();
        allGenes.forEach(g => {
            if (g !== null) {
                g.chosenTrait.alter(this.creature);
            }
        });
        this.traitsAreApplied = true;
    }

    setUpGenes = (mutateRandomGene) => {
        // if xProfile and yProfile are null, then create default values for them
        let xProfile = null;
        if (this.creature !== null && this.creature.family.mother !== null) {
            xProfile = this.creature.family.mother.geneticProfile;
        }
        if (xProfile === null) {
            xProfile = createDefaultGeneticProfile();
        }

        let yProfile = null;
        if (this.creature !== null && this.creature.family.father !== null) {
            yProfile = this.creature.family.father.geneticProfile;
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
        if (mutateRandomGene && this.creature !== null) {

            let geneToMutate = this.selectGeneToMutate();
            if (geneToMutate !== null) {
                let replacementGene = createNewGeneFromConstant(geneToMutate, Dominance.RECESSIVE, this.creature);
                if (replacementGene !== null) {
                    setProfileProperty(this, geneToMutate.geneType, replacementGene);
                }
            }
        }

        //console.log(`Profile: ${JSON.stringify(this)}`);
        console.log(getProfileLogString(this));
    }

    selectGeneToMutate = () => {
        let allGenes = this.getAllGenes();

        let listItem = null;
        let itemsTried = [];
        let attemptCount = 0;
        // let permanentNames = [];
        // this.permanentChanges.forEach(p => {
        //     permanentNames.push(p.name);
        // });

        do {
            let possibleGene = getRandomItemInArray(allGenes);
            //let possibleItem = getRandomItemInArray(possibleGene.recessiveTraits);
            if (!itemsTried.includes(possibleGene.name) && 
            //(permanentNames.includes(possibleItem.chosenTrait.name) ||
            (!possibleGene.xTrait.isMutation && !possibleGene.xTrait.isMutation &&
            geneHasValidRecessiveTraitForCreature(this.creature, possibleGene))) {
                listItem = possibleGene;
            }
            itemsTried.push(possibleGene.name);
            attemptCount++;
        } while (listItem === null && itemsTried.length < allGenes.length
        && attemptCount < GeneticDefaults.ATTEMPTS_TO_MUTATE_ALLOWED);

        // return result
        return listItem;
    }
}