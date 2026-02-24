# Cours interactif — Vite, SolidJS et CSS

> Ce cours est **interactif** : vous codez en même temps que le prof.

⚠️ **Créez tout dans un dossier `perso/` pour ne pas avoir de conflits avec git :**

```bash
cd 04-css-solidjs
mkdir -p perso
cd perso
```

Tous vos projets de cette séance iront dans ce dossier. Il est ignoré par git — aucun risque de conflit au prochain `git pull`.

---

## 1 — Pourquoi un framework ?

Jusqu'ici, on a fait du JavaScript dans le terminal (Bun). Pour construire une **interface** dans le navigateur, il faut manipuler le DOM (Document Object Model) — l'arbre d'éléments HTML de la page.

### Le problème : le DOM vanilla, c'est pénible

Pour créer un simple bouton avec un compteur en JavaScript pur :

```javascript
const button = document.createElement("button");
let count = 0;
button.textContent = `Cliqué ${count} fois`;
button.addEventListener("click", () => {
    count++;
    button.textContent = `Cliqué ${count} fois`;
});
document.body.appendChild(button);
```

7 lignes pour **un bouton**. Et il faut manuellement mettre à jour le texte à chaque clic. Imaginez une vraie application avec des dizaines d'éléments dynamiques…

### La solution : un framework

Un framework permet d'écrire du **HTML déclaratif dans du JS**, et les mises à jour se font **toutes seules** :

```jsx
function App() {
    const [count, setCount] = createSignal(0);
    return <button onClick={() => setCount(count() + 1)}>Cliqué {count()} fois</button>;
}
```

3 lignes. Pas de `createElement`, pas de `addEventListener`, pas de mise à jour manuelle.

### Quel framework ?

Les plus connus : **React** (Meta), **Vue** (communauté), **Svelte**, **Solid**.

On utilise **SolidJS** dans ce cours car :
- Syntaxe quasi identique à React (le plus utilisé en entreprise)
- Plus simple à comprendre (pas de "re-render" magique)
- Plus performant (benchmark le plus rapide)

---

## 2 — Créer un projet avec Vite

