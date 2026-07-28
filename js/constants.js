export const SCREEN_WIDTH = 800;
export const SCREEN_HEIGHT = 600;
export const TILE_SIZE = 32;
export const PLAYER_SPEED = 4;
export const POOP_TIMER = 1000; // Milisegundos para explotar

export const MAP_WIDTH_TILES = 25;
export const MAP_HEIGHT_TILES = 18;

export const MAP_OFFSET_X = Math.floor((SCREEN_WIDTH - (MAP_WIDTH_TILES * TILE_SIZE)) / 2);
export const MAP_OFFSET_Y = Math.floor((SCREEN_HEIGHT - (MAP_HEIGHT_TILES * TILE_SIZE)) / 2);

export const LEVEL_LAYOUT = [
    "WWWWWWWWWWWWWWWWWWWWWWWWW",
    "W.......................W",
    "W.W.D.D.D.D.D.D.D.D.W.W.W",
    "W.W.W.D.W.W.W.W.W.D.W.W.W",
    "W.W.W.D.W.D.D.D.W.D.W.W.W",
    "W.D.D.D.D.D.W.D.D.D.D.D.W",
    "W.W.W.D.W.D.W.D.W.D.W.W.W",
    "W.W.W.D.W.D.W.D.W.D.W.W.W",
    "W.D.D.D.D.D.D.D.D.D.D.D.W",
    "W.W.W.D.W.D.W.D.W.D.W.W.W",
    "W.W.W.D.W.D.W.D.W.D.W.W.W",
    "W.D.D.D.D.D.W.D.D.D.D.D.W",
    "W.W.W.D.W.D.D.D.W.D.W.W.W",
    "W.W.W.D.W.W.W.W.W.D.W.W.W",
    "W.W.D.D.D.D.D.D.D.D.W.W.W",
    "W.W.W.W.W.W.W.W.W.W.W.W.W",
    "W.......................W",
    "WWWWWWWWWWWWWWWWWWWWWWWWW"
];