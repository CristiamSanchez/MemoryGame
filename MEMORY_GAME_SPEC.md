# Desarrollo de videojuego retro "Memory Game"

Actúa como un **desarrollador senior de videojuegos 2D y QA Automation Engineer**, especializado en **Python, Pygame y pytest**.

Quiero que desarrolles desde cero un videojuego clásico de memoria llamado **"Memory Game"**.

El objetivo es crear un juego sencillo pero correctamente estructurado que permita practicar:

* Manejo de estados visuales.
* Variables de estado.
* Eventos del teclado y mouse.
* Comparación de valores.
* Temporizadores.
* Control del estado de múltiples objetos.
* Detección de condiciones de victoria.
* Programación orientada a objetos.
* Diseño modular.
* Pruebas unitarias automatizadas.
* Pruebas de lógica de negocio.

La mecánica principal es:

> **Voltear dos cartas → comparar sus valores → si coinciden permanecen descubiertas → si no coinciden vuelven a ocultarse después de un breve tiempo.**

---

# 1. Tecnología

Utiliza:

* Python 3
* Pygame
* pytest
* Programación orientada a objetos cuando aporte valor.

No utilizar frameworks adicionales innecesarios.

El juego debe poder ejecutarse mediante:

```bash
python main.py
```

Las pruebas deben ejecutarse mediante:

```bash
pytest
```

Crear:

```text
requirements.txt
README.md
```

Las dependencias mínimas serán:

```text
pygame
pytest
```

---

# 2. Concepto del juego

Crear un tablero con cartas colocadas boca abajo.

Utilizar inicialmente un tablero:

```text
4 x 4
```

Es decir:

```text
16 cartas
8 pares
```

Cada valor debe aparecer exactamente dos veces.

Ejemplo:

```text
A A
B B
C C
D D
E E
F F
G G
H H
```

Las cartas deben mezclarse aleatoriamente al comenzar cada partida.

---

# 3. Estados de una carta

Cada carta debe tener claramente definido su estado:

```text
HIDDEN
REVEALED
MATCHED
```

### HIDDEN

La carta está boca abajo y solamente muestra su reverso.

### REVEALED

La carta está descubierta temporalmente y muestra su valor.

### MATCHED

La carta encontró correctamente su pareja y permanece descubierta.

---

# 4. Clase Card

Crear una clase:

```python
class Card:
```

Debe almacenar como mínimo:

```text
id
value
rect
state
```

Debe proporcionar métodos apropiados para:

* revelar;
* ocultar;
* marcar como encontrada;
* comprobar si está disponible;
* comprobar si contiene un punto/clic.

Evita que la lógica de una carta esté dispersa por todo el programa.

---

# 5. Clase Board

Crear una clase responsable del tablero.

Debe encargarse de:

* Crear las cartas.
* Generar las parejas.
* Mezclar las cartas.
* Administrar las cartas.
* Obtener cartas mediante posición.
* Detectar parejas.
* Contabilizar parejas encontradas.
* Determinar si el juego está completo.

La generación de parejas debe garantizar:

```text
16 cartas
8 valores diferentes
cada valor aparece exactamente 2 veces
```

---

# 6. Interacción con el mouse

El jugador debe poder hacer clic sobre las cartas.

Si la carta está:

```text
HIDDEN
```

debe cambiar a:

```text
REVEALED
```

Si está:

```text
REVEALED
```

no debe hacer nada.

Si está:

```text
MATCHED
```

no debe hacer nada.

Cuando ya existan dos cartas seleccionadas, no permitir seleccionar una tercera mientras el par esté siendo procesado.

---

# 7. Comparación de cartas

Cuando existan exactamente dos cartas descubiertas:

```python
card1.value == card2.value
```

### Si coinciden

Cambiar ambas a:

```text
MATCHED
```

Incrementar:

```text
pairs_found
```

### Si no coinciden

Mantenerlas visibles durante aproximadamente:

```text
1000 ms
```

Después volverlas a:

```text
HIDDEN
```

---

# 8. Temporizador

IMPORTANTE:

**No utilizar `time.sleep()` dentro del game loop.**

Utilizar:

```python
pygame.time.get_ticks()
```

o un mecanismo equivalente basado en el tiempo transcurrido.

Durante el período de espera:

* El juego debe seguir procesando eventos.
* La ventana no debe congelarse.
* No se deben aceptar nuevos clics sobre el tablero.
* Las dos cartas deben permanecer visibles.
* Una vez transcurrido el tiempo, las cartas incorrectas deben ocultarse.

Utilizar una constante:

```python
CARD_FLIP_DELAY = 1000
```

---

# 9. Estados generales del juego

Implementar:

```text
MENU
PLAYING
PAUSED
GAME_WON
```

