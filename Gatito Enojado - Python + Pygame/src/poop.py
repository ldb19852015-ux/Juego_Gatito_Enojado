"""
Módulo de Trampas (Poop)
Controla el temporizador de activación, la lógica de explosión destructiva y la renderizado de fotogramas de efecto visual.
"""

import os
import sys

import pygame

from src.constants import POOP_TIMER, TILE_SIZE


def resource_path(relative_path):
    """Obtiene la ruta absoluta segura para los recursos de la trampa y su explosión."""
    try:
        base_path = sys._MEIPASS
    except Exception:  # noqa: BLE001
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

class Poop(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.rect = pygame.Rect(x, y, TILE_SIZE, TILE_SIZE)
        self.spawn_time = pygame.time.get_ticks()
        self.exploding = False
        self.explosion_start = 0
        
        # Textura estática de la trampa
        self.image = pygame.image.load(resource_path('assets/caca.png')).convert_alpha()
        self.image = pygame.transform.scale(self.image, (TILE_SIZE, TILE_SIZE))
        
        # Secuencia de imágenes para la animación de explosión
        self.explosion_images = [
            pygame.transform.scale(
                pygame.image.load(resource_path(f'assets/explosion_{i}.png')).convert_alpha(), 
                (TILE_SIZE * 2, TILE_SIZE * 2) 
            )
            for i in range(1, 6)
        ]

    def update(self, game_map, player, sonidos):
        """Controla el tiempo de espera, activa la explosión y destruye el entorno circundante."""
        current_time = pygame.time.get_ticks()
        
        # Si ya está explotando, verifica si debe finalizar la animación (duración de 500ms)
        if self.exploding: 
            return current_time - self.explosion_start < 500
        
        # Al cumplirse el tiempo de armado, se desencadena la explosión
        if current_time - self.spawn_time >= POOP_TIMER:
            self.exploding = True
            self.explosion_start = current_time
            sonidos["pedo"].play()
            
            # Definición del área de impacto de la explosión
            explosion_radius = TILE_SIZE * 2
            explosion_rect = self.rect.inflate(explosion_radius, explosion_radius)
            
            # Destruir bloques del mapa dentro del radio
            game_map.remove_blocks_in_area(explosion_rect)
            
            # Dañar al jugador si se encuentra en el área afectada
            if explosion_rect.colliderect(player.rect): 
                player.die()
        return True

    def draw(self, screen):
        """Renderiza la trampa estática o la animación secuencial de explosión según su estado."""
        if self.exploding: 
            elapsed = pygame.time.get_ticks() - self.explosion_start
            frame = min(elapsed // 100, 4)
            img = self.explosion_images[frame]
            screen.blit(img, (self.rect.centerx - img.get_width()//2, 
                              self.rect.centery - img.get_height()//2))
        else: 
            screen.blit(self.image, self.rect)