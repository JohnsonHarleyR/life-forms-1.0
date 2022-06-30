import { DefaultObjects, ObjectType } from "../../../crosscutting/constants/objectConstants";
import { CanvasInfo } from "../../../crosscutting/constants/canvasConstants";
import { Gender, LifeStage, Boop, Bleep, Biddy, StartingCreatureDefaults, PassedOnCreatures } from "../../../crosscutting/constants/creatureConstants";
import NewObject from "../../../crosscutting/logic/object/objects";
import { fillBackground, drawAllObjects, drawAllCreatures, drawAllPlants,
    drawAllShelters, drawAllCreatureLines, drawAllShelterTexts } from "../../../crosscutting/logic/canvasLogic";
import { isCollision } from "../../../crosscutting/logic/universalLogic";
import { getRandomPlantStartPosition } from "../../../crosscutting/logic/object/plants/plantsLogic";
import Plant from "../../../crosscutting/logic/object/plants/plant";
import { getRandomCreatureStartPosition } from "../../../crosscutting/logic/creature/creatureLogic";
import Creature from "../../../crosscutting/logic/creature/creature";
import { PlantDefaults } from "../../../crosscutting/constants/plantConstants";

// TODO generateCreature, generatePlant


// Creating and generating functions

export const createObjects = (startingObjects) => { // TODO create object class so that this will work
    let constants = startingObjects;

    let objs = [];
    constants.forEach(c => {
        let newObj = new NewObject(c.name, c.type, c.color, c.xStart, c.yStart, c.width, c.height);
        objs.push(newObj);
    })

    return objs;
};

export const createCreatures = (startingCreatureTypes, objects, plants, shelters, setCreatures, setPlants, setShelters) => {
    
    let array = [];
    //array.push(creature); // HACK this is only while there is a main creature to test

    startingCreatureTypes.forEach(sc => {
        for (let i = 0; i < sc.count; i++) {
            array.push(generateCreature(sc.gender, LifeStage.ADULT, sc.type, null, null, array, objects, plants, shelters, setCreatures, setPlants, setShelters));
        }
    });
    
    return array;
}

const generateCreature = (gender, lifeStage = LifeStage.CHILD, info, mother, father, creatures, objects, plants, shelters, setCreatures, setPlants, setShelters) => { // TODO Be sure to include an id too - make it easier to pull out
    let index = creatures.length;
    let randomPosition = getRandomCreatureStartPosition(info, creatures, objects, plants, shelters);
    let creature = new Creature({id: `c${index}`, gender: gender, lifeStage: lifeStage, position: randomPosition, 
        mother: mother, father: father, targetPosition: randomPosition, setPlants: setPlants, setCreatures: setCreatures, setShelters: setShelters, ...info });
    return creature;
}

export const generatePlants = (intervals, plants, creatures, objects, shelters, plantConstants, setPlants, largestCreatureSize) => { // TODO Be sure to include an id too - make it easier to pull out
    if (creatures === null || creatures === undefined) {
        return;
    }
    
    if (plants.length > PlantDefaults.MAX_TOTAL_PLANTS) {
        return;
    }

    //let plantCounts = countPlants(plantConstants, plants);
    
    let plantsCopy = [...plants];
    let index = plantsCopy.length;
    plantConstants.forEach(p => {
        //let count = plantCounts[`${p.type}`];
        if (intervals % p.growInterval === 0 
            //&& count <= PlantDefaults.MAX_PLANTS
        ) {
            let newPlant = generatePlant(index, p, plantsCopy, creatures, objects, shelters, largestCreatureSize);
            plantsCopy.push(newPlant);
            index++;
        }
    })
    setPlants(plantsCopy);
}

const countPlants = (plantConstants, plants) => {
    let counts = new Object();
    plantConstants.forEach(c => {
        counts[`${c.type}`] = 0;
    });

    plants.forEach(p => {
        counts[`${p.type}`]++;
    });

    return counts;
}

const generatePlant = (index, speciesInfo, plants, creatures, objects, shelters, largestCreatureSize) => { // TODO Be sure to include an id too - make it easier to pull out
    let startPos = getRandomPlantStartPosition(speciesInfo, creatures, objects, plants, shelters, largestCreatureSize);
    let newPlant = new Plant({...speciesInfo, id: `p${index}`, xStart: startPos.xStart, yStart: startPos.yStart});
    return newPlant;
}

