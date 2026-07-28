"""
Módulo de Enemigos
Gestiona el comportamiento autónomo de los enemigos, IA de movimiento aleatorio y detección de colisiones.
"""

import os
import random
import sys

import pygame


def resource_path(relative_path):
    """Obtiene la ruta absoluta segura para los recursos gráficos."""
    try:
        base_path = sys._MEIPASS
    except Exception:  # noqa: BLE001
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.rect = pygame.Rect(x, y, 28, 28)
        self.speed = 2
        self.directions = [[0, self.speed], [0, -self.speed], [self.speed, 0], [-self.speed, 0]]
        self.dir = random.choice(self.directions)
        self.facing_left = False 
        
        # Carga y reescalado de la imagen del enemigo
        self.image = pygame.image.load(resource_path('assets/enemy.png'))
        self.image = pygame.transform.scale(self.image, (28, 28))

    def update(self, walls, destructibles, poops):
        """Actualiza la posición del enemigo y resuelve colisiones cambiando de dirección aleatoriamente."""
        obstacles = walls + destructibles + [p.rect for p in poops]
        
        # Resolución de colisiones estáticas actuales
        for obs in obstacles:
            if self.rect.colliderect(obs):
                if self.dir[0] > 0: 
                    self.rect.right = obs.left
                elif self.dir[0] < 0: 
                    self.rect.left = obs.right
                if self.dir[1] > 0: 
                    self.rect.bottom = obs.top
                elif self.dir[1] < 0: 
                    self.rect.top = obs.bottom
        
        # Predicción de movimiento y redirección si encuentra un obstáculo
        future_rect = self.rect.move(self.dir[0], self.dir[1])
        if future_rect.collidelist(obstacles) != -1:
            random.shuffle(self.directions)
            for d in self.directions:
                if self.rect.move(d[0], d[1]).collidelist(obstacles) == -1:
                    self.dir = d
                    if d[0] > 0: 
                        self.facing_left = True
                    elif d[0] < 0: 
                        self.facing_left = False
                    break
        else:
            self.rect.move_ip(self.dir[0], self.dir[1])

    def draw(self, screen):
        """Dibuja al enemigo en pantalla aplicando volteo horizontal según su dirección."""
        display_image = pygame.transform.flip(self.image, self.facing_left, False)
        screen.blit(display_image, self.rect)