Utilizar una máquina de estados sencilla o una estructura equivalente.

---

# 10. Menú principal

Crear:

```text
==============================

        MEMORY GAME

       [ JUGAR ]

    [ INSTRUCCIONES ]

       [ SALIR ]

==============================
```

---

# 11. Pantalla de instrucciones

Mostrar las reglas:

```text
MEMORY GAME

Encuentra todas las parejas.

1. Haz clic sobre una carta.
2. Haz clic sobre otra carta.
3. Si coinciden, permanecerán descubiertas.
4. Si son diferentes, volverán a ocultarse.

Encuentra todas las parejas para ganar.

[ VOLVER ]
```

---

# 12. HUD

Durante la partida mostrar:

```text
MEMORY GAME

Pares encontrados: 3 / 8
Movimientos: 12
Tiempo: 00:32

[ESC] Pausa
```

El contador de movimientos debe aumentar cuando se complete una selección de dos cartas.

---

# 13. Temporizador de partida

Mostrar:

```text
Tiempo: 00:47
```

Debe:

* comenzar al iniciar la partida;
* detenerse al ganar;
* detenerse durante pausa;
* continuar después de reanudar.

No utilizar `time.sleep()`.

---

# 14. Pausa

Al presionar:

```text
ESC
```

mostrar:

```text
==============================

          PAUSA

       [ CONTINUAR ]

      [ REINICIAR ]

    [ MENÚ PRINCIPAL ]

==============================
```

Mientras esté pausado:

* detener el contador;
* ignorar clics sobre el tablero;
* conservar los estados de las cartas;
* mantener la ventana funcionando.

---

# 15. Victoria

Cuando todas las cartas tengan:

```text
MATCHED
```

la partida termina.

Mostrar:

```text
==============================

       ¡HAS GANADO!

       Tiempo: 01:24
       Movimientos: 27

       [ JUGAR DE NUEVO ]

       [ MENÚ PRINCIPAL ]

==============================
```

---

# 16. Diseño visual

Utilizar estética:

**Arcade retro / pixel art / 8-bit / 16-bit**

No descargar imágenes externas obligatoriamente.

Las cartas pueden dibujarse mediante:

```python
pygame.draw.rect()
pygame.draw.circle()
pygame.draw.line()
pygame.draw.polygon()
```

El reverso debe ser claramente distinguible del frente.

---

# 17. Arquitectura del proyecto

Utilizar una estructura similar a:

```text
memory_game/
│
├── main.py
├── requirements.txt
├── README.md
│
├── game/
│   ├── __init__.py
│   ├── game.py
│   ├── card.py
│   ├── board.py
│   ├── states.py
│   └── ui.py
│
├── tests/
│   ├── __init__.py
│   ├── test_card.py
│   ├── test_board.py
│   └── test_game_logic.py
│
└── assets/
```

Si consideras que alguna división es innecesaria, puedes simplificarla, pero debes mantener separadas las responsabilidades principales.

---

# 18. Pruebas automatizadas

Esta sección es OBLIGATORIA.

Utiliza:

```text
pytest
```

Las pruebas deben concentrarse principalmente en **lógica de negocio y comportamiento**, evitando depender de la representación gráfica de Pygame cuando no sea necesario.

Crear una carpeta:

```text
tests/
```

---

# 19. Pruebas de Card

Crear:

```text
tests/test_card.py
```

Implementar pruebas para comprobar como mínimo:

### Estado inicial

Una carta nueva debe comenzar como:

```text
HIDDEN
```

### Revelar

Comprobar:

```text
HIDDEN → REVEALED
```

### Ocultar

Comprobar:

```text
REVEALED → HIDDEN
```

### Match

Comprobar:

```text
REVEALED → MATCHED
```

### Carta encontrada

Comprobar que una carta `MATCHED` no pueda volver a ocultarse accidentalmente.

### Detección de clic

Crear una prueba que compruebe que:

```python
card.contains_point(x, y)
```

devuelve correctamente:

```text
True
```

cuando el punto está dentro de la carta y:

```text
False
```

cuando está fuera.

---

# 20. Pruebas del Board

Crear:

```text
tests/test_board.py
```

Implementar como mínimo:

### Cantidad de cartas

Comprobar que un tablero 4x4 contiene:

```text
16 cartas
```

### Cantidad de parejas

Comprobar que existen:

```text
8 parejas
```

### Valores duplicados

Comprobar que cada valor aparece exactamente dos veces.

Ejemplo:

```text
A → 2
B → 2
C → 2
...
```

Ningún valor debe aparecer una sola vez o más de dos veces.

### Mezcla

Crear dos tableros independientes y verificar que el sistema puede generar órdenes diferentes.

