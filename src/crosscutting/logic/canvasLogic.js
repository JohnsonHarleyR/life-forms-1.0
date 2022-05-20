import { XMark, PathLine, SightLine, ShelterLine, SleepIndicator } from "../constants/canvasConstants";
import { getStartAndEndPoints } from "./universalLogic";

// TODO drawCreature, drawSightBox

// basic drawing

const drawText = (canvas, text, font, fontColor, xStart, yStart) => {
    let ctx = canvas.getContext("2d");

    ctx.font = font;
    ctx.fillStyle = fontColor;
    ctx.fillText(text, xStart, yStart);
}

const drawLine = (canvas, color, lineWidth, xStart, xEnd, yStart, yEnd) => {
    let ctx = canvas.getContext("2d");

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();
    ctx.closePath();
}

const drawXMark = (canvas, color, lineWidth, size, position) => {
    let ctx = canvas.getContext("2d");

    let halfX = size / 2;
    let halfY = size / 2;

    let leftXStart = position.x - halfX;
    let leftYStart = position.y - halfY;
    let leftXEnd = leftXStart + size;
    let leftYEnd = leftYStart + size;

    let rightXStart = leftXEnd;
    let rightYStart = leftYStart;
    let rightXEnd = leftXStart;
    let rightYEnd = leftYEnd;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.moveTo(leftXStart, leftYStart);
    ctx.lineTo(leftXEnd, leftYEnd);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(rightXStart, rightYStart);
    ctx.lineTo(rightXEnd, rightYEnd);
    ctx.stroke();
    ctx.closePath();
}

const drawBox = (canvas, color, lineWidth, xStart, xEnd, yStart, yEnd) => {
    // Top
    drawLine(canvas, color, lineWidth, xStart, xEnd, yStart, yStart);
    // Bottom
    drawLine(canvas, color, lineWidth, xStart, xEnd, yEnd, yEnd);
    // Left
    drawLine(canvas, color, lineWidth, xStart, xStart, yStart, yEnd);
    // Right
    drawLine(canvas, color, lineWidth, xEnd, xEnd, yStart, yEnd);
}

// canvas aesthetic

export const fillBackground = (canvas, color) => {
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// creature drawing

export const drawAllCreatures = (canvas, canvasInfo, creatures) => {
    if (creatures) {
        // draw creature lines if they're supposed to show them
        creatures.forEach(c => {
            drawCreatureLines(canvas, canvasInfo, c);
        })
        // then draw creatures
        creatures.forEach(c => {
            drawCreature(canvas, canvasInfo, c);
        })
    }
}

const drawCreature = (canvas, canvasInfo, creature) => { // TODO
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    let halfSize = creature.size / 2;
    ctx.fillStyle = creature.color;
    ctx.fillRect(
      creature.position.x - halfSize,
      creature.position.y - halfSize,
      creature.size,
      creature.size
    );
    ctx.closePath();

    if (creature.needs.isSleeping) {
        console.log(`drawing sleep for ${creature.id}`);
        drawSleepIndicator(canvas, creature);
    }
}

const drawSleepIndicator = (canvas, creature) => {
    let points = getStartAndEndPoints(creature.id, creature.position, creature.size, creature.size);
    let text = SleepIndicator.TEXT;
    let font = SleepIndicator.FONT;
    let fontColor = creature.color;
    let xStart = points.xEnd + SleepIndicator.X_OFFSET;
    let yStart = creature.yEnd + SleepIndicator.Y_OFFSET;
    drawText(canvas, text, font, fontColor, xStart, yStart);
}

const drawCreatureLines = (canvas, canvasInfo, creature) => {
    // draw sight box and also line info and mark if the creature says to
    if (creature.showLines) {
        drawSightBox(canvas, canvasInfo, creature);
        if (creature.position && creature.targetPosition) {
            if (creature.position.x !== creature.targetPosition.x && 
                creature.position.y !== creature.targetPosition.y) {
                    drawPathLine(canvas, creature);
                }
            drawTargetMark(canvas, creature.targetPosition);
        }
    }
}

const drawPathLine = (canvas, creature) => {
    let xStart = creature.position.x;
    let yStart = creature.position.y;
    let xEnd = creature.targetPosition.x;
    let yEnd = creature.targetPosition.y;
    drawLine(canvas, PathLine.COLOR, PathLine.LINE_WIDTH, xStart, xEnd, yStart, yEnd);
};
// const drawPathLine = ({ canvas, xStart, xEnd, yStart, yEnd }) => {
//     drawLine(canvas, PathLine.COLOR, PathLine.LINE_WIDTH, xStart, xEnd, yStart, yEnd);
// };

const drawTargetMark = (canvas, position) => {
    drawXMark(canvas, XMark.COLOR, XMark.LINE_WIDTH, XMark.SIZE, position);
};

const drawSightBox = (canvas, canvasInfo, creature) => { // TODO - finish creature before using this method
    let coords = creature.movement.getSightCoordinates(canvasInfo);

    let color = SightLine.COLOR;
    let lineWidth = SightLine.LINE_WIDTH;

    drawBox(canvas, color, lineWidth, coords.xStart, coords.xEnd, coords.yStart, coords.yEnd);
}


// shelter drawing

export const drawAllShelters = (canvas, shelters) => {
    if (shelters) {
        shelters.forEach(s => {
            drawShelter(canvas, s);
        });
    }
}

const drawShelter = (canvas, shelter) => { 
    let color = shelter.color;
    let lineWidth = ShelterLine.LINE_WIDTH;
    let xStart = shelter.getXStart();
    let yStart = shelter.getYStart();
    let xEnd = shelter.getXEnd();
    let yEnd = shelter.getYEnd();
  
    // draw each line edge
  
    // Top
    drawLine(canvas, color, lineWidth, xStart, xEnd, yStart, yStart);
    // Bottom
    drawLine(canvas, color, lineWidth, xStart, xEnd, yEnd, yEnd);
    // Left
    drawLine(canvas, color, lineWidth, xStart, xStart, yStart, yEnd);
    // Right
    drawLine(canvas, color, lineWidth, xEnd, xEnd, yStart, yEnd);

    // TODO add food energy number inside square

    // draw food amount
    drawText(canvas, shelter.totalFoodEnergy, ShelterLine.FONT, ShelterLine.FONT_COLOR, 
        xStart + ShelterLine.X_TEXT_OFFSET, yStart + ShelterLine.Y_TEXT_OFFSET);
}


// plant drawing

export const drawAllPlants = (canvas, plants) => {
    plants.forEach(p => {
        drawPlant(canvas, p);
    })
}

const drawPlant = (canvas, plant) => {
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = plant.color;
    ctx.fillRect(
    plant.xStart,
    plant.yStart,
    plant.width,
    plant.height
    );
    ctx.closePath();
};

// object drawing

export const drawAllObjects = (canvas, objects) => {
    objects.forEach((o) => {
        drawObject(canvas, o);
    });
};

const drawObject = (canvas, obj) => {
    let ctx = canvas.getContext("2d");
    //console.log(obj);
    ctx.beginPath();
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.xStart, obj.yStart, obj.width, obj.height);
    ctx.closePath();
};