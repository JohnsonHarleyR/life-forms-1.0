import { XMark, PathLine, SightLine, ShelterLine } from "../constants/canvasConstants";

// TODO drawCreature, drawSightBox

// basic drawing

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
    let leftXEnd = leftXStart + XMark.WIDTH;
    let leftYEnd = leftYStart + XMark.HEIGHT;

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
        creatures.forEach(c => {
            drawCreature(canvas, canvasInfo, c);
        })
    }
}

const drawCreature = (canvas, canvasInfo, creature) => { // TODO
    console.log('drawCreature');
}

const drawPathLine = ({ canvas, xStart, xEnd, yStart, yEnd }) => {
    drawLine(canvas, PathLine.COLOR, PathLine.LINE_WIDTH, xStart, xEnd, yStart, yEnd);
};

const drawTargetMark = (canvas, position) => {
    drawXMark(canvas, XMark.COLOR, XMark.LINE_WIDTH, XMark.SIZE, position);
};

const drawSightBox = (canvas, canvasInfo, creature) => { // TODO - finish creature before using this method
    //   let coords = creature.getSightCoordinates(canvasInfo);

    let color = SightLine.COLOR;
    let lineWidth = SightLine.LINE_WIDTH;

    //drawBox(canvas, color, lineWidth, coords.xStart, coords.xEnd, coords.yStart, coords.yEnd);
}


// shelter drawing

const drawShelter = (canvas, canvasInfo, creature) => { 
// TODO
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