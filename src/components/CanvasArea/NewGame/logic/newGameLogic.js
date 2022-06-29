import { AllCreatureDefaults, Gender } from "../../../../crosscutting/constants/creatureConstants"
import { Plants } from "../../../../crosscutting/constants/plantConstants";

//#region starting plant logic
export const createBlankPlantsIncludedArray = () => {
  let array = [];
  Plants.forEach(p => {
    array.push({
      type: p,
      isIncluded: false
    });
  });
  return array;
}

export const getInfoFromPlantsIncludedArray = (typeName, array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].type.type === typeName) {
      return array[i];
    }
  }
}

export const updatePlantsIncludedInArray = (typeName, newIsIncluded, array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].type.type === typeName) {
      array[i].isIncluded = newIsIncluded;
      break;
    }
  }
}

export const createStartingPlantsArray = (plantIncludedArray) => {
  let array = [];
  plantIncludedArray.forEach(pi => {
    if (pi.isIncluded) {
      array.push(pi.type);
    }
  });
  return array;
}
//#endregion

//#region starting creature logic
export const createBlankCreatureCountArray = () => {
  let array = [];
  AllCreatureDefaults.forEach(c => {
    array.push({
      type: c,
      maleCount: 0,
      femaleCount: 0
    });
  });
  return array;
}

export const getInfoFromCreatureCountArray = (typeName, array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].type.type === typeName) {
      return array[i];
    }
  }
}

export const updateCreatureCountInArray = (typeName, newCount, genderString, array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].type.type === typeName) {
      if (genderString === "male") {
        array[i].maleCount = newCount;
      } else {
        array[i].femaleCount = newCount;
      }
      break;
    }
  }
}

export const createStartingCreatureTypeArray = (creatureCountArray) => {
  let array = [];
  creatureCountArray.forEach(cc => {
    if (cc.femaleCount > 0) {
      array.push({
        type: cc.type,
        gender: Gender.FEMALE,
        count: cc.femaleCount
      });
    }
    if (cc.maleCount > 0) {
      array.push({
        type: cc.type,
        gender: Gender.MALE,
        count: cc.maleCount
      });
    }
  });
  return array;
}

//#endregion