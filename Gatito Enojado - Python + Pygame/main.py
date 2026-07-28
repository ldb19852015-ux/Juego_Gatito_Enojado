"""
Módulo Principal - Gatito Enojado
Gestiona el bucle principal del juego, la inicialización de Pygame, recursos de audio,
la lógica de pantallas (juego, pausa, victoria, game over) y la actualización de entidades.
"""

import os
import sys

import pygame

from src.constants import (
    BLACK,
    FPS,
    MAP_OFFSET_X,
    MAP_OFFSET_Y,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    TILE_SIZE,
)
from src.enemy import Enemy
from src.map import Map
from src.player import Player
from src.poop import Poop


def resource_path(relative_path):
    """Obtiene la ruta absoluta segura para los recursos, compatible con ejecutables (PyInstaller)."""
    try:
        base_path = sys._MEIPASS
    except Exception:  # noqa: BLE001
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

def draw_hud(screen, lives):
    """Dibuja la interfaz de usuario en pantalla (HUD), como las vidas restantes del jugador."""
    font = pygame.font.Font(None, 36)
    text = font.render(f"VIDAS: {lives}", True, (255, 255, 255))
    screen.blit(text, (10, 10))

def main():
    # Inicialización de motores de Pygame (gráficos y audio)
    pygame.init()
    pygame.mixer.init()
    
    # Carga de efectos de sonido y música de fondo
    sonidos = {
        "pedo": pygame.mixer.Sound(resource_path("assets/poopexplota.ogg")),
        "perder_vida": pygame.mixer.Sound(resource_path("assets/diecat.ogg")),
        "enemigo_muere": pygame.mixer.Sound(resource_path("assets/diemouse.ogg")),
        "victoria": pygame.mixer.Sound(resource_path("assets/victory.ogg")),
        "game_over": pygame.mixer.Sound(resource_path("assets/gameover.ogg"))
    }
    
    pygame.mixer.music.load(resource_path("assets/backgrond.ogg"))
    pygame.mixer.music.set_volume(0.5)
    pygame.mixer.music.play(-1)  # Reproducción en bucle infinito
    
    # Configuración de la ventana principal y el reloj del juego
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption("GATITO ENOJADO")
    clock = pygame.time.Clock()
    
    # Diseño del mapa nivel 1 ('W' = Muro indestructible, 'D' = Muro destructible, '.' = Camino libre)
    LEVEL_LAYOUT = [
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
    ]

    # Instanciación del mapa, jugador y lista de enemigos
    game_map = Map(LEVEL_LAYOUT)
    spawn_x, spawn_y = MAP_OFFSET_X + TILE_SIZE, MAP_OFFSET_Y + TILE_SIZE
    player = Player(spawn_x, spawn_y)
    enemies = [
        Enemy(MAP_OFFSET_X + 18 * TILE_SIZE, MAP_OFFSET_Y + 14 * TILE_SIZE),
        Enemy(MAP_OFFSET_X + 15 * TILE_SIZE, MAP_OFFSET_Y + 5 * TILE_SIZE)
    ]

    running, paused, end_message = True, False, None
    
    # Bucle principal del juego
    while running:
        # 1. Gestión de eventos de entrada (teclado y cierre de ventana)
        for event in pygame.event.get():
            if event.type == pygame.QUIT: 
                running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE: 
                    paused = not paused
                # Colocación de trampa de caca con la tecla NumPad 0
                if event.key == pygame.K_KP0 and player.is_alive and not paused and len(player.poops) < 5: 
                    player.poops.append(Poop(player.rect.x, player.rect.y))
        
        # 2. Actualización de la lógica si el juego no está pausado ni finalizado
        if not paused and not end_message:
            # Actualizar posición y estado del jugador
            player.update(pygame.key.get_pressed(), game_map.walls, game_map.destructibles, player.poops)
            
            # Actualizar enemigos y comprobar colisiones con el jugador
            for enemy in enemies[:]:
                enemy.update(game_map.walls, game_map.destructibles, player.poops)
                if enemy.rect.colliderect(player.rect) and player.die(): 
                    sonidos["perder_vida"].play()
                    player.rect.x, player.rect.y = spawn_x, spawn_y
            
            # Actualizar trampas (poops) y sus efectos de explosión
            for poop in player.poops[:]:
                still_active = poop.update(game_map, player, sonidos)
                
                # Aplicar daño de explosión una sola vez por bomba
                if poop.exploding and not hasattr(poop, '_exploded_action_done'):
                    poop._exploded_action_done = True
                    exp_rect = poop.rect.inflate(TILE_SIZE * 3, TILE_SIZE * 3)
                    for enemy in enemies[:]:
                        if exp_rect.colliderect(enemy.rect): 
                            enemies.remove(enemy)
                            sonidos["enemigo_muere"].play()
                    if exp_rect.colliderect(player.rect) and player.die():
                        sonidos["perder_vida"].play()
                        player.rect.x, player.rect.y = spawn_x, spawn_y
                
                # Remover trampa de la lista cuando termina su animación
                if not still_active:
                    player.poops.remove(poop)
            
            # Comprobación de condiciones de victoria o derrota
            if not enemies: 
                end_message = "¡VICTORIA!"
                sonidos["victoria"].play()
            if player.lives <= 0: 
                end_message = "¡GAME OVER!"
                sonidos["game_over"].play()
            
            if end_message: 
                running = False
        
        # 3. Renderizado de gráficos en pantalla
        screen.fill(BLACK)
        game_map.draw(screen)
        for p in player.poops: 
            p.draw(screen)
        for e in enemies: 
            e.draw(screen)
        player.draw(screen)
        draw_hud(screen, player.lives)
        
        # Mostrar menú de pausa si está activado
        if paused:
            text = pygame.font.Font(None, 74).render("PAUSA", True, (255, 255, 255))
            screen.blit(text, text.get_rect(center=(SCREEN_WIDTH//2, SCREEN_HEIGHT//2)))
            
        pygame.display.flip()
        clock.tick(FPS)

    # 4. Pantalla de cierre al ganar o perder
    if end_message:
        screen.fill(BLACK)
        text = pygame.font.Font(None, 100).render(end_message, True, (255, 255, 0))
        screen.blit(text, text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2)))
        pygame.display.flip()
        
        pygame.time.delay(2000) # Espera 2 segundos antes de cerrar

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()