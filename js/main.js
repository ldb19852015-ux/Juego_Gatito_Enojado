import { SCREEN_WIDTH, SCREEN_HEIGHT, TILE_SIZE, MAP_OFFSET_X, MAP_OFFSET_Y, POOP_TIMER } from './constants.js';
import { GameMap } from './map.js';
import { Player } from './player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hud = document.getElementById('hud');

let gameMap, player, poops, enemies, gameOver, victory, paused, gameStarted;
let audioPoop, audioDie, audioVictory, audioGameOver, audioBgMusic;

function initGame() {
    gameMap = new GameMap();
    player = new Player(MAP_OFFSET_X + TILE_SIZE, MAP_OFFSET_Y + TILE_SIZE);
    poops = [];
    enemies = [
        { x: MAP_OFFSET_X + 3 * TILE_SIZE + 2, y: MAP_OFFSET_Y + 1 * TILE_SIZE + 2, width: 28, height: 28, dx: 0, dy: 2, speed: 2 },
        { x: MAP_OFFSET_X + 17 * TILE_SIZE + 2, y: MAP_OFFSET_Y + 1 * TILE_SIZE + 2, width: 28, height: 28, dx: 2, dy: 0, speed: 2 }
    ];
    gameOver = false;
    victory = false;
    paused = false;
    gameStarted = false;
}

audioPoop = new Audio('assets/poopexplota.ogg');
audioDie = new Audio('assets/diecat.ogg');
audioVictory = new Audio('assets/victory.ogg');
audioGameOver = new Audio('assets/gameover.ogg');

audioBgMusic = new Audio('assets/background.ogg');
audioBgMusic.loop = true;
audioBgMusic.volume = 0.5;

initGame();

let keys = {};

function placePoop() {
    if (gameStarted && !paused && player.isAlive && poops.length < 5) {
        poops.push({
            x: player.x,
            y: player.y,
            width: TILE_SIZE,
            height: TILE_SIZE,
            spawnTime: performance.now(),
            exploding: false,
            explosionStart: 0
        });
    }
}

window.addEventListener('keydown', e => {
    keys[e.code] = true;

    if (e.code === 'Enter' && !gameStarted && !gameOver && !victory) {
        gameStarted = true;
        audioBgMusic.play().catch(() => {});
        requestAnimationFrame(gameLoop);
        return;
    }

    if (e.code === 'Escape' && gameStarted && !gameOver && !victory) {
        paused = !paused;
        if (paused) {
            audioBgMusic.pause();
        } else {
            audioBgMusic.play().catch(() => {});
        }
    }

    if (e.code === 'Enter' && (gameOver || victory)) {
        audioVictory.pause();
        audioGameOver.pause();
        audioVictory.currentTime = 0;
        audioGameOver.currentTime = 0;
        initGame();
        gameStarted = true;
        audioBgMusic.play().catch(() => {});
        requestAnimationFrame(gameLoop);
        return;
    }

    if (e.code === 'Numpad0' || e.code === 'Space') {
        placePoop();
    }
});

window.addEventListener('keyup', e => { keys[e.code] = false; });

const bindTouchButton = (id, code) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        
        if (!gameStarted && (gameOver || victory)) {
            initGame();
            gameStarted = true;
            audioBgMusic.play().catch(() => {});
            requestAnimationFrame(gameLoop);
            return;
        } else if (!gameStarted) {
            gameStarted = true;
            audioBgMusic.play().catch(() => {});
            requestAnimationFrame(gameLoop);
            return;
        }

        if (id === 'btn-bomb') {
            placePoop();
        } else {
            keys[code] = true;
        }
    }, { passive: false });

    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (id !== 'btn-bomb') {
            keys[code] = false;
        }
    }, { passive: false });
};

bindTouchButton('btn-up', 'ArrowUp');
bindTouchButton('btn-down', 'ArrowDown');
bindTouchButton('btn-left', 'ArrowLeft');
bindTouchButton('btn-right', 'ArrowRight');
bindTouchButton('btn-bomb', 'Space');

