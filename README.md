<div align="center">

<img src="assets/icon.png" width="120" alt="Ludex" />

# Ludex

**Your personal video game library** — track what you play, what you want to play and what you have finished, with ratings, dates, a journal, statistics and single-player game discovery.

**English** · [Español](README.es.md) · [Français](README.fr.md) · [Português](README.pt.md)

[![Download](https://img.shields.io/github/v/release/Xzorez/ludex?label=download&color=ff4d8d)](https://github.com/Xzorez/ludex/releases/latest)
[![License](https://img.shields.io/github/license/Xzorez/ludex?color=7b5cff)](LICENSE)
![Platform](https://img.shields.io/badge/Windows-10%20%2F%2011-0078D6?logo=windows&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-31-47848F?logo=electron&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

</div>

---

Ludex is a **desktop app for Windows** (not a website) built with Electron. It uses the
**Steam catalog** to search for games and pull cover art, genres, descriptions, screenshots and
**HowLongToBeat** play times — all **without an API key or signing in**. Your data is stored
**only on your PC**.

## Features

- **Library by status**: Playing, Paused, Completed, Dropped, Want to play and Wishlist.
- **Star rating** (half stars), **finish date**, **tags** and a **journal/review** (with optional spoiler hiding).
- **Chronological log** of the games you finish, grouped by month.
- **Custom collections** to group games your way.
- **Filters** by genre and tag, plus search within your library.
- **Rich detail** (from Steam): description, genres, release date, developer, screenshots (with a viewer) and **HowLongToBeat** hours.
- **Statistics** and a **Year in Review (Wrapped)** that you can export as an image to share.
- **Home** with single-player / story game recommendations (Steam's most popular and most wishlisted), hiding the ones you already own.
- **Personalization**: 10 accent colors, themes, cover size and dynamic background.
- **Custom title bar**, animated splash screen and **backup** (export/import).
- **Four languages** (Spanish, English, French and Portuguese) and a first-run setup to pick your language and theme.
- **Auto-update**: updates itself from GitHub releases.

## Screenshots

<div align="center">

| Home | Year in Review |
| :---: | :---: |
| <img src="docs/screenshots/home.png" width="420" /> | <img src="docs/screenshots/wrapped.png" width="420" /> |

| Game detail | Status dropdown |
| :---: | :---: |
| <img src="docs/screenshots/detail.png" width="420" /> | <img src="docs/screenshots/dropdown.png" width="260" /> |

</div>

## Download

1. Go to **[Releases](https://github.com/Xzorez/ludex/releases/latest)** and download **`Ludex-Setup-x.y.z.exe`**.
2. Run it and follow the installer.

> Since it is not digitally signed, Windows may show **SmartScreen**: click
> *More info -> Run anyway*.

After installing, **Ludex updates itself**: on launch it checks for a new version,
downloads it in the background and prompts you to restart and install.

### Where is my data stored?

In `C:\Users\<your user>\AppData\Roaming\Ludex\games.json`. No cloud, no accounts, no telemetry.
You can copy that file as a backup (or use **Settings -> Export library**).

## Build from source

Requires [Node.js](https://nodejs.org).

```bash
npm install      # install dependencies
npm start        # run in development
npm run dist     # build the installer into release\
```

### Project structure

```
assets/                  App and installer icon
docs/screenshots/        README screenshots
src/
  main.js                Main process (data, Steam, HLTB, updates)
  preload.js             Secure renderer <-> main bridge
  renderer/
    index.html           UI
    styles.css           Styles (dark theme, responsive)
    app.js               UI logic
    assets/              Material Symbols icon font (local)
```

### Tech

- **Electron** (no UI framework) + **electron-builder** (NSIS installer) + **electron-updater** (auto-update).
- Icons: **Material Symbols** by Google, embedded locally.
- Game data: public **Steam** APIs (`storesearch`, `appdetails`, `featuredcategories`, filtered search) and **HowLongToBeat** — no API key.

> Note when building on Windows: if the first build fails while unpacking `winCodeSign`
> (macOS symlinks), enable Windows **Developer Mode** or run the terminal as administrator.

## Contributing

Issues and pull requests are welcome. Found a bug or have an idea? Open an issue.

## License

[MIT](LICENSE) — free to use, modify and share.

<div align="center">
<sub>Made with Electron.</sub>
</div>
