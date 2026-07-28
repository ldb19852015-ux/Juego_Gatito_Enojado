"""
Módulo del Jugador
Gestiona el movimiento del personaje, animaciones por fotogramas, colisiones y estado de vida/invulnerabilidad.
"""

import os
import sys

import pygame

from src.constants import (
    MAP_OFFSET_X,
    MAP_OFFSET_Y,
    PLAYER_LIVES,
    PLAYER_SPEED,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
)


def resource_path(relative_path):
    """Obtiene la ruta absoluta segura para las animaciones del jugador."""
    try:
        base_path = sys._MEIPASS
    except Exception:  # noqa: BLE001
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

class Player(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.rect = pygame.Rect(x, y, 28, 28)
        # Carga de frames para la animación de caminata
        self.base_images = [
            pygame.image.load(resource_path("assets/player_0.png")).convert_alpha(),
            pygame.image.load(resource_path("assets/player_1.png")).convert_alpha(),
            pygame.image.load(resource_path("assets/player_2.png")).convert_alpha()
        ]
        self.image_index = 0
        self.animation_timer = 0
        self.facing_left = False
        self.poops = []
        self.is_alive = True
        self.speed = PLAYER_SPEED
        self.lives = PLAYER_LIVES
        self.invulnerable_until = 0

    def update(self, keys, walls, destructibles, poops):
        """Actualiza la posición del jugador en base a las teclas presionadas y maneja colisiones eje por eje."""
        if not self.is_alive: 
            return
            
        dx, dy = 0, 0
        moving = False
        
        # Lectura de controles direccionales
        if keys[pygame.K_LEFT]:
            dx = -self.speed 
            moving = True 
            self.facing_left = True
        elif keys[pygame.K_RIGHT]:
            dx = self.speed
            moving = True 
            self.facing_left = False
            
        if keys[pygame.K_UP]:
            dy = -self.speed 
            moving = True
        elif keys[pygame.K_DOWN]:
            dy = self.speed 
            moving = True
            
        # Control de ciclo de animación al caminar
        if moving:
            self.animation_timer += 1
            if self.animation_timer >= 10:
                self.animation_timer = 0 
                self.image_index = (self.image_index + 1) % 3
        else:
            self.image_index = 0 
            self.animation_timer = 0

        # Filtro de obstáculos sólidos (las trampas recién colocadas son traspasables brevemente)
        current_time = pygame.time.get_ticks()
        solid_poops = [p.rect for p in poops if (current_time - p.spawn_time) > 200]
        obstacles = walls + destructibles + solid_poops
        
        # Movimiento horizontal y resolución de colisiones en eje X
        self.rect.x += dx
        for obs in obstacles:
            if self.rect.colliderect(obs):
                if dx > 0: 
                    self.rect.right = obs.left
                if dx < 0: 
                    self.rect.left = obs.right
                    
        # Movimiento vertical y resolución de colisiones en eje Y
        self.rect.y += dy
        for obs in obstacles:
            if self.rect.colliderect(obs):
                if dy > 0: 
                    self.rect.bottom = obs.top
                if dy < 0: 
                    self.rect.top = obs.bottom
        
        # Restricción de movimiento dentro de los límites del mapa
        area = pygame.Rect(MAP_OFFSET_X, MAP_OFFSET_Y, SCREEN_WIDTH - 2 * MAP_OFFSET_X, SCREEN_HEIGHT - 2 * MAP_OFFSET_Y)
        self.rect.clamp_ip(area)

    def die(self):
        """Resta una vida al jugador aplicando un periodo de invulnerabilidad temporal."""
        current_time = pygame.time.get_ticks()
        if current_time > self.invulnerable_until:
            self.lives -= 1 
            self.invulnerable_until = current_time + 1000
            if self.lives <= 0: 
                self.is_alive = False
            return True
        return False

    def draw(self, screen):
        """Dibuja al jugador aplicando efecto de parpadeo si se encuentra en estado de invulnerabilidad."""
        if self.is_alive:
            if pygame.time.get_ticks() % 200 < 100 and pygame.time.get_ticks() < self.invulnerable_until: 
                return
            img = self.base_images[self.image_index]
            display_image = pygame.transform.flip(img, self.facing_left, False)
            screen.blit(display_image, self.rect)