No hagas que esta prueba dependa de que aleatoriamente siempre sean diferentes. Utiliza una estrategia adecuada para que la prueba sea determinista.

### Encontrar pareja

Crear dos cartas con el mismo valor y comprobar que el tablero puede identificarlas como pareja.

### Pareja incorrecta

Crear dos cartas con valores diferentes y comprobar que son identificadas correctamente como una combinación incorrecta.

### Victoria

Marcar todas las cartas como `MATCHED` y comprobar:

```python
board.is_complete()
```

debe devolver:

```text
True
```

---

# 21. Pruebas de lógica del juego

Crear:

```text
tests/test_game_logic.py
```

Comprobar como mínimo:

### Selección de primera carta

Después de seleccionar una carta:

```text
selected_cards == 1
```

### Selección de segunda carta

Después de seleccionar otra:

```text
selected_cards == 2
```

### No permitir tercera carta

Mientras existan dos cartas pendientes de evaluación:

```text
third_card_selection == False
```

### Pareja correcta

Comprobar:

```text
A + A
```

produce:

```text
MATCHED
```

en ambas cartas.

### Pareja incorrecta

Comprobar:

```text
A + B
```

produce el estado temporal esperado y posteriormente:

```text
HIDDEN
```

### Contador de movimientos

Comprobar que:

```text
1 pareja evaluada = 1 movimiento
```

y no:

```text
2 clics = 2 movimientos
```

### Contador de parejas

Una pareja correcta debe incrementar:

```text
pairs_found
```

Una pareja incorrecta no debe incrementarlo.

---

# 22. Pruebas de estados

Crear pruebas que garanticen transiciones válidas:

```text
MENU → PLAYING
PLAYING → PAUSED
PAUSED → PLAYING
PLAYING → GAME_WON
GAME_WON → PLAYING
```

También verificar que una transición inválida no produzca estados inconsistentes.

---

# 23. Pruebas de temporización

No utilizar esperas reales de 1 segundo dentro de las pruebas.

Las pruebas deben ser rápidas y deterministas.

Abstrae o inyecta el mecanismo de tiempo cuando sea necesario.

Por ejemplo, si utilizas:

```python
pygame.time.get_ticks()
```

considera separar la lógica de tiempo de la lógica de negocio para poder probarla mediante un reloj simulado/falso.

La prueba debe poder simular:

```text
t = 0 ms
```

y posteriormente:

```text
t = 1000 ms
```

sin esperar realmente un segundo.

---

# 24. Pruebas deterministas

Las pruebas NO deben depender de:

* tiempos reales;
* aleatoriedad real;
* posición exacta de la ventana;
* rendering;
* resolución del monitor;
* interacción física del mouse;
* existencia de assets externos.

Cuando exista aleatoriedad, utilizar mecanismos que permitan controlarla durante las pruebas.

Cuando exista tiempo, utilizar un reloj falso/mock cuando sea apropiado.

---

# 25. Fixtures de pytest

Utiliza fixtures cuando ayuden a evitar duplicación.

Por ejemplo:

```python
@pytest.fixture
def board():
    ...
```

o fixtures para crear cartas:

```python
@pytest.fixture
def matching_cards():
    ...
```

No abuses de fixtures si hacen que las pruebas sean difíciles de entender.

---

# 26. Cobertura

La prioridad de las pruebas debe ser cubrir:

```text
Card
Board
Game Logic
State transitions
Pair matching
Victory condition
Move counter
Timer logic
```

No es obligatorio alcanzar un porcentaje específico de cobertura, pero procura cubrir las rutas críticas.

Opcionalmente puedes agregar:

```text
pytest-cov
```

y permitir:

```bash
pytest --cov=game
```

si consideras que aporta valor.

No agregues `pytest-cov` si no es necesario para el funcionamiento básico.

---

# 27. Separación entre lógica y Pygame

IMPORTANTE:

Diseña el código de manera que la mayor parte de la lógica pueda probarse **sin abrir una ventana gráfica**.

Idealmente:

```text
Lógica
   ↓
Card
Board
Game State
Matching
Timer Logic
   ↓
Pygame Rendering
```

El rendering debe ser una capa separada siempre que sea razonable.

No escribas pruebas que simplemente comprueben que:

```python
pygame.draw.rect(...)
```

fue llamado.

Prioriza comprobar **comportamiento**, no implementación.

---

# 28. README

El `README.md` debe incluir:

1. Descripción.
2. Requisitos.
3. Instalación.
4. Entorno virtual.
5. Instalación de dependencias.
6. Ejecución.
7. Controles.
8. Reglas.
9. Estructura.
10. Ejecución de pruebas.

Incluir:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Ejecutar el juego:

```bash
python main.py
```

Ejecutar las pruebas:

```bash
pytest
```

Opcionalmente:

```bash
pytest -v
```