[Vite](https://vite.dev) est l'outil de build standard pour les projets frontend. Il transforme votre JSX en JavaScript, gère les imports, et recharge le navigateur instantanément quand vous modifiez un fichier.

📖 Guide détaillé : [VITE.md](../VITE.md)

### Créer le projet

👉 Depuis votre dossier `perso/` :

```bash
bun create vite mon-app --template solid
cd mon-app
bun install
bun dev
```

#### Décortiquer la commande

`bun create vite` lance l'outil `create-vite` de Vite. Sans `--template`, il pose des questions interactives :

```
◆ Select a framework:
│  Vanilla
│  Vue
│  React
│  Preact
│  Lit
│  Svelte
│  Solid    ← notre choix
│  Qwik
│  Angular
│  Others
│
◆ Select a variant:
│  TypeScript
│  JavaScript  ← notre choix
```

Le flag `--template solid` répond à ces deux questions d'un coup (Solid + JavaScript).

Les templates disponibles :

| Template | Framework | Langage |
|----------|-----------|---------|
| `vanilla` | Aucun | JavaScript |
| `vanilla-ts` | Aucun | TypeScript |
| `react` | React | JavaScript |
| `react-ts` | React | TypeScript |
| `vue` | Vue | JavaScript |
| `solid` | **SolidJS** | **JavaScript** ← on utilise celui-ci |
| `solid-ts` | SolidJS | TypeScript |
| `svelte` | Svelte | JavaScript |

> **Pourquoi pas TypeScript ?** TypeScript ajoute des types au JavaScript — c'est très bien en production, mais ça ajoute de la complexité. On reste en JS pour le cours.

Ouvrez http://localhost:5173 — vous devriez voir la page d'accueil Vite + Solid avec un compteur.

### Ce qui a été créé

```
mon-app/
├── index.html          ← point d'entrée (charge src/index.jsx)
├── package.json        ← dépendances et scripts
├── vite.config.js      ← configuration de Vite
└── src/
    ├── index.jsx       ← monte l'app dans le DOM
    ├── index.css       ← styles globaux
    ├── App.jsx         ← composant principal (c'est ici qu'on code)
    └── App.css         ← styles du composant App
```

### Comment ça marche ?

1. Le navigateur charge `index.html`
2. `index.html` contient `<script src="/src/index.jsx">` — charge votre JS
3. `src/index.jsx` importe `App.jsx` et le rend dans `<div id="root">`
4. Vite intercepte tout ça, transforme le JSX en JS, et sert le résultat

**Le rechargement à chaud (HMR)** : modifiez un fichier, sauvegardez → le navigateur se met à jour **instantanément**, sans recharger la page.

---

## 3 — SolidJS : les bases

### 3.1 — JSX : du HTML dans du JS

Un **composant** = une fonction qui retourne du HTML (en fait du JSX) :

```jsx
function App() {
    return (
        <div>
            <h1>Bonjour</h1>
            <p>Il est {new Date().toLocaleTimeString()}</p>
        </div>
    );
}
```

Les `{}` dans le JSX = du JavaScript. Tout ce qui est entre accolades est évalué :

```jsx
<p>2 + 2 = {2 + 2}</p>           // → "2 + 2 = 4"
<p>{"salut".toUpperCase()}</p>    // → "SALUT"
```

> **JSX ≠ HTML** : quelques différences — `class` s'écrit `class` en Solid (mais `className` en React), et `style` prend un objet.

### 3.2 — Les signaux : la réactivité

Un **signal** est une valeur qui, quand elle change, met à jour automatiquement tout ce qui l'utilise.

```jsx
import { createSignal } from "solid-js";

function Counter() {
    const [count, setCount] = createSignal(0);

    return (
        <div>
            <p>Compteur : {count()}</p>
            <button onClick={() => setCount(count() + 1)}>+1</button>
        </div>
    );
}
```

| Concept | Code |
|---------|------|
| Créer un signal | `const [val, setVal] = createSignal(valeurInitiale)` |
| Lire la valeur | `val()` ← c'est une **fonction**, pas oublier les `()` ! |
| Modifier la valeur | `setVal(nouvelleValeur)` |

> **Piège courant** : `count` au lieu de `count()`. En Solid, les signaux sont des fonctions — il faut les **appeler** pour lire leur valeur.

### 3.3 — Les événements

Comme en HTML, mais avec la syntaxe JSX :

```jsx
<button onClick={() => console.log("cliqué !")}>Cliquez</button>

<input onInput={(e) => setNom(e.target.value)} />
```

| HTML | JSX (Solid) |
|------|-------------|
| `onclick="..."` | `onClick={...}` |
| `oninput="..."` | `onInput={...}` |
| chaîne de texte | fonction JavaScript |

### 3.4 — Les boucles : `<For>`

Pour afficher une liste d'éléments :

```jsx
import { createSignal, For } from "solid-js";

function App() {
    const [fruits, setFruits] = createSignal(["🍎", "🍌", "🍊"]);

    return (
        <ul>
            <For each={fruits()}>
                {(fruit, i) => <li>{i() + 1}. {fruit}</li>}
            </For>
        </ul>
    );
}
```

> **Attention** : dans `<For>`, l'index `i` est un **signal** (une fonction). Il faut écrire `i()` et non `i`.

> **Pourquoi `<For>` et pas `.map()` ?** `<For>` est optimisé : quand un élément est ajouté au tableau, seul le nouvel élément est créé dans le DOM. Avec `.map()`, tout serait recréé.

### 3.5 — Le CSS

Deux façons d'ajouter du style :

```jsx
// 1. Importer un fichier CSS
import "./App.css";

// 2. Style inline (objet JS)
<div style={{ color: "red", "font-size": "20px" }}>Rouge</div>
```

> En JSX, `style` prend un **objet** `{{ }}` et non une chaîne. Les propriétés CSS avec des tirets (`font-size`) s'écrivent entre guillemets.

### 3.6 — Le box model : `border-box`

`box-sizing: border-box` est la première ligne de tout projet CSS sérieux.

👉 **Animation interactive** : [content-box vs border-box](https://claude.ai/public/artifacts/26e83c72-59e7-4a3a-af09-702de2d7cc03)

#### Le problème : `content-box` (par défaut)

Quand vous écrivez `width: 200px`, le navigateur applique cette taille **au contenu seul**. Le padding et la bordure s'ajoutent **en plus** :

```
                    width: 200px
              ◄──────────────────────►
         ┌────┬──────┬────────────────────┬──────┬────┐
         │ 2px│ 20px │      contenu       │ 20px │ 2px│
         │bord│ pad  │      200px         │ pad  │bord│
         └────┴──────┴────────────────────┴──────┴────┘
         ◄────────────────────────────────────────────►
                    Taille réelle : 244px 😱
```

Vous avez écrit `200px`, l'élément en fait **244**. Dès que vous ajoutez du padding ou une bordure, tous vos layouts cassent.

#### La solution : `border-box`

Avec `border-box`, la taille que vous écrivez est la **taille finale** — padding et bordure inclus. Le contenu rétrécit pour laisser la place :

```
                    width: 200px
              ◄──────────────────────►
         ┌────┬──────┬────────────┬──────┬────┐
         │ 2px│ 20px │  contenu   │ 20px │ 2px│
         │bord│ pad  │  156px     │ pad  │bord│
         └────┴──────┴────────────┴──────┴────┘
         ◄──────────────────────────────────►
                  Taille réelle : 200px ✅
```

#### Le reset universel

Tout projet CSS sérieux commence par :

```css
*, *::before, *::after {
    box-sizing: border-box;
}
```

Le `*` sélectionne **tous** les éléments. Cette règle rend toutes les tailles prévisibles.
---

## 4 — Récap

| Concept | Résumé |
|---------|--------|
| **Vite** | Outil de build — transforme JSX en JS, hot reload |
| **Composant** | Fonction qui retourne du JSX |
| **Signal** | Valeur réactive : `createSignal(init)` → `[getter, setter]` |
| **JSX** | HTML dans du JS — `{}` pour injecter du JS |
| **`<For>`** | Boucle optimisée pour les listes |
| **CSS** | `import "./style.css"` ou `style={{ ... }}` |

Le pattern qu'on va réutiliser tout le temps :

```
1. Créer un signal     →  const [val, setVal] = createSignal(défaut)
2. Créer un contrôle   →  <select onInput={e => setVal(e.target.value)}>
3. Brancher le style   →  style={{ "propriété": val() }}
```

---

## Ressources

- [SolidJS Tutorial](https://www.solidjs.com/tutorial/) — tutoriel interactif officiel (excellent)
- [SolidJS Documentation](https://docs.solidjs.com/)
- [Vite Documentation](https://vite.dev/guide/)
- [VITE.md](../VITE.md) — notre guide Vite
