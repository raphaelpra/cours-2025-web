# Cours 04 — CSS & SolidJS

**Date :** mardi 24 février 2026

---

## Objectifs

- Comprendre le lien entre `bun add` et `import` (packages npm)
- Découvrir pourquoi on utilise un framework frontend
- Savoir créer un projet SolidJS avec Vite
- Maîtriser les bases de SolidJS : composants, signaux, JSX
- Comprendre le box model CSS et `box-sizing: border-box`
- Maîtriser les propriétés CSS flexbox en pratique

---

## Déroulé (~3h)

1. Appel / rappel du cours précédent
2. Fin du cours sur les imports : le lien `bun add` → `import`
3. Pourquoi un framework ? (démo vanilla vs JSX)
4. SolidJS — le minimum vital (live coding)
5. Flexbox Froggy (les élèves jouent)
6. *Pause*
7. TP : construire un Flexbox Playground en Solid
8. Récap

---

### 1. Rappel (~5 min)

Rappel rapide du cours 03 :
- async/await, fetch, API Wikipedia
- `import` / `export` — fichiers locaux avec `./`
- On a vu `import chalk from "chalk"` — mais d'où ça vient ?

Qui a fini le TP Wikipedia ? Qui a fait Flexbox Froggy ?

---

### 2. Fin import : `bun add` → `import` (~10 min)

> Démo exécutée en live.

```bash
cd 04-css-solidjs/demos
bun add chalk
bun run import-package.js
```

📄 Fichier : [demos/import-package.js](demos/import-package.js)

Points clés :
- `bun add chalk` → télécharge dans `node_modules/`, ajoute dans `package.json`
- `import chalk from "chalk"` → JS va chercher dans `node_modules/`
- **Règle** : `"./fichier.js"` = fichier local, `"nom"` = package npm
- Montrer `ls node_modules/chalk` pour démystifier

📖 Guide : [VITE.md](../VITE.md)

---

### 3. Pourquoi un framework ? (~10 min)

> Démo en live dans le navigateur.

```bash
bun demos/vanilla.html
```

📄 Fichier : [demos/vanilla.html](demos/vanilla.html)

Ouvrir http://localhost:3000 et montrer :
- ~70 lignes de JS pour une simple liste de courses
- `createElement`, `appendChild`, `addEventListener` partout
- Chaque modification du DOM = du code impératif

**Message clé** : "Et si on pouvait juste écrire du HTML dans du JS, et que les mises à jour se fassent toutes seules ?"

Panorama rapide (30s) : React, Vue, Svelte, **Solid**. On prend Solid — le plus simple, le plus rapide, même syntaxe que React.

---

### 4. SolidJS — le minimum vital (~30 min)
>
> ℹ️ Les élèves créent leur projet dans `04-css-solidjs/perso/` pour éviter les conflits git.

📖 Support : [cours.md](cours.md)

Déroulé :
1. **Pourquoi un framework ?** — montrer `demos/vanilla.html`, comparer avec du JSX (~5 min)
2. **Setup Vite + Solid** — `bun create vite` depuis `perso/` (~5 min)
3. **JSX** — composant = fonction qui retourne du HTML (~5 min)
4. **Signaux** — `createSignal`, lire avec `()`, modifier avec setter (~8 min)
5. **Événements** — `onClick`, `onInput` (~5 min)
6. **`<For>`** — boucle optimisée pour les listes (~5 min)
7. **CSS** — `import "./App.css"`, `style={{ }}` (~2 min)
---

### 5. Flexbox Froggy (~20 min)

> Les élèves jouent. Le prof circule.

👉 https://flexboxfroggy.com/#fr

- 15 min de jeu — aller le plus loin possible
- 5 min de debrief collectif :
  - Quelles propriétés avez-vous utilisées ?
  - Lister au tableau : `justify-content`, `align-items`, `flex-direction`, `flex-wrap`, `gap`
  - "Maintenant on va construire notre propre Froggy, en Solid"

---

### *Pause* (~15 min)

---

### 6. TP — Flexbox Playground (~1h15)

> Les élèves construisent. Le prof code les premières étapes au tableau, puis les élèves avancent.

📄 Énoncé : [tp-flexbox-playground.md](tp-flexbox-playground.md)

#### Progression :

| Étape | Contenu | Durée |
|-------|---------|-------|
| 0 | Créer le projet, nettoyer le template | ~5 min |
| 1 | Boîtes colorées + CSS container | ~10 min |
| 2 | Premier contrôle : `flex-direction` (signal + select) | ~10 min |
| 3 | `justify-content` et `align-items` (même pattern) | ~15 min |
| 4 | `gap` (range slider) et `flex-wrap` | ~10 min |
| 5 | Ajouter/supprimer des boîtes (`<For>`) | ~15 min |
| 6 | Afficher le CSS généré | ~10 min |
| Bonus | Contrôles sur les items (flex-grow), display | Les rapides |

**Étapes 0-2** : le prof fait en live, les élèves suivent.
**Étapes 3-6** : les élèves avancent à leur rythme (le pattern est répétitif).
**Bonus** : pour ceux qui finissent en avance.

---

### 7. Récap (~5 min)

- `bun add` → `node_modules/` → `import "nom"`
- SolidJS : composants (fonctions), signaux (réactivité), JSX (HTML dans JS)
- CSS : `box-sizing: border-box` toujours, flexbox pour le layout
- Le pattern : signal → contrôle → style

---

## Fichiers de la séance

| Fichier | Description |
|---------|-------------|
| `programme.md` | Ce document |
| `cours.md` | Cours interactif Vite + SolidJS (support élèves) |
| `demos/import-package.js` | Démo du lien `bun add` → `import` |
| `demos/vanilla.html` | Démo "douleur" du DOM vanilla |
| `tp-flexbox-playground.md` | Énoncé du TP Flexbox Playground |
| `correction-App.jsx` | Correction — composant principal |
| `correction-App.css` | Correction — styles |
| `correction-index.css` | Correction — styles globaux |

---

## Pour la prochaine fois

- [ ] Terminer le TP Flexbox Playground si pas fini (au minimum jusqu'à l'étape 4)
- [ ] Faire les bonus du TP si pas faits en cours
- [ ] Lire [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) — la référence
- [ ] *(optionnel)* [SolidJS Tutorial](https://www.solidjs.com/tutorial/) — tutoriel interactif officiel
- [ ] *(optionnel)* [Grid Garden](https://cssgridgarden.com/#fr) — même principe que Froggy pour CSS Grid
