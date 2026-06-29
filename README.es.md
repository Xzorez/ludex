<div align="center">

<img src="assets/icon.png" width="120" alt="Ludex" />

# Ludex

**Tu biblioteca personal de videojuegos** — apunta lo que juegas, lo que quieres jugar y lo que ya completaste, con notas, fechas, diario, estadísticas y descubrimiento de juegos de un jugador.

[English](README.md) · **Español** · [Français](README.fr.md) · [Português](README.pt.md)

[![Descargar](https://img.shields.io/github/v/release/Xzorez/ludex?label=descargar&color=ff4d8d)](https://github.com/Xzorez/ludex/releases/latest)
[![Licencia](https://img.shields.io/github/license/Xzorez/ludex?color=7b5cff)](LICENSE)
![Plataforma](https://img.shields.io/badge/Windows-10%20%2F%2011-0078D6?logo=windows&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-31-47848F?logo=electron&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

</div>

---

Ludex es una app de **escritorio para Windows** (no es una web) hecha con Electron. Usa el
**catálogo de Steam** para buscar juegos y traer carátulas, géneros, descripciones, capturas y
las horas de **HowLongToBeat** — todo **sin clave de API ni iniciar sesión**. Tus datos se
guardan **solo en tu PC**.

## Características

- **Biblioteca por estados**: Jugando, En pausa, Completados, Abandonados, Quiero jugar y Lista de deseos.
- **Nota con estrellas** (medias incluidas), **fecha de finalización**, **etiquetas** y **diario/reseña** (con opción de ocultar spoilers).
- **Bitácora cronológica** de los juegos que terminas, agrupada por mes.
- **Colecciones** personalizadas para agrupar juegos a tu gusto.
- **Filtros** por género y etiqueta; búsqueda en tu biblioteca.
- **Ficha enriquecida** (de Steam): descripción, géneros, fecha, desarrollador, capturas (con visor) y horas de **HowLongToBeat**.
- **Estadísticas** y un **Resumen del año (Wrapped)** exportable como imagen para compartir.
- **Inicio** con recomendaciones de juegos **de un jugador / historia** (los más populares y más deseados de Steam), ocultando los que ya tienes.
- **Personalización**: 10 colores de acento, temas, tamaño de carátulas y fondo dinámico.
- **Barra de título propia**, pantalla de carga animada y **copia de seguridad** (exportar/importar).
- **Cuatro idiomas** (español, inglés, francés y portugués) y una pantalla inicial para elegir idioma y tema.
- **Auto-actualización**: se actualiza sola desde las releases de GitHub.

## Capturas

<div align="center">

| Inicio | Resumen del año |
| :---: | :---: |
| <img src="docs/screenshots/home.png" width="420" /> | <img src="docs/screenshots/wrapped.png" width="420" /> |

| Ficha del juego | Estados desplegables |
| :---: | :---: |
| <img src="docs/screenshots/detail.png" width="420" /> | <img src="docs/screenshots/dropdown.png" width="260" /> |

</div>

## Descargar

1. Ve a **[Releases](https://github.com/Xzorez/ludex/releases/latest)** y descarga **`Ludex-Setup-x.y.z.exe`**.
2. Ejecútalo y sigue el instalador.

> Como no está firmado digitalmente, Windows puede mostrar **SmartScreen**: pulsa
> *Más información -> Ejecutar de todas formas*.

A partir de la instalación, **Ludex se actualiza solo**: al abrirla comprueba si hay versión
nueva, la descarga en segundo plano y te avisa para reiniciar e instalar.

### ¿Dónde se guardan mis datos?

En `C:\Users\<tu usuario>\AppData\Roaming\Ludex\games.json`. Sin nube, sin cuentas, sin telemetría.
Puedes copiar ese archivo como respaldo (o usar **Ajustes -> Exportar biblioteca**).

## Compilar desde el código

Requiere [Node.js](https://nodejs.org).

```bash
npm install      # instalar dependencias
npm start        # ejecutar en modo desarrollo
npm run dist     # generar el instalador en release\
```

### Estructura

```
assets/                  Icono de la app y del instalador
docs/screenshots/        Capturas para el README
src/
  main.js                Proceso principal (datos, Steam, HLTB, actualizaciones)
  preload.js             Puente seguro renderer <-> proceso principal
  renderer/
    index.html           Interfaz
    styles.css           Estilos (tema oscuro, responsive)
    app.js               Lógica de la interfaz
    assets/              Fuente de iconos Material Symbols (local)
```

### Tecnología

- **Electron** (sin frameworks de UI) + **electron-builder** (instalador NSIS) + **electron-updater** (auto-update).
- Iconos: **Material Symbols** de Google, incrustados localmente.
- Datos de juegos: API pública de **Steam** (`storesearch`, `appdetails`, `featuredcategories`, búsqueda con filtros) y **HowLongToBeat** — sin clave de API.

> Nota al compilar en Windows: si la primera build falla al desempaquetar `winCodeSign`
> (symlinks de macOS), activa el **Modo de programador** de Windows o ejecuta la terminal como administrador.

## Contribuir

Las *issues* y *pull requests* son bienvenidas. Si encuentras un fallo o tienes una idea, abre una issue.

## Licencia

[MIT](LICENSE) — libre para usar, modificar y compartir.

La licencia MIT obliga a conservar el aviso de copyright (`Jose Luis (Xzorez)`) en cualquier copia o derivado. Si reutilizas este código, se agradece mucho un **crédito visible** en la pantalla de información/créditos de tu app.

<div align="center">
<sub>Hecho con Electron.</sub>
</div>
