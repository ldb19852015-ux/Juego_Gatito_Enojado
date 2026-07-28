import { MAP_OFFSET_X, MAP_OFFSET_Y, TILE_SIZE, LEVEL_LAYOUT } from './constants.js';

export class GameMap {
    constructor() {
        this.walls = [];
        this.destructibles = [];
        
        this.wallImg = new Image();
        this.wallImg.src = 'assets/wall.png';
        
        this.destImg = new Image();
        this.destImg.src = 'assets/destructible.png';

        this.initMap();
    }

    initMap() {
        LEVEL_LAYOUT.forEach((row, r) => {
            for (let c = 0; c < row.length; c++) {
                const char = row[c];
                const x = c * TILE_SIZE + MAP_OFFSET_X;
                const y = r * TILE_SIZE + MAP_OFFSET_Y;
                const rect = { x, y, width: TILE_SIZE, height: TILE_SIZE };

                if (char === 'W') this.walls.push(rect);
                if (char === 'D') this.destructibles.push(rect);
            }
        });
    }

    removeBlocksInArea(explosionRect) {
        this.destructibles = this.destructibles.filter(block => {
            return !(block.x < explosionRect.x + explosionRect.width &&
                     block.x + block.width > explosionRect.x &&
                     block.y < explosionRect.y + explosionRect.height &&
                     block.y + block.height > explosionRect.y);
        });
    }

    draw(ctx) {
        this.walls.forEach(w => ctx.drawImage(this.wallImg, w.x, w.y, TILE_SIZE, TILE_SIZE));
        this.destructibles.forEach(d => ctx.drawImage(this.destImg, d.x, d.y, TILE_SIZE, TILE_SIZE));
    }
}