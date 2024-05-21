# Générateur de Map Tiles / Map Tiles Generator

🚀 [Demo Page](https://example.com/demo)

## Description

### 🇫🇷 Français

Ce projet est un générateur de tuiles de carte. Il scanne un dossier d'entrée à la recherche de fichiers image et génère des tuiles de carte pour les niveaux de zoom de 0 à 18, puis les enregistre dans un dossier de sortie. Le script est écrit en Node.js et est optimisé pour une performance maximale.

### 🇬🇧 English

This project is a map tiles generator. It scans an input folder for image files and generates map tiles for zoom levels 0 to 18, then saves them in an output folder. The script is written in Node.js and is optimized for maximum performance.

## 📁 Structure du Projet / Project Structure

```bash
project/
│
├── input/
│ ├── image1.jpg
│ ├── image2.png
│ └── ...
│
└── output/
```


## 🚀 Utilisation / Usage

### 🇫🇷 Français

1. Installez les dépendances:
    ```bash
    npm install
    ```

2. Placez vos images dans le dossier `input`.

3. Exécutez le script:
    ```bash
    npm start
    ```

4. Les tuiles de carte seront générées dans le dossier `output`.

### 🇬🇧 English

1. Install dependencies:
    ```bash
    npm install
    ```

2. Place your images in the `input` folder.

3. Run the script:
    ```bash
    npm start
    ```

4. The map tiles will be generated in the `output` folder.

## 🔧 Configuration GitHub Actions / GitHub Actions Configuration

### 🇫🇷 Français

1. Créez un fichier `action.yml` à la racine de votre projet avec le contenu suivant:

    ```yaml
    name: Generate Map Tiles

    on:
      push:
        branches:
          - main

    jobs:
      generate-tiles:
        runs-on: ubuntu-latest

        steps:
          - name: Checkout repository
            uses: actions/checkout@v2

          - name: Set up Node.js
            uses: actions/setup-node@v2
            with:
              node-version: '14'

          - name: Install dependencies
            run: npm install

          - name: Generate Map Tiles
            run: npm start
    ```

### 🇬🇧 English

1. Create a file `action.yml` at the root of your project with the following content:

    ```yaml
    name: Generate Map Tiles

    on:
      push:
        branches:
          - main

    jobs:
      generate-tiles:
        runs-on: ubuntu-latest

        steps:
          - name: Checkout repository
            uses: actions/checkout@v2

          - name: Set up Node.js
            uses: actions/setup-node@v2
            with:
              node-version: '14'

          - name: Install dependencies
            run: npm install

          - name: Generate Map Tiles
            run: npm start
    ```

## 🌐 Page Démo / Demo Page

[Demo Page](https://example.com/demo)
