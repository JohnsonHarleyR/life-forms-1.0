import { AllCreatureDefaults, Gender } from "../../../../crosscutting/constants/creatureConstants"

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