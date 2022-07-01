import { 
  StartingCreatureDefaults,
  Creatures,
  PassedOnCreatures,
} from "../../../../../crosscutting/constants/creatureConstants";

//#region creature sorting

export const getStartingCreatureTypes = () => {
  let typeList = [];
  StartingCreatureDefaults.forEach(sc => {
    if (!typeList.includes(sc.type.type)) {
      typeList.push(sc.type.type);
    }
  });

  typeList.sort((a, b) => {
    return a.localeCompare(b);
  });

  return typeList;
}


//#endregion

//#region determine creature stats

export const getStatsForCreatureType = (type) => {
  let passedOnCreatures = getCreaturesOfType(PassedOnCreatures, type);
  let livingCreatures = getCreaturesOfTypeSortOutDead(Creatures, type, passedOnCreatures);
  let allCreatures = combineAllCreatures(livingCreatures, passedOnCreatures);

  let livingCount = livingCreatures.length;
  let passedOnCount = passedOnCreatures.length;
  let totalCount = allCreatures.length;
  let highestGeneration = getHighestGenerationFromArray(allCreatures);

  let stats = {
    type: type,
    livingCount: livingCount,
    passedOnCount: passedOnCount,
    totalCount: totalCount,
    highestGeneration: highestGeneration,
  }

  return stats;
}

const getHighestGenerationFromArray = (array) => {
  let highest = 0;
  array.forEach(a => {
    if (a.generation > highest) {
      highest = a.generation;
    }
  });
  return highest;
}

const getCreaturesOfType = (array, type) => {
  let newArray = [];
  array.forEach(a => {
    if (a.type === type) {
      newArray.push(a);
    }
  });
  return newArray;
}

const getCreaturesOfTypeSortOutDead = (array, type, passedOnArray) => {
  let newArray = [];
  array.forEach(a => {
    if (a.type === type) {
      if (!a.life.isDead) {
        newArray.push(a);
      } else {
        passedOnArray.push(a);
      }
    }
  });
  return newArray;
}

const combineAllCreatures = (living, dead) => {
  let newArray = [...living];
  dead.forEach(d => {
    newArray.push(d);
  });
  return newArray;
}

//#endregion