canvas.addEventListener('touchstart', (e) => {
    if (!gameStarted) {
        gameStarted = true;
        audioBgMusic.play().catch(() => {});
        requestAnimationFrame(gameLoop);
    } else if (gameOver || victory) {
        initGame();
        gameStarted = true;
        audioBgMusic.play().catch(() => {});
        requestAnimationFrame(gameLoop);
    }
}, { passive: false });

const imgCaca = new Image();
imgCaca.src = 'assets/caca.png';

const imgEnemy = new Image();
imgEnemy.src = 'assets/enemy.png';

const explosionImages = [1, 2, 3, 4, 5].map(i => {
    const img = new Image();
    img.src = `assets/explosion_${i}.png`;
    return img;
});

function gameLoop(timestamp) {
    if (!gameStarted) return;
    if (gameOver || victory) return;

    if (paused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        ctx.fillStyle = '#00ffff';
        ctx.font = '40px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('--- PAUSE ---', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
        requestAnimationFrame(gameLoop);
        return;
    }

    const solidPoops = poops.filter(p => timestamp - p.spawnTime > 200).map(p => ({ x: p.x, y: p.y, width: p.width, height: p.height }));
    const obstacles = [...gameMap.walls, ...gameMap.destructibles, ...solidPoops];

    player.update(keys, obstacles);
    hud.innerText = `VIDAS: ${player.lives}`;

    poops.forEach((p) => {
        if (!p.exploding && timestamp - p.spawnTime >= POOP_TIMER) {
            p.exploding = true;
            p.explosionStart = timestamp;
            audioPoop.play().catch(() => {});

            const expRect = {
                x: p.x - TILE_SIZE,
                y: p.y - TILE_SIZE,
                width: TILE_SIZE * 3,
                height: TILE_SIZE * 3
            };

            gameMap.removeBlocksInArea(expRect);

            enemies = enemies.filter(enemy => {
                const hit = enemy.x < expRect.x + expRect.width && enemy.x + enemy.width > expRect.x &&
                            enemy.y < expRect.y + expRect.height && enemy.y + enemy.height > expRect.y;
                return !hit;
            });

            const playerRect = player.getRect();
            if (playerRect.x < expRect.x + expRect.width && playerRect.x + playerRect.width > expRect.x &&
                playerRect.y < expRect.y + expRect.height && playerRect.y + playerRect.height > expRect.y) {
                if (player.die(timestamp)) {
                    audioDie.play().catch(() => {});
                    player.x = MAP_OFFSET_X + TILE_SIZE;
                    player.y = MAP_OFFSET_Y + TILE_SIZE;
                }
            }
        }
    });

    poops = poops.filter(p => !p.exploding || (timestamp - p.explosionStart < 500));

    const enemyObstacles = [...gameMap.walls, ...gameMap.destructibles, ...solidPoops];

    enemies.forEach(enemy => {
        const hbSize = 24;
        const hbOffset = (enemy.width - hbSize) / 2;

        enemy.x += enemy.dx;
        let enemyRectX = { x: enemy.x + hbOffset, y: enemy.y + hbOffset, width: hbSize, height: hbSize };
        let hitX = false;
        for (let obs of enemyObstacles) {
            if (enemyRectX.x < obs.x + obs.width && enemyRectX.x + enemyRectX.width > obs.x &&
                enemyRectX.y < obs.y + obs.height && enemyRectX.y + enemyRectX.height > obs.y) {
                hitX = true;
                break;
            }
        }

        if (hitX) {
            enemy.x -= enemy.dx;
            enemy.dx = 0;
        }

        enemy.y += enemy.dy;
        let enemyRectY = { x: enemy.x + hbOffset, y: enemy.y + hbOffset, width: hbSize, height: hbSize };
        let hitY = false;
        for (let obs of enemyObstacles) {
            if (enemyRectY.x < obs.x + obs.width && enemyRectY.x + enemyRectY.width > obs.x &&
                enemyRectY.y < obs.y + obs.height && enemyRectY.y + enemyRectY.height > obs.y) {
                hitY = true;
                break;
            }
        }

        if (hitY) {
            enemy.y -= enemy.dy;
            enemy.dy = 0;
        }

        if (enemy.dx === 0 && enemy.dy === 0) {
            const directions = [
                { dx: enemy.speed, dy: 0 },
                { dx: -enemy.speed, dy: 0 },
                { dx: 0, dy: enemy.speed },
                { dx: 0, dy: -enemy.speed }
            ];

            const validDirections = directions.filter(d => {
                const testX = enemy.x + d.dx;
                const testY = enemy.y + d.dy;
                const testRect = { x: testX + hbOffset, y: testY + hbOffset, width: hbSize, height: hbSize };
                
                for (let obs of enemyObstacles) {
                    if (testRect.x < obs.x + obs.width && testRect.x + testRect.width > obs.x &&
                        testRect.y < obs.y + obs.height && testRect.y + testRect.height > obs.y) {
                        return false;
                    }
                }
                return true;
            });

            if (validDirections.length > 0) {
                const chosen = validDirections[Math.floor(Math.random() * validDirections.length)];
                enemy.dx = chosen.dx;
                enemy.dy = chosen.dy;
            } else {
                enemy.dx = -enemy.speed;
            }
        }

        const playerRect = player.getRect();
        const enemyHitbox = { x: enemy.x + hbOffset, y: enemy.y + hbOffset, width: hbSize, height: hbSize };
        if (playerRect.x < enemyHitbox.x + enemyHitbox.width && playerRect.x + playerRect.width > enemyHitbox.x &&
            playerRect.y < enemyHitbox.y + enemyHitbox.height && playerRect.y + playerRect.height > enemyHitbox.y) {
            if (player.die(timestamp)) {
                audioDie.play().catch(() => {});
                player.x = MAP_OFFSET_X + TILE_SIZE;
                player.y = MAP_OFFSET_Y + TILE_SIZE;
            }
        }
    });

    if (enemies.length === 0) {
        victory = true;
        audioBgMusic.pause();
        audioVictory.play().catch(() => {});
    }
    if (!player.isAlive) {
        gameOver = true;
        audioBgMusic.pause();
        audioGameOver.play().catch(() => {});
    }

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    gameMap.draw(ctx);

    poops.forEach(p => {
        if (p.exploding) {
            const elapsed = timestamp - p.explosionStart;
            const frame = Math.min(Math.floor(elapsed / 100), 4);
            const img = explosionImages[frame];
            if (img) {
                ctx.drawImage(img, p.x - TILE_SIZE, p.y - TILE_SIZE, TILE_SIZE * 3, TILE_SIZE * 3);
            }
        } else {
            ctx.drawImage(imgCaca, p.x, p.y, p.width, p.height);
        }
    });

    enemies.forEach(e => {
        ctx.save();
        if (e.dx > 0) {
            ctx.scale(-1, 1);
            ctx.drawImage(imgEnemy, -e.x - e.width, e.y, e.width, e.height);
        } else {
            ctx.drawImage(imgEnemy, e.x, e.y, e.width, e.height);
        }
        ctx.restore();
    });

    player.draw(ctx, timestamp);

    if (victory || gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        ctx.fillStyle = '#ffff00';
        ctx.font = '45px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(victory ? '¡VICTORIA!' : '¡GAME OVER!', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 20);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Courier New';
        ctx.fillText('Presioná [ENTER] para jugar de nuevo', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 30);
        return;
    }

    requestAnimationFrame(gameLoop);
}

function drawStartScreen() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    ctx.fillStyle = '#ffff00';
    ctx.font = '35px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('GATITO ENOJADO', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Courier New';
    ctx.fillText('Presioná [ENTER] para comenzar', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 20);
}

window.onload = () => {
    drawStartScreen();
};
