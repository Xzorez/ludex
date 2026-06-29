<div align="center">

<img src="assets/icon.png" width="120" alt="Ludex" />

# Ludex

**Votre bibliothèque personnelle de jeux vidéo** — suivez ce que vous jouez, ce que vous voulez jouer et ce que vous avez terminé, avec des notes, des dates, un journal, des statistiques et la découverte de jeux solo.

[English](README.md) · [Español](README.es.md) · **Français** · [Português](README.pt.md)

[![Télécharger](https://img.shields.io/github/v/release/Xzorez/ludex?label=t%C3%A9l%C3%A9charger&color=ff4d8d)](https://github.com/Xzorez/ludex/releases/latest)
[![Licence](https://img.shields.io/github/license/Xzorez/ludex?color=7b5cff)](LICENSE)
![Plateforme](https://img.shields.io/badge/Windows-10%20%2F%2011-0078D6?logo=windows&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-31-47848F?logo=electron&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

</div>

---

Ludex est une **application de bureau pour Windows** (ce n'est pas un site web) construite avec Electron. Elle utilise le
**catalogue Steam** pour rechercher des jeux et récupérer jaquettes, genres, descriptions, captures d'écran et
les temps de jeu de **HowLongToBeat** — le tout **sans clé d'API ni connexion**. Vos données sont stockées
**uniquement sur votre PC**.

## Fonctionnalités

- **Bibliothèque par statut** : En cours, En pause, Terminés, Abandonnés, À jouer et Liste de souhaits.
- **Note en étoiles** (demi-étoiles incluses), **date de fin**, **étiquettes** et un **journal/critique** (avec masquage facultatif des spoilers).
- **Journal chronologique** des jeux que vous terminez, regroupés par mois.
- **Collections personnalisées** pour regrouper les jeux à votre façon.
- **Filtres** par genre et étiquette, plus la recherche dans votre bibliothèque.
- **Fiche détaillée** (depuis Steam) : description, genres, date de sortie, développeur, captures d'écran (avec visionneuse) et heures **HowLongToBeat**.
- **Statistiques** et un **Bilan de l'année (Wrapped)** exportable en image à partager.
- **Accueil** avec des recommandations de jeux solo / histoire (les plus populaires et les plus souhaités sur Steam), masquant ceux que vous possédez déjà.
- **Personnalisation** : 10 couleurs d'accentuation, thèmes, taille des jaquettes et fond dynamique.
- **Barre de titre personnalisée**, écran de démarrage animé et **sauvegarde** (export/import).
- **Quatre langues** (espagnol, anglais, français et portugais) et une configuration au premier lancement pour choisir votre langue et votre thème.
- **Mise à jour automatique** : se met à jour depuis les releases GitHub.

## Captures d'écran

<div align="center">

| Accueil | Bilan de l'année |
| :---: | :---: |
| <img src="docs/screenshots/home.png" width="420" /> | <img src="docs/screenshots/wrapped.png" width="420" /> |

| Fiche du jeu | Menu de statut |
| :---: | :---: |
| <img src="docs/screenshots/detail.png" width="420" /> | <img src="docs/screenshots/dropdown.png" width="260" /> |

</div>

## Télécharger

1. Allez sur **[Releases](https://github.com/Xzorez/ludex/releases/latest)** et téléchargez **`Ludex-Setup-x.y.z.exe`**.
2. Lancez-le et suivez l'installateur.

> Comme il n'est pas signé numériquement, Windows peut afficher **SmartScreen** : cliquez sur
> *Informations complémentaires -> Exécuter quand même*.

Après l'installation, **Ludex se met à jour tout seul** : au lancement, il vérifie s'il existe une nouvelle version,
la télécharge en arrière-plan et vous invite à redémarrer pour l'installer.

### Où sont stockées mes données ?

Dans `C:\Users\<votre utilisateur>\AppData\Roaming\Ludex\games.json`. Pas de cloud, pas de comptes, pas de télémétrie.
Vous pouvez copier ce fichier comme sauvegarde (ou utiliser **Réglages -> Exporter la bibliothèque**).

## Compiler depuis les sources

Nécessite [Node.js](https://nodejs.org).

```bash
npm install      # installer les dépendances
npm start        # exécuter en mode développement
npm run dist     # générer l'installateur dans release\
```

### Structure du projet

```
assets/                  Icône de l'app et de l'installateur
docs/screenshots/        Captures pour le README
src/
  main.js                Processus principal (données, Steam, HLTB, mises à jour)
  preload.js             Pont sécurisé renderer <-> processus principal
  renderer/
    index.html           Interface
    styles.css           Styles (thème sombre, responsive)
    app.js               Logique de l'interface
    assets/              Police d'icônes Material Symbols (locale)
```

### Technologie

- **Electron** (sans framework UI) + **electron-builder** (installateur NSIS) + **electron-updater** (mise à jour automatique).
- Icônes : **Material Symbols** de Google, intégrées localement.
- Données de jeux : API publiques de **Steam** (`storesearch`, `appdetails`, `featuredcategories`, recherche filtrée) et **HowLongToBeat** — sans clé d'API.

> Note lors de la compilation sous Windows : si la première build échoue lors du décompactage de `winCodeSign`
> (liens symboliques macOS), activez le **Mode développeur** de Windows ou lancez le terminal en administrateur.

## Contribuer

Les *issues* et *pull requests* sont les bienvenues. Vous avez trouvé un bug ou une idée ? Ouvrez une issue.

## Licence

[MIT](LICENSE) — libre d'utilisation, de modification et de partage.

<div align="center">
<sub>Réalisé avec Electron.</sub>
</div>
