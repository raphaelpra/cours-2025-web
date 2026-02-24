# TP — Flexbox Playground

> Construisez un outil interactif pour visualiser les propriétés CSS flexbox en temps réel, avec SolidJS.

À la fin de ce TP, vous aurez une app web où vous pouvez changer `flex-direction`, `justify-content`, `align-items`, etc. via des menus déroulants, et voir le résultat instantanément.

---

## Étape 0 — Créer le projet (~5 min)

### 0.1 — Scaffolding

ℹ️ Créez le projet dans votre dossier `perso/` pour éviter les conflits git :

```bash
cd 04-css-solidjs/perso
bun create vite flexbox-playground --template solid
cd flexbox-playground
bun install
bun dev
```

Ouvrez http://localhost:5173 — vous devriez voir la page d'accueil Vite + Solid.

### 0.2 — Nettoyer le template

On repart de zéro :

- **`src/App.jsx`** → un composant qui retourne juste `<h1>Flexbox Playground</h1>`
- **`src/App.css`** → videz tout
- **`src/index.css`** → un reset minimal :

```css
* {
    box-sizing: border-box;
}

body {
    font-family: system-ui, sans-serif;
    margin: 0;
    padding: 2rem;
    background: #1a1a2e;
    color: #eee;
}
```

Vérifiez que la page affiche juste "Flexbox Playground" sur fond sombre.

---

## Étape 1 — Les boîtes colorées (~10 min)

**Objectif** : afficher 5 boîtes colorées numérotées, alignées horizontalement dans un container.

### À faire

1. Déclarez un tableau de 5 couleurs en haut de `App.jsx`
2. Dans le JSX, mappez ce tableau pour créer des `<div>` avec chaque couleur en `background-color` (via `style={{ ... }}`)
3. Mettez le tout dans un `<div class="container">`

### CSS à écrire dans `App.css`

- `.container` : `display: flex`, une bordure en pointillés, un peu de padding, une hauteur minimum (~300px)
- `.box` : taille fixe (~80×80px), texte centré, coins arrondis

> **Indice** : pour centrer le texte dans les boîtes, les boîtes elles-mêmes peuvent être `display: flex` avec `align-items: center` et `justify-content: center`.

### Résultat attendu

5 boîtes colorées alignées horizontalement dans un container en pointillés.

---

## Étape 2 — Premier contrôle : `flex-direction` (~10 min)

**Objectif** : ajouter un `<select>` qui change le `flex-direction` du container en temps réel.

### Rappel du pattern (cf. cours)

```
1. Créer un signal     →  const [val, setVal] = createSignal(défaut)
2. Créer un contrôle   →  <select onInput={e => setVal(e.target.value)}>
3. Brancher le style   →  style={{ "propriété": val() }}
```

### À faire

1. Importez `createSignal` depuis `"solid-js"`
2. Créez un signal `direction` avec la valeur initiale `"row"`
3. Ajoutez un `<select>` avec les options : `row`, `column`, `row-reverse`, `column-reverse`
4. Branchez le signal sur le `style` du container

> **Rappel** : en Solid, on écoute `onInput` (pas `onChange`) sur les selects.

### Testez

Changez la valeur du select → les boîtes changent d'orientation instantanément.

---

## Étape 3 — `justify-content` et `align-items` (~15 min)

**Objectif** : même pattern que l'étape 2, pour deux nouvelles propriétés.

### À faire

1. Ajoutez un signal `justify` (défaut : `"flex-start"`) avec les options : `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`
2. Ajoutez un signal `align` (défaut : `"stretch"`) avec les options : `stretch`, `flex-start`, `center`, `flex-end`
3. Branchez les deux sur le `style` du container

### Testez

- `justify-content: center` → centrage horizontal
- `align-items: center` → centrage vertical
- Les deux ensemble → centrage parfait
- `space-between` + `column` → distribution verticale

---

## Étape 4 — `gap` et `flex-wrap` (~10 min)

**Objectif** : ajouter un contrôle pour `flex-wrap` (select) et pour `gap` (slider).

### À faire

1. Signal `wrap` (défaut : `"nowrap"`) → select avec `nowrap`, `wrap`, `wrap-reverse`
2. Signal `gap` (défaut : `0`) → `<input type="range">` de 0 à 40

> **Indice** : pour le slider, `parseInt(e.target.value)` convertit la valeur en nombre. Et `gap` attend une valeur avec unité : `` `${gap()}px` ``

Pensez à afficher la valeur actuelle du gap dans le label (ex: `gap: 12px`).

### Testez

- `flex-wrap: wrap` + augmentez le gap → les boîtes passent à la ligne
- Réduisez la fenêtre du navigateur → le wrap s'adapte

---

## Étape 5 — Ajouter et supprimer des boîtes (~15 min)

**Objectif** : rendre la liste de boîtes dynamique.

### À faire

1. Déclarez un tableau étendu de 8 couleurs (votre palette + quelques couleurs bonus)
2. Remplacez le tableau statique par un **signal** initialisé avec les 5 premières couleurs
3. Ajoutez un bouton "Ajouter" qui ajoute la couleur suivante (en bouclant sur le tableau)
4. Ajoutez un bouton "Supprimer" qui retire la dernière boîte (désactivé s'il ne reste qu'une boîte)

> **Indice** : pour modifier un tableau dans un signal, créez une copie : `setBoxes([...boxes(), nouvelleValeur])`

### Passer à `<For>`

Remplacez le `.map()` par le composant `<For>` de SolidJS (voir le cours, section 3.4).

> **Rappel** : dans `<For>`, l'index `i` est un signal → `i()`, pas `i`.

### Testez

- Ajoutez/supprimez des boîtes → le layout s'adapte
- Combinez avec `flex-wrap: wrap` et un gap

---

## Étape 6 — Afficher le CSS généré (~10 min)

**Objectif** : ajouter un bloc `<pre>` qui montre le CSS correspondant aux options sélectionnées, mis à jour en temps réel.

### À faire

1. Après le container, ajoutez un `<pre>` avec une template string qui utilise vos signaux :

```jsx
<pre class="css-output">
{`.container {
    display: flex;
    flex-direction: ${direction()};
    ...
}`}
</pre>
```

2. Stylisez `.css-output` : fond sombre, police monospace, couleur verte pour le look "code"

### Testez

Changez n'importe quel contrôle → le CSS en bas se met à jour. Vous pouvez copier-coller ce CSS dans vos propres projets.

---

## Récap

Vous avez construit une application interactive avec :

- **SolidJS** : signaux (`createSignal`), JSX, `<For>`, événements
- **CSS Flexbox** : `flex-direction`, `justify-content`, `align-items`, `flex-wrap`, `gap`
- **`box-sizing: border-box`** : taille prédictible

---

## Bonus

### Bonus 1 — Contrôles sur les items individuels

Ajoutez un clic sur chaque boîte pour modifier son `flex-grow` (cycle : 0 → 1 → 2 → 0).

Affichez la valeur de `flex-grow` sur la boîte quand elle est > 0.

> **Indice** : vous pouvez stocker un tableau de grows dans un signal. Pour modifier un élément, copiez le tableau, modifiez la copie, et re-settez le signal.

### Bonus 2 — `display` : block vs inline vs flex

Ajoutez un contrôle pour changer le `display` du container : `block`, `inline`, `inline-block`, `flex`, `grid`, `none`.

Observez comment les boîtes se comportent selon le `display` — c'est le concept le plus fondamental du CSS.
