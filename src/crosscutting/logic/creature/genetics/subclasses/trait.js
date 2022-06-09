

export default class Trait {
    constructor(name, dominance, generationCount, alterationMethod) {
        this.name = name;
        this.dominance = dominance;
        this.generationCount = generationCount;
        this.alter = (creature) => {
            alterationMethod(creature);
        }
    }
}