"""
Módulo de Mapa
Construye y renderiza el escenario del juego a partir de una matriz de texto (layout).
"""

import os
import sys

import pygame

from src.constants import MAP_OFFSET_X, MAP_OFFSET_Y, TILE_SIZE


def resource_path(relative_path):
    """Obtiene la ruta absoluta segura para los archivos de texturas."""
    try:
        base_path = sys._MEIPASS
    except Exception:  # noqa: BLE001
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

class Map:
    def __init__(self, layout):
        # Carga de texturas para muros fijos y bloques destruibles
        self.wall_img = pygame.image.load(resource_path('assets/wall.png')).convert_alpha()
        self.wall_img = pygame.transform.scale(self.wall_img, (TILE_SIZE, TILE_SIZE))
        
        self.dest_img = pygame.image.load(resource_path('assets/destructible.png')).convert_alpha()
        self.dest_img = pygame.transform.scale(self.dest_img, (TILE_SIZE, TILE_SIZE))
        
        self.walls = []
        self.destructibles = []
        
        # Procesamiento del diseño del mapa basado en caracteres
        for r, row in enumerate(layout):
            for c, char in enumerate(row):
                x = c * TILE_SIZE + MAP_OFFSET_X
                y = r * TILE_SIZE + MAP_OFFSET_Y
                if char == 'W': 
                    self.walls.append(pygame.Rect(x, y, TILE_SIZE, TILE_SIZE))
                if char == 'D': 
                    self.destructibles.append(pygame.Rect(x, y, TILE_SIZE, TILE_SIZE))

    def remove_blocks_in_area(self, rect):
        """Elimina los bloques destructibles que entren en contacto con un área específica (explosiones)."""
        self.destructibles = [d for d in self.destructibles if not d.colliderect(rect)]

    def draw(self, screen):
        """Renderiza todos los elementos estáticos del mapa en la pantalla."""
        for w in self.walls: 
            screen.blit(self.wall_img, (w.x, w.y))
        for d in self.destructibles: 
            screen.blit(self.dest_img, (d.x, d.y))