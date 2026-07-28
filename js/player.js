import { MAP_OFFSET_X, MAP_OFFSET_Y, SCREEN_WIDTH, SCREEN_HEIGHT, PLAYER_SPEED } from './constants.js';

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 28;
        this.speed = PLAYER_SPEED;
        this.lives = 3;
        this.isAlive = true;
        this.facingLeft = false;
        
        this.images = [0, 1, 2].map(i => {
            const img = new Image();
            img.src = `assets/player_${i}.png`;
            return img;
        });
        this.imageIndex = 0;
        this.animationTimer = 0;
        this.invulnerableUntil = 0;
    }

    update(keys, obstacles) {
        if (!this.isAlive) return;

        let dx = 0;
        let dy = 0;
        let moving = false;

        if (keys['ArrowLeft']) { dx = -this.speed; moving = true; this.facingLeft = true; }
        else if (keys['ArrowRight']) { dx = this.speed; moving = true; this.facingLeft = false; }

        if (keys['ArrowUp']) { dy = -this.speed; moving = true; }
        else if (keys['ArrowDown']) { dy = this.speed; moving = true; }

        if (moving) {
            this.animationTimer++;
            if (this.animationTimer >= 10) {
                this.animationTimer = 0;
                this.imageIndex = (this.imageIndex + 1) % 3;
            }
        } else {
            this.imageIndex = 0;
            this.animationTimer = 0;
        }

        // Movimiento en X y colisiones
        this.x += dx;
        let playerRect = this.getRect();
        for (let obs of obstacles) {
            if (this.checkCollision(playerRect, obs)) {
                if (dx > 0) this.x = obs.x - this.width;
                if (dx < 0) this.x = obs.x + obs.width;
                playerRect = this.getRect();
            }
        }

        // Movimiento en Y y colisiones
        this.y += dy;
        playerRect = this.getRect();
        for (let obs of obstacles) {
            if (this.checkCollision(playerRect, obs)) {
                if (dy > 0) this.y = obs.y - this.height;
                if (dy < 0) this.y = obs.y + obs.height;
                playerRect = this.getRect();
            }
        }

        const minX = MAP_OFFSET_X;
        const minY = MAP_OFFSET_Y;
        const maxX = MAP_OFFSET_X + 25 * 32 - this.width;
        const maxY = MAP_OFFSET_Y + 18 * 32 - this.height;

        if (this.x < minX) this.x = minX;
        if (this.x > maxX) this.x = maxX;
        if (this.y < minY) this.y = minY;
        if (this.y > maxY) this.y = maxY;
    }

    getRect() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    die(currentTime) {
        if (currentTime > this.invulnerableUntil) {
            this.lives--;
            this.invulnerableUntil = currentTime + 1000;
            if (this.lives <= 0) this.isAlive = false;
            return true;
        }
        return false;
    }

    draw(ctx, currentTime) {
        if (!this.isAlive) return;
        if (currentTime < this.invulnerableUntil && Math.floor(currentTime / 100) % 2 === 0) {
            return; 
        }

        ctx.save();
        if (this.facingLeft) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.images[this.imageIndex], -this.x - this.width, this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.images[this.imageIndex], this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }
}