

export default class Trait {
    constructor(name, dominance, generationCount, 
        isMutation, alterationMethod, validationMethod, variables = null) {
        this.name = name;
        this.dominance = dominance;
        this.generationCount = generationCount;
        this.isMutation = isMutation;

        this.variables = variables;
        this.alter = (creature, variables = this.variables) => {
            return alterationMethod(creature, variables);
        };
        this.canHaveTrait = (creature) => {
            return validationMethod(creature);
        }
    }
}