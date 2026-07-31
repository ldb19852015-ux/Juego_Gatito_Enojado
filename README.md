# 🐱 Gatito Enojado (Angry Cat)

> *"Siembra cacas. Cosecha destrucción."*

🎮 **[¡JUGÁ ONLINE HACIENDO CLIC ACÁ!](https://ldb19852015-ux.github.io/Juego_Gatito_Enojado/)** 🚀

---

## 📋 Descripción del Proyecto

**Gatito Enojado** es un videojuego arcade al estilo clásico de *Bomberman*, desarrollado íntegramente en JavaScript Vanilla (ES6 Modules) y HTML5 Canvas[cite: 6]. Cuenta con diseño responsivo y controles adaptados tanto para PC como para dispositivos móviles[cite: 1]. En este juego controlas a un simpático minino atrapado en un laberinto estratégico[cite: 6]. Para sobrevivir y avanzar, deberás colocar trampas explosivas («cacas explosivas») para destruir obstáculos, despejar pasillos y eliminar a todos los enemigos que merodean el mapa antes de perder todas tus vidas[cite: 6].

---

## 🗂️ Estructura del Código Fuente

El proyecto utiliza una arquitectura modular limpia basada en ES6[cite: 6]:

*   `index.html`: Punto de entrada principal que contiene el marcado estructural, el HUD de vidas, el lienzo (`canvas`) optimizado para distintas pantallas y el panel de controles táctiles para celulares/tablets[cite: 1].
*   `js/constants.js`: Archivo de configuración global que define las dimensiones de la pantalla (800x600), el tamaño de los tiles (32x32), la velocidad del jugador, el temporizador de las trampas (1 segundo) y la matriz del mapa (`LEVEL_LAYOUT`)[cite: 2].
*   `js/main.js`: El núcleo del juego (*Game Loop*). Gestiona el bucle principal de renderizado, la carga de recursos de audio y texturas, la lectura de eventos de teclado y puntero/tacto, las colisiones y las pantallas de presentación, pausa, victoria y *Game Over*[cite: 3].
*   `js/map.js`: Clase encargada de interpretar la matriz del nivel, renderizar muros fijos y bloques destructibles, y gestionar la destrucción de elementos en el área de impacto mediante explosiones[cite: 4].
*   `js/player.js`: Clase que maneja el estado del jugador (movimiento en cuatro direcciones, animaciones de caminata de 3 cuadros, control de 3 vidas, colisiones AABB y sistema de invulnerabilidad temporal con parpadeo)[cite: 5].

---

## 🕹️ Controles del Juego

### 🖥️ Teclado (PC)
| Tecla | Acción |
| :--- | :--- |
| **`Enter`** | Comenzar / Reiniciar partida[cite: 3] |
| **`Escape`** | Pausar / Reanudar juego[cite: 3] |
| **`Flechas de Dirección`** | Mover al personaje (Arriba, Abajo, Izquierda, Derecha)[cite: 3, 5] |
| **`Space` o `Numpad 0`** | Colocar trampa / Caca explosiva[cite: 3] |

### 📱 Dispositivos Móviles (Táctil)
*   **D-Pad virtual:** Botones en pantalla para direccionar al gatito.
*   **Botón rojo (TRAMPA):** Permite sembrar la trampa explosiva de manera táctil[cite: 1].
*   **Toque en pantalla:** Inicia el juego o permite reiniciar tras una victoria o *Game Over*[cite: 3].

---

## ⚙️ Características Técnicas

*   **Motor Gráfico:** HTML5 Canvas con renderizado 2D optimizado a 60 FPS y escalado flexible según el tamaño de la pantalla[cite: 1, 6].
*   **Modularidad:** Código estructurado en Módulos ES6 nativos sin dependencias externas ni librerías de terceros[cite: 6].
*   **Colisiones AABB:** Sistema de detección de cajas delimitadoras alineadas a los ejes para un movimiento preciso sobre la grilla[cite: 6].
*   **Audio Integrado:** Gestión dinámica de efectos de sonido (explosiones, daño, victoria, derrota) y música de fondo en bucle mediante la API nativa de JavaScript `HTMLAudioElement`[cite: 3].

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

Al tratarse de una aplicación web construida con módulos de JavaScript ES6, los navegadores modernos bloquean la carga de módulos locales por cuestiones de seguridad (`CORS policy`). Para ejecutarlo de manera local, seguí estos pasos:

1. Cloná o descargá este repositorio en tu máquina:
   ```bash
   git clone [https://github.com/ldb19852015-ux/Juego_Gatito_Enojado.git](https://github.com/ldb19852015-ux/Juego_Gatito_Enojado.git)
