import { ObjectType } from "../../../crosscutting/constants/objectConstants";
import { CanvasInfo } from "../../../crosscutting/constants/canvasConstants";
import { Gender, Boop, Bleep } from "../../../crosscutting/constants/creatureConstants";
import NewObject from "../../../crosscutting/logic/object/objects";
import { fillBackground, drawAllObjects, drawAllCreatures, drawAllPlants } from "../../../crosscutting/logic/canvasLogic";

// TODO generateCreature, generatePlant


// Creating and generating functions

export const createObjects = () => { // TODO create object class so that this will work
    let objs = [];
    objs.push(new NewObject("w1", ObjectType.WALL, "black", 65, 50, 15, 200));
    objs.push(new NewObject("w2", ObjectType.WALL, "black", 160, 140, 80, 20));
    objs.push(new NewObject("w3", ObjectType.WALL, "black", 320, 50, 15, 15));
    objs.push(new NewObject("w4", ObjectType.WALL, "black", 320, 95, 15, 110));
    objs.push(new NewObject("w5", ObjectType.WALL, "black", 320, 235, 15, 15));
    return objs;
};

export const createCreatures = (creature) => {
    let array = [];
    array.push(creature); // HACK this is only while there is a main creature to test

    // add test creatures
    array.push(generateCreature(Gender.FEMALE, Boop, array));
    array.push(generateCreature(Gender.MALE, Boop, array));
    array.push(generateCreature(Gender.MALE, Bleep, array));

    return array;
}

const generateCreature = () => { // TODO Be sure to include an id too - make it easier to pull out
    
}

export const generatePlant = () => { // TODO Be sure to include an id too - make it easier to pull out

}

// helper functions

export const renderCanvas = (canvasRef, creatures, plants, objects) => {
    fillBackground(canvasRef.current, CanvasInfo.BG_COLOR);
    //drawPathLine({ canvas: canvasRef.current, ...lineInfo });
    //drawXMark(canvasRef.current, chosenCreature.targetPosition);
    drawAllObjects(canvasRef.current, objects);
    drawAllPlants(canvasRef.current, plants);
    //drawCreature(canvasRef.current, CanvasInfo, creature);
    drawAllCreatures(canvasRef.current, CanvasInfo, creatures);
};

export const setCreatureResult = (creature, result, setPlants) => {
    creature.position = result.position;
    creature.speed = result.speed;
    creature.direction = result.direction;
    creature.moveMode = result.moveMode;
    creature.food = result.food;
    creature.targetType = result.targetType;
    creature.currentTarget = result.currentTarget;
    creature.inventory = result.inventory;
    creature.sightRadius = result.sightRadius;
    creature.sightDistance = result.sightDistance;
    creature.targetPosition = result.targetPosition;
    creature.sideOfCollision = result.sideOfCollison;
    creature.previousSide = result.previousSide;
    creature.newDirection = result.newDirection;
    creature.setPlants = setPlants;
    creature.setCreatures = null;
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