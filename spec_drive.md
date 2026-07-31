# spec_drive.md

## Nombre del juego
Gatito Enojado

## Género
Juego arcade de acción estilo Bomberman para navegador web.

## Descripción General
El jugador controla un gato que debe eliminar enemigos colocando trampas explosivas dentro de un laberinto. Las explosiones destruyen bloques rompibles y eliminan enemigos dentro de su área de impacto. El objetivo es acabar con todos los enemigos sin perder las tres vidas disponibles.

---

# Plataforma

- Navegador web moderno.
- Compatible con escritorio y dispositivos móviles.
- Implementado con HTML5 Canvas y JavaScript ES Modules.
- Sin dependencias externas.

---

# Resolución y Escala

Resolución lógica interna:

- Ancho: 800 px
- Alto: 600 px

Mapa:

- 25 columnas
- 18 filas
- Tamaño de bloque: 32 px

El mapa se centra automáticamente dentro del canvas mediante offsets calculados.

---

# Objetivo del Jugador

Eliminar todos los enemigos del nivel utilizando trampas explosivas antes de perder todas las vidas.

Condiciones de victoria:

- Todos los enemigos eliminados.

Condiciones de derrota:

- Vidas igual a cero.

---

# Jugador

## Estadísticas

- Tamaño: 28x28 px
- Velocidad: 4 px por frame
- Vidas iniciales: 3
- Inmunidad temporal tras recibir daño: 1000 ms

## Movimiento

Teclado:

- Flecha Arriba
- Flecha Abajo
- Flecha Izquierda
- Flecha Derecha

Móvil:

- D-Pad táctil

## Animación

- 3 sprites de movimiento.
- Cambio de frame cada 10 ciclos mientras se desplaza.
- Sprite base al permanecer quieto.

## Orientación

- El sprite se invierte horizontalmente al moverse hacia la izquierda.

## Daño

El jugador recibe daño cuando:

- Toca un enemigo.
- Queda dentro del área de una explosión.

Al recibir daño:

- Pierde una vida.
- Gana invulnerabilidad temporal durante 1 segundo.
- Es reposicionado en la zona inicial.

Durante la invulnerabilidad:

- El personaje parpadea visualmente.

---

# Sistema de Trampas

## Colocación

Controles:

- Barra espaciadora
- Numpad 0
- Botón táctil "TRAMPA"

Restricciones:

- Máximo 5 trampas simultáneas.

## Temporizador

Tiempo de detonación:

- 1000 ms

## Área de Explosión

Dimensiones:

- 3 bloques × 3 bloques

Centro:

- Posición de la trampa.

## Efectos

La explosión:

- Destruye bloques destructibles.
- Elimina enemigos.
- Puede dañar al jugador.
- Reproduce sonido de explosión.

## Duración Visual

- 500 ms

## Animación

- 5 frames de explosión.
- Cambio aproximado cada 100 ms.

---

# Enemigos

## Cantidad Inicial

2 enemigos.

## Estadísticas

- Tamaño visual: 28x28 px
- Hitbox: 24x24 px
- Velocidad: 2 px por frame

## IA de Movimiento

Los enemigos:

- Se desplazan en línea recta.
- Detectan colisiones con obstáculos.
- Al bloquearse seleccionan una nueva dirección aleatoria válida.

Direcciones posibles:

- Arriba
- Abajo
- Izquierda
- Derecha

## Eliminación

Son destruidos instantáneamente al entrar dentro del área de una explosión.

---

# Sistema de Colisiones

Se utiliza detección AABB (Axis-Aligned Bounding Box).

Aplicada a:

- Jugador vs muros.
- Jugador vs bloques destructibles.
- Jugador vs trampas activadas.
- Jugador vs enemigos.
- Enemigos vs escenario.
- Enemigos vs trampas.
- Explosiones vs enemigos.
- Explosiones vs jugador.
- Explosiones vs bloques destructibles.

---

# Escenario

## Tipos de Bloques

### Muros (W)

Características:

- Indestructibles.
- Bloquean movimiento.

### Bloques Destructibles (D)

Características:

- Bloquean movimiento.
- Pueden ser destruidos por explosiones.

### Pasillos (. )

Características:

- Espacios transitables.

---

# Diseño de Nivel

Mapa fijo definido mediante matriz de caracteres.

Símbolos:

- W = muro permanente.
- D = bloque destructible.
- . = espacio libre.

---

# Interfaz

## HUD

Muestra:

- VIDAS: cantidad restante de vidas.

## Pantalla Inicial

Texto:

- GATITO ENOJADO
- Presioná [ENTER] para comenzar

## Pantalla de Pausa

Texto:

- --- PAUSE ---

Fondo oscurecido.

## Pantalla de Victoria

Texto:

- ¡VICTORIA!
- Presioná [ENTER] para jugar de nuevo

## Pantalla de Derrota

Texto:

- ¡GAME OVER!
- Presioná [ENTER] para jugar de nuevo

---

# Estados del Juego

## Esperando Inicio

Acciones permitidas:

- Comenzar partida.

## Jugando

Acciones permitidas:

- Mover jugador.
- Colocar trampas.

## Pausado

Acciones permitidas:

- Reanudar partida.

## Victoria

Acciones permitidas:

- Reiniciar.

## Game Over

Acciones permitidas:

- Reiniciar.

---

# Controles

## Escritorio

Movimiento:

- ArrowUp
- ArrowDown
- ArrowLeft
- ArrowRight

Trampa:

- Space
- Numpad0

Pausa:

- Escape

Inicio/Reinicio:

- Enter

## Móvil

Movimiento:

- Botones direccionales táctiles.

Acción:

- Botón táctil TRAMPA.

Inicio:

- Primer toque sobre controles o canvas.

---

# Audio

## Música

background.ogg

Características:

- Loop infinito.
- Volumen 50%.

## Efectos

poopexplota.ogg

- Explosión de trampa.

diecat.ogg

- Daño del jugador.

victory.ogg

- Victoria.

gameover.ogg

- Derrota.

---

# Recursos Gráficos

## Jugador

- player_0.png
- player_1.png
- player_2.png

## Enemigo

- enemy.png

## Explosiones

- explosion_1.png
- explosion_2.png
- explosion_3.png
- explosion_4.png
- explosion_5.png

## Escenario

- wall.png
- destructible.png

## Trampa

- caca.png

---

# Flujo Principal

1. Se muestra pantalla inicial.
2. El jugador inicia la partida.
3. Puede desplazarse por el mapa.
4. Coloca trampas estratégicamente.
5. Las trampas explotan tras 1 segundo.
6. Las explosiones destruyen bloques y enemigos.
7. El jugador evita enemigos y explosiones.
8. Si elimina todos los enemigos obtiene victoria.
9. Si pierde las tres vidas ocurre Game Over.
10. Enter reinicia una nueva partida.