// helper functions

export const renderCanvas = (canvasRef, creatures, plants, objects, shelters) => {
    fillBackground(canvasRef.current, CanvasInfo.BG_COLOR);
    //drawPathLine({ canvas: canvasRef.current, ...lineInfo });
    //drawXMark(canvasRef.current, chosenCreature.targetPosition);
    drawAllPlants(canvasRef.current, plants);
    drawAllShelters(canvasRef.current, shelters);
    //drawCreature(canvasRef.current, CanvasInfo, creature);
    drawAllCreatureLines(canvasRef.current, CanvasInfo, creatures);
    drawAllObjects(canvasRef.current, objects);
    drawAllCreatures(canvasRef.current, CanvasInfo, creatures);
    drawAllShelterTexts(canvasRef.current, shelters);
};

export const updateShelters = (creatures, setShelters) => {
    let shelters = [];
    let shelterNames = [];
    creatures.forEach(c => {
        if (c.safety.shelter !== null && 
            !shelterNames.includes(c.safety.shelter.id)) {
                shelterNames.push(c.safety.shelter.id);
                shelters.push(c.safety.shelter);
            }
    })
    setShelters(shelters);
}

export const updatePlants = (plants, setPlants) => {
    let newPlants = [];
    plants.forEach(p => {
        if (!p.isEaten) {
            newPlants.push(p);
        }
    });
    setPlants(newPlants);
}

export const updateCreatures = (creatures, setCreatures) => {
    let newCreatures = [];
    let creatureNames = [];
    let newPassedOn = [];
    let passedOnNames = [];
    creatures.forEach(c => {
        if (!c.hasLeftWorld && !creatureNames.includes(c.id)) {
            newCreatures.push(c);
            creatureNames.push(c.id);
        } else if (!passedOnNames.includes(c.id)) {
            newPassedOn.push(c);
            passedOnNames.push(c.id);
        }
        // if (( (c.life.isDead && !c.isEaten) || (!c.isEaten && !c.life.isDead)) 
        // && !creatureNames.includes(c.id)) {
        //     newCreatures.push(c);
        //     creatureNames.push(c.id);
        // }
        c.family.children.forEach(ch => {
            if (!ch.hasLeftWorld && !creatureNames.includes(ch.id)) {
                newCreatures.push(ch);
                creatureNames.push(ch.id);
            } else if (!passedOnNames.includes(ch.id)) {
                newPassedOn.push(ch);
                passedOnNames.push(ch.id);
            }
        })
        // c.family.children.forEach(ch => {
        //     if (((c.life.isDead && !c.isEaten) || (!c.isEaten && !c.life.isDead))
        //     && !isInArray(ch.id, creatureNames)) {
        //         newCreatures.push(ch);
        //         creatureNames.push(ch.id);
        //     }
        // })
    });
    resetHasMovedForCreatures(newCreatures);
    //console.log(`number of creatures: ${newCreatures.length}`);
    setCreatures(newCreatures);
    // setPassedOn(newPassedOn);
    newPassedOn.forEach(npo => {
        PassedOnCreatures.push(npo);
    });
}

const resetHasMovedForCreatures = (creatures) => {
    creatures.forEach(c => {
        c.movement.hasMoved = false;
    });
}

const isInArray = (str, array) => {
    let result = false;
    array.forEach(a => {
        if (a === str) {
            result = true;
        }
    });
    return result;
}

export const setCreatureResult = (creature, result) => {
    creature.color = result.color;
    creature.size = result.size;
    creature.width = result.width;
    creature.height = result.height;
    creature.energy = result.energy;
    creature.life = result.life;
    creature.safety = result.safety;
    creature.family = result.family;
    creature.mating = result.mating;
    creature.needs = result.needs;
    creature.food = result.food;
    creature.targetType = result.targetType;
    creature.currentTarget = result.currentTarget;
    creature.targetPosition = result.targetPosition;
    creature.inventory = result.inventory;
    creature.position = result.position;
    creature.movement = result.movement;
}

// testing functions

export const showMousePos = (event, canvasRef) => {
    let pos = getMousePos(canvasRef.current, event);
    console.log(JSON.stringify(pos));
};

const getMousePos = (canvas, event) => {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return { x: x, y: y };
};