

export default class Trait {
    constructor(name, dominance, generationCount, isMutation, alterationMethod, validationMethod) {
        this.name = name;
        this.dominance = dominance;
        this.generationCount = generationCount;
        this.isMutation = isMutation;
        this.alter = (creature) => {
            return alterationMethod(creature);
        };
        this.canHaveTrait = (creature) => {
            return validationMethod(creature);
        }
    }
}