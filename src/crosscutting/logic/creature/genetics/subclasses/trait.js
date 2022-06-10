

export default class Trait {
    constructor(name, dominance, generationCount, isMutation, alterationMethod) {
        this.name = name;
        this.dominance = dominance;
        this.generationCount = generationCount;
        this.isMutation = isMutation;
        this.alter = (creature) => {
            alterationMethod(creature);
        }
    }
}