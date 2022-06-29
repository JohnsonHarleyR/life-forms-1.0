export const CanvasDefaults = {
    USE_CREATE_MODE: true,
    START_GAME_WITH_CANVAS: false,
    RESIZE_FACTOR: 1, // TODO implement this into all sizing and such - use in any new sizing - keep as 1 until implemented fully

}

export const CanvasInfo = {
    WIDTH: 600 * CanvasDefaults.RESIZE_FACTOR,
    HEIGHT: 400 * CanvasDefaults.RESIZE_FACTOR,
    BG_COLOR: "#D3D3D3",
    INTERVAL: 50,
    OBJECT_PADDING: 2 * CanvasDefaults.RESIZE_FACTOR,
    STARTING_HOUR: 14
};

export const XMark = {
    SIZE: 10 * CanvasDefaults.RESIZE_FACTOR,
    COLOR: "red",
    LINE_WIDTH: 2
};

export const PathLine = {
    COLOR: "#39FF14",
    LINE_WIDTH: 1
};

export const SightLine = {
    COLOR: 'cyan',
    LINE_WIDTH: 1
};

export const ShelterLine = {
    LINE_WIDTH: 2,
    MULTIPLIER: 4,
    FONT: "10px serif",
    FONT_COLOR: "#000000",
    X_TEXT_OFFSET: 2 * CanvasDefaults.RESIZE_FACTOR,
    Y_TEXT_OFFSET: 9 * CanvasDefaults.RESIZE_FACTOR
};

export const SleepIndicator = {
    X_OFFSET: 3 * CanvasDefaults.RESIZE_FACTOR,
    Y_OFFSET: -10 * CanvasDefaults.RESIZE_FACTOR,
    FONT: "7px serif",
    TEXT: "Z"
}

export const Axis = {
    X: "X",
    Y: "Y"
};
