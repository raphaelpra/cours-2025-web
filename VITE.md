# Vite — Guide de démarrage

[Vite](https://vite.dev) est un outil de build et serveur de développement pour les applications web modernes. Ultra-rapide, il recharge la page instantanément quand vous modifiez un fichier.

---

## C'est quoi Vite ?

Jusqu'ici, `bun index.html` suffisait pour servir un fichier HTML statique. Mais dès qu'on utilise un framework (SolidJS, React, Vue…), il faut un outil qui :

- **Comprend le JSX** — transforme `<div>Bonjour</div>` en JavaScript
- **Gère les imports** — résout `import App from "./App.jsx"` automatiquement
- **Recharge à chaud** — actualise le navigateur dès qu'on sauve un fichier (HMR)
- **Optimise pour la production** — minifie et bundle tout en un seul fichier

Vite fait tout ça, et il est très rapide.

---

## Créer un projet SolidJS

```bash
bun create vite mon-app --template solid
cd mon-app
bun install
```

> `bun create vite` télécharge et exécute l'outil `create-vite` sans l'installer globalement. `--template solid` choisit le template SolidJS (en JavaScript).

### Lancer le serveur de développement

```bash
bun dev
```

Ouvrir http://localhost:5173 — vous devriez voir la page d'accueil Vite + Solid avec un compteur.

**Le rechargement à chaud (HMR)** : modifiez n'importe quel fichier dans `src/`, sauvegardez → le navigateur se met à jour instantanément, sans recharger la page entière.

---

## Structure du projet

```
mon-app/
├── index.html          ← point d'entrée (charge src/index.jsx)
├── package.json        ← dépendances et scripts
├── vite.config.js      ← configuration de Vite
├── public/             ← fichiers statiques (copiés tels quels)
│   └── vite.svg
└── src/                ← votre code
    ├── index.jsx       ← monte l'app dans le DOM
    ├── index.css       ← styles globaux
    ├── App.jsx         ← composant principal
    └── App.css         ← styles du composant App
```

### Comment ça marche ?

1. Le navigateur charge `index.html`
2. `index.html` contient `<script type="module" src="/src/index.jsx">` — charge votre JS
3. `src/index.jsx` importe `App.jsx` et le rend dans `<div id="root">`
4. Vite intercepte tout ça, transforme le JSX en JS, et sert le résultat

---

## Commandes essentielles

| Commande | Description |
|----------|-------------|
| `bun dev` | Lance le serveur de développement (port 5173) |
| `bun run build` | Compile le projet pour la production (dans `dist/`) |
| `bun run preview` | Prévisualise le build de production |

Ces commandes sont des raccourcis définis dans `package.json` :

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## Fichiers clés

### `vite.config.js`

Configuration minimale — juste le plugin SolidJS :

```javascript
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
});
```

### `src/index.jsx`

Point d'entrée de l'application — monte le composant `App` dans le DOM :

```javascript
import { render } from "solid-js/web";
import App from "./App.jsx";

render(() => <App />, document.getElementById("root"));
```

### `src/App.jsx`

Votre composant principal — c'est ici que vous codez :

```javascript
import { createSignal } from "solid-js";
import "./App.css";

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <h1>Mon app</h1>
      <button onClick={() => setCount(count() + 1)}>
        Compteur : {count()}
      </button>
    </div>
  );
}

export default App;
```

---

## Ajouter du CSS

Deux méthodes :

```javascript
// 1. Importer un fichier CSS (styles globaux ou par composant)
import "./App.css";

// 2. Style inline via l'attribut style (objet JS)
<div style={{ color: "red", "font-size": "20px" }}>Rouge</div>
```

> En Solid/JSX, `style` prend un **objet** (`{{ }}`) et non une chaîne. Les propriétés CSS avec des tirets (`font-size`) s'écrivent entre guillemets.

---

## En cas de problème

### `bun dev` ne lance rien

Vérifiez que `bun install` a bien été exécuté :

```bash
bun install
bun dev
```

### Le port 5173 est déjà utilisé

Vite en choisit un autre automatiquement (5174, 5175…). Regardez la sortie dans le terminal.

### Les modifications ne s'affichent pas

- Vérifiez que vous éditez bien les fichiers dans `src/`
- Vérifiez que le serveur `bun dev` tourne toujours dans le terminal
- Rechargez la page manuellement (Ctrl+R) en dernier recours

---

## Ressources

- [Documentation Vite](https://vite.dev/guide/)
- [Documentation SolidJS](https://www.solidjs.com/guides/getting-started)
- [SolidJS Tutorial](https://www.solidjs.com/tutorial/) — tutoriel interactif officiel