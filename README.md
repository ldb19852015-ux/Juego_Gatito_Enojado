# 🐱 Gatito Enojado (Angry Cat)

> *"Siembra cacas. Cosecha destrucción."*

🎮 **[¡JUGÁ ONLINE HACIENDO CLIC ACÁ!](https://ldb19852015-ux.github.io/Juego_Gatito_Enojado/)** 🚀

---

## 📋 Descripción del Proyecto

**Gatito Enojado** es un videojuego arcade al estilo clásico de *Bomberman*, desarrollado íntegramente en JavaScript Vanilla (ES6 Modules) y HTML5 Canvas. En este juego controlas a un simpático minino atrapado en un laberinto estratégico. Para sobrevivir y avanzar, deberás colocar trampas explosivas («cacas explosivas») para destruir obstáculos, despejar pasillos y eliminar a todos los enemigos que merodean el mapa antes de perder todas tus vidas.

---

## 🗂️ Estructura del Código Fuente

El proyecto utiliza una arquitectura modular limpia basada en ES6:

*   `index.html`: Punto de entrada principal que contiene el marcado estructural, el HUD de vidas y el lienzo (`canvas`) de resolución fija (800x600 px).
*   `js/constants.js`: Archivo de configuración global que define las dimensiones de la pantalla, el tamaño de los tiles (32x32), la velocidad del jugador, el temporizador de las trampas y la matriz del mapa (`LEVEL_LAYOUT`).
*   `js/main.js`: El núcleo del juego (*Game Loop*). Gestiona el bucle principal de renderizado, la carga de recursos de audio y texturas, la lectura de eventos de teclado, las colisiones y las pantallas de presentación, pausa, victoria y *Game Over*.
*   `js/map.js`: Clase encargada de interpretar la matriz del nivel, renderizar muros fijos y bloques destructibles, y gestionar la destrucción de elementos en el área de impacto.
*   `js/player.js`: Clase que maneja el estado del jugador (movimiento en cuatro direcciones, animaciones de caminata de 3 cuadros, control de vidas, colisiones AABB y sistema de invulnerabilidad temporal con parpadeo).

---

## 🕹️ Controles del Juego

| Tecla | Acción |
| :--- | :--- |
| **`Enter`** | Comenzar / Reiniciar partida |
| **`Escape`** | Pausar / Reanudar juego |
| **`Flecha Arriba`** | Mover hacia arriba |
| **`Flecha Abajo`** | Mover hacia abajo |
| **`Flecha Izquierda`** | Mover hacia la izquierda |
| **`Flecha Derecha`** | Mover hacia la derecha |
| **`Numpad 0` / `Espacio`** | Colocar trampa / Caca explosiva |

---

## ⚙️ Características Técnicas

*   **Motor Gráfico:** HTML5 Canvas con renderizado 2D optimizado a 60 FPS.
*   **Modularidad:** Código estructurado en Módulos ES6 nativos sin dependencias externas ni librerías de terceros.
*   **Colisiones AABB:** Sistema de detección de cajas delimitadoras alineadas a los ejes para un movimiento preciso sobre la grilla.
*   **Audio Integrado:** Gestión dinámica de efectos de sonido (explosiones, daño, victoria, derrota) y música de fondo en bucle mediante la API nativa de JavaScript `HTMLAudioElement`.

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

Al tratarse de una aplicación web construida con módulos de JavaScript ES6, los navegadores modernos bloquean la carga de módulos locales por cuestiones de seguridad (`CORS policy`). Para ejecutarlo de manera local, seguí estos pasos:

1. Cloná o descargá este repositorio en tu máquina:
   ```bash
   git clone [https://github.com/ldb19852015-ux/Juego_Gatito_Enojado.git](https://github.com/ldb19852015-ux/Juego_Gatito_Enojado.git)
