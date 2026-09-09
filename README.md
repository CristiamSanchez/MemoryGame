# Memory Game

Memory Game es un mini proyecto web de juego de memoria, diseñado para funcionar tanto en escritorio como en dispositivos móviles.

## Características

- Tablero de 4x4 con 8 parejas.
- Lógica de comparación y emparejamiento.
- Temporizador y contador de movimientos.
- Responsive para celular y desktop.
- Reinicio rápido del juego.

## Requisitos

- Navegador moderno.
- Python 3 para servir la app localmente si quieres ejecutarla en localhost.

## Ejecutar localmente

Desde la raíz del proyecto:

```bash
cd /home/cristiamsanchez/Documents/VSCodeProjects/MemoryGame
python3 -m http.server 8000
```

Luego abre esta URL en tu navegador:

```text
http://localhost:8000
```

## Estructura del proyecto

```text
MemoryGame/
├── index.html
├── styles.css
├── app.js
├── README.md
├── .gitignore
└── assets/
```

## Subirlo a GitHub

1. Inicia el repositorio:

```bash
git init
```

2. Conecta con el repositorio remoto:

```bash
git remote add origin https://github.com/CristiamSanchez/MemoryGame.git
```

3. Añade los archivos:

```bash
git add .
```

4. Haz el primer commit:

```bash
git commit -m "Initial commit: Memory Game web responsive"
```

5. Sube a GitHub:

```bash
git branch -M main
git push -u origin main
```

## Notas

Si quieres más adelante puedes añadir sonido, pantalla de victoria más decorada o persistencia de puntuación usando localStorage.
