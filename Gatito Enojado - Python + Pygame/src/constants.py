"""
Archivo de Constantes Globales
Define configuraciones de pantalla, velocidad, dimensiones de los tiles y temporizadores del juego.
"""

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
TILE_SIZE = 32 
FPS = 60
BLACK = (0, 0, 0)
PLAYER_LIVES = 3
PLAYER_SPEED = 4
POOP_TIMER = 1000  # Tiempo en milisegundos antes de que explote la trampa

MAP_WIDTH_TILES = 25
MAP_HEIGHT_TILES = 18

# Centrado automático del mapa en la pantalla
MAP_OFFSET_X = (SCREEN_WIDTH - (MAP_WIDTH_TILES * TILE_SIZE)) // 2
MAP_OFFSET_Y = (SCREEN_HEIGHT - (MAP_HEIGHT_TILES * TILE_SIZE)) // 2