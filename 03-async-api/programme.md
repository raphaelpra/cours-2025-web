# Cours 03 — Async, API, Modules & Packages

**Date :** vendredi 20 février 2026

---

## Objectifs

- Comprendre l'asynchronisme en JS : event loop, promises, async/await
- Savoir utiliser `fetch()` pour appeler une API depuis Bun
- Comprendre ce qu'est une API REST et le format JSON
- Maîtriser les modules ES (`import` / `export`)
- Savoir créer un projet JS avec `bun init` et `package.json`
- Installer et utiliser des packages npm (lodash, date-fns)

---

## Déroulé (~3h)

1. Appel / rappel du cours précédent
2. Cours : l'asynchronisme en JavaScript (visualisations interactives)
3. TP : Explorateur Wikipedia (fetch + async/await en pratique)
4. *Pause*
5. Cours : les modules ES (import/export)
6. Cours interactif : packages et package.json

---

### 1. Rappel (~5 min)

Rappel rapide du cours 02 :
- JavaScript = langage complet (pas juste pour les pages web)
- Bun = runtime JS (comme Python, mais pour JS)
- Variables, fonctions, objets, classes
- On n'a pas eu le temps de voir : async, modules, le TD Pedantle

---

### 2. L'asynchronisme en JavaScript (~40 min)

> Cours magistral avec des visualisations interactives.

#### Préparer les démos

```bash
cd 03-async-api/demos
bun install       # installe React (une seule fois)
bun run build     # compile les visualisations
bun index.html    # lance le serveur de dev
```

Ouvrir http://localhost:3000 — les 4 visualisations sont accessibles par onglets.

#### Déroulé des démos

**Onglet 1 — Event Loop** (~10 min)
- Code : `console.log` + `setTimeout` + `console.log`
- Montrer pas à pas : Call Stack, Web APIs, Callback Queue, Event Loop
- Message clé : le code synchrone passe toujours en premier

**Onglet 2 — Promises (les fondamentaux)** (~10 min)
- 5 scénarios : anatomie, resolve(valeur), reject(erreur), promisifier, résumé des 3 états
- Montrer : new Promise(), resolve → .then(), reject → .catch()
- Message clé : une Promise = commande au restaurant (pending → fulfilled | rejected)

**Onglet 3 — Chaînage de Promises** (~10 min)
- 4 scénarios : chaîne simple, Promise dans .then(), .catch(), .catch() → .then()
- Montrer comment les .then() forment une chaîne de dépendances
- Montrer .catch() comme filet de sécurité

**Onglet 4 — async/await** (~10 min)
- 5 scénarios : bases, séquentiel, try/catch, parallèle, piège
- Message clé : async/await = sucre syntaxique sur les Promises
- `.then(val => ...)` ≡ `const val = await ...`
- `.catch(err => ...)` ≡ `try { } catch(err) { }`

---

### 3. TP — Explorateur Wikipedia (~1h10)

> Les élèves codent. Le prof circule et aide.

📄 Énoncé : [tp-wikipedia.md](tp-wikipedia.md)

Points clés à souligner avant de les lancer :
- **C'est quoi une API** — analogie du restaurant (menu → commande → plat)
- **JSON** c'est comme un dictionnaire Python
- **fetch()** marche aussi bien dans Bun que dans le navigateur
- Les étapes sont progressives : commencez par l'étape 1, avancez à votre rythme

Objectif minimum : étape 2 (recherche + résumé).
Les rapides font l'étape 3 (Promise.all) et les bonus.

---

### *Pause* (~15 min)

---

### 4. Les modules ES (~15 min)

> Cours magistral + démos exécutées en live.

On reprend les démos du cours précédent qu'on n'a pas eu le temps de voir :

```bash
cd 03-async-api/cours
bun run 10-modules.js
```

Le fichier `10-modules.js` montre progressivement (décommenter section par section) :

1. **Import nommé** : `import { addition, PI } from "./utils.js"` (~3 min)
   - Montrer `utils.js` : chaque `export` rend une variable importable
   - Analogie Python : `from math import sqrt`

2. **Export default** : `import saluer from "./saluer.js"` (~3 min)
   - Un seul export principal par fichier, pas de `{ }`
   - On peut renommer librement à l'import

3. **Renommer** : `import { addition as add } from "./utils.js"` (~2 min)

4. **Import * (tout)** : `import * as utils from "./utils.js"` (~2 min)

5. **Packages npm** : `import express from "express"` (~5 min)
   - Fichier local → `"./fichier.js"` (avec `./`)
   - Package npm → `"nom-du-package"` (sans `./`)
   - Transition vers la section suivante

---

### 5. Cours interactif — Packages et package.json (~45 min)

> Les élèves font les commandes en même temps que le prof.

📄 Support : [cours-packages.md](cours-packages.md)

Les élèves suivent le document étape par étape :

1. **Créer un projet** (`bun init`) (~10 min)
   - Créer `mon-projet-wiki/`
   - `bun init`, explorer `package.json`
   - Copier leur `wiki.js` du TP → `index.js`

2. **lodash** (`bun add lodash`) (~15 min)
   - Observer les changements : `dependencies`, `node_modules/`, `bun.lock`
   - Tester : `_.capitalize()`, `_.truncate()`, `_.chunk()`, `_.shuffle()`
   - Intégrer dans leur wiki.js

3. **date-fns** (`bun add date-fns`) (~10 min)
   - Formater des dates en français
   - `formatDistanceToNow()` → "il y a 3 jours"
   - Intégrer (timestamp de l'article Wikipedia)

4. **Scripts** (`"scripts"` dans package.json) (~5 min)
   - Ajouter `"start"`, `"random"`
   - `bun run start` = raccourci

5. **Partager** (`.gitignore` + `bun install`) (~5 min)
   - Ne JAMAIS commit `node_modules/`
   - `package.json` = recette, `node_modules/` = ingrédients

---

## Fichiers de la séance

| Fichier | Description |
|---------|-------------|
| `programme.md` | Ce document |
| `demos/` | Visualisations interactives de l'asynchronisme |
| `tp-wikipedia.md` | Énoncé du TP Wikipedia |
| `cours/10-modules.js` | Démo modules ES (import/export) |
| `cours/utils.js` | Module utilitaire pour la démo |
| `cours/saluer.js` | Module avec export default |
| `cours-packages.md` | Cours interactif package.json |

---

## Pour la prochaine fois

- [ ] Terminer le TP Wikipedia si pas fini (au minimum jusqu'à l'étape 2)
- [ ] Lire [L'asynchronisme en JS](https://frontend.info-mines.paris/async-nb/) — reprend les concepts vus en cours
- [ ] Faire [Flexbox Froggy](https://flexboxfroggy.com/#fr) — les 24 niveaux (jeu pour apprendre flexbox)
- [ ] *(optionnel)* [Grid Garden](https://cssgridgarden.com/#fr) — même principe pour CSS Grid
- [ ] *(optionnel)* Étape 3 (Promise.all) + bonus du TP
- [ ] *(optionnel)* Explorer d'autres packages sur [npmjs.com](https://www.npmjs.com/)
