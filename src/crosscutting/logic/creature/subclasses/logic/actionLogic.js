import { LifeStage } from "../../../../constants/creatureConstants"


export const makeCreatureDie = (creature) => {
    creature.life.LifeStage = LifeStage.DECEASED;
    creature.life.updateLife();
}

export const makeCreatureSleep = (creature) => {
    creature.needs.isSleeping = true;
}