---

# 29. Criterios de aceptación del juego

El proyecto solamente se considera terminado cuando:

* [ ] El programa inicia correctamente.
* [ ] Aparece el menú principal.
* [ ] Se puede iniciar una partida.
* [ ] El tablero contiene 16 cartas.
* [ ] Existen exactamente 8 parejas.
* [ ] Las cartas se mezclan aleatoriamente.
* [ ] Las cartas comienzan ocultas.
* [ ] Se puede seleccionar una carta.
* [ ] La carta cambia a visible.
* [ ] Se puede seleccionar una segunda carta.
* [ ] El juego compara correctamente los valores.
* [ ] Las parejas correctas permanecen visibles.
* [ ] Las parejas incorrectas vuelven a ocultarse después del tiempo establecido.
* [ ] No se puede seleccionar una tercera carta durante la evaluación.
* [ ] No se utiliza `time.sleep()` en el game loop.
* [ ] El contador de movimientos funciona.
* [ ] El temporizador funciona.
* [ ] ESC permite pausar.
* [ ] El temporizador se detiene durante la pausa.
* [ ] Se puede reanudar.
* [ ] Se puede reiniciar.
* [ ] Se puede volver al menú.
* [ ] Se detecta correctamente la victoria.
* [ ] Se muestra el resultado final.
* [ ] El juego mantiene aproximadamente 60 FPS.
* [ ] No existen errores durante la ejecución.

---

# 30. Criterios de aceptación de QA

Las pruebas automatizadas son obligatorias.

Ejecutar:

```bash
pytest -v
```

Todas las pruebas deben pasar.

Como mínimo debe existir cobertura automatizada para:

* [ ] Estado inicial de Card.
* [ ] Revelar carta.
* [ ] Ocultar carta.
* [ ] Marcar carta como MATCHED.
* [ ] Impedir modificar una carta MATCHED incorrectamente.
* [ ] Detección de clic.
* [ ] Creación del tablero.
* [ ] Número correcto de cartas.
* [ ] Número correcto de parejas.
* [ ] Cada valor aparece exactamente dos veces.
* [ ] Detección de parejas correctas.
* [ ] Detección de parejas incorrectas.
* [ ] Selección de cartas.
* [ ] Bloqueo de tercera selección.
* [ ] Contador de movimientos.
* [ ] Contador de parejas.
* [ ] Condición de victoria.
* [ ] Estados del juego.
* [ ] Lógica del temporizador.
* [ ] Pausa del temporizador.
* [ ] Reinicio de partida.

No considerar terminado el proyecto simplemente porque el juego abre correctamente.

Debe cumplirse:

```text
Juego funcional
        +
Código mantenible
        +
Pruebas automatizadas
        +
Todas las pruebas pasando
```

---

# 31. Forma de trabajo de la IA

NO generes inmediatamente todo el proyecto.

Primero analiza los requisitos y presenta:

1. Arquitectura.
2. Clases.
3. Estados.
4. Flujo de selección.
5. Sistema de comparación.
6. Temporizador.
7. Separación entre lógica y rendering.
8. Estrategia de testing.
9. Casos de prueba.
10. Estructura de archivos.

Después de presentar el diseño, implementa en etapas.

### Etapa 1 — Modelo

Implementar:

* Card.
* Board.
* Estados.
* Generación de parejas.

### Etapa 2 — Lógica

Implementar:

* Selección.
* Comparación.
* MATCHED.
* Ocultación.
* Contadores.
* Victoria.

### Etapa 3 — Testing

Crear las pruebas automatizadas de las etapas 1 y 2.

Ejecutar:

```bash
pytest -v
```

Corregir todos los errores antes de continuar.

### Etapa 4 — Pygame

Implementar:

* ventana;
* rendering;
* mouse;
* HUD;
* menú;
* pausa;
* pantalla de victoria.

### Etapa 5 — Integración

Integrar Pygame con la lógica existente.

Evitar duplicar lógica dentro del rendering.

### Etapa 6 — QA final

Ejecutar:

```bash
pytest -v
```

y ejecutar el juego.

Verificar:

```text
Juego
+
Pruebas automatizadas
+
Estados
+
Temporizadores
+
Interacción
```

Corregir cualquier problema encontrado.

Finalmente realiza una revisión del código y confirma:

1. Número de pruebas ejecutadas.
2. Número de pruebas exitosas.
3. Número de pruebas fallidas.
4. Problemas encontrados.
5. Problemas corregidos.
6. Cómo ejecutar el juego.
7. Cómo ejecutar las pruebas.

La prioridad es:

**LÓGICA CORRECTA → TESTING → ESTADOS → TEMPORIZACIÓN → JUGABILIDAD → INTERFAZ → EFECTOS VISUALES**
