# Cours interactif — Packages et package.json

> Ce cours est **interactif** : vous faites les commandes en même temps que le prof.

---

## 1 — Pourquoi des packages ?

En Python, vous utilisez `pip install` pour installer des bibliothèques depuis PyPI. En JavaScript, c'est pareil :

| Python | JavaScript (Bun) |
|--------|-------------------|
| `pip install requests` | `bun add axios` |
| PyPI (pypi.org) | npm (npmjs.com) |
| `import requests` | `import axios from "axios"` |
| `requirements.txt` | `package.json` |

Le registre npm contient **plus de 2 millions de packages**. Pour à peu près tout ce que vous voulez faire, quelqu'un a déjà écrit un package.

👉 Ouvrez [npmjs.com](https://www.npmjs.com/) et cherchez "lodash" pour voir à quoi ça ressemble.

---

## 2 — Créer un projet avec `bun init`

Jusqu'ici, vos fichiers JS étaient "en vrac". Un vrai projet JavaScript a un fichier `package.json` qui décrit le projet et ses dépendances.

### Étape par étape

👉 Dans votre terminal :

```bash
# Créer un nouveau dossier et y entrer
mkdir mon-projet-wiki
cd mon-projet-wiki

# Initialiser le projet
bun init
```

Bun vous pose quelques questions — appuyez Entrée pour accepter les valeurs par défaut.

👉 Regardez ce qui a été créé :

```bash
ls -la
```

Vous devriez voir :
```
.gitignore
index.ts
package.json
README.md
tsconfig.json
```

### Comprendre package.json

👉 Ouvrez `package.json` :

```json
{
  "name": "mon-projet-wiki",
  "module": "index.ts",
  "type": "module",
  "devDependencies": {
    "@types/bun": "latest"
  },
  "peerDependencies": {
    "typescript": "^5.0.0"
  }
}
```

| Champ | Rôle |
|-------|------|
| `name` | Nom du projet |
| `module` | Fichier principal (point d'entrée) |
| `type` | `"module"` = on utilise `import`/`export` (ES modules) |
| `devDependencies` | Packages utiles pendant le développement uniquement |

### Copier votre TP Wikipedia

👉 Copiez votre `wiki.js` du TP dans ce dossier :

```bash
# Adaptez le chemin selon votre situation
cp ../wiki.js ./index.js
```

On renomme en `index.js` car c'est la convention pour le fichier principal d'un projet.

👉 Supprimez `index.ts` (on travaille en JS, pas en TypeScript) :

```bash
rm index.ts
```

👉 Modifiez `package.json` — changez le champ `module` :

```json
"module": "index.js"
```

👉 Testez que tout marche :

```bash
bun run index.js Paris
```

---

## 3 — Installer un package : lodash

[lodash](https://lodash.com/) est la bibliothèque utilitaire la plus populaire de JavaScript. Elle fournit des centaines de fonctions pour manipuler des tableaux, objets, chaînes de caractères, etc.

### Installation

👉 Installez lodash :

```bash
bun add lodash
```

👉 Observez ce qui a changé :

```bash
cat package.json
```

Une nouvelle section `dependencies` est apparue :
```json
"dependencies": {
  "lodash": "^4.17.21"
}
```

Un dossier `node_modules/` a été créé (c'est là que le code du package est téléchargé) et un fichier `bun.lock` (qui verrouille les versions exactes).

> **`node_modules/`** c'est comme le `site-packages/` de Python : le dossier où vivent les packages installés. On ne le met **jamais** dans git (il est régénéré par `bun install`).

### Utilisation

👉 Créez un fichier `essai-lodash.js` :

```javascript
import _ from "lodash";

// capitalize : première lettre en majuscule
console.log(_.capitalize("bonjour le monde"));
// → "Bonjour le monde"

// truncate : couper un texte trop long
const texte = "Ceci est un texte beaucoup trop long pour être affiché en entier dans la console";
console.log(_.truncate(texte, { length: 40 }));
// → "Ceci est un texte beaucoup trop long..."

// chunk : découper un tableau en morceaux
const nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(_.chunk(nombres, 3));
// → [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]

// shuffle : mélanger un tableau
console.log(_.shuffle(["a", "b", "c", "d", "e"]));
// → ordre aléatoire

// uniq : supprimer les doublons
console.log(_.uniq([1, 2, 2, 3, 3, 3]));
// → [1, 2, 3]

// groupBy : regrouper par critère
const mots = ["chat", "chien", "car", "cerise", "dé", "dos"];
console.log(_.groupBy(mots, mot => mot[0]));
// → { c: ["chat", "chien", "car", "cerise"], d: ["dé", "dos"] }
```

👉 Testez :

```bash
bun run essai-lodash.js
```

### Pourquoi `_` ?

Le nom "lodash" vient de "lo-dash" = **low dash** = underscore (`_`). Par convention, on importe toute la bibliothèque dans une variable `_` et on appelle `_.groupBy()`, `_.chunk()`, etc.

C'est pratique pour découvrir la lib, mais ça pose un problème : **on importe TOUT lodash** (des centaines de fonctions) même si on n'en utilise que 2 ou 3. Le bundle final de votre application sera plus gros que nécessaire.

### La bonne pratique : imports ciblés

Plutôt que d'importer toute la bibliothèque, importez **uniquement les fonctions dont vous avez besoin** :

```javascript
// ❌ Importe TOUT lodash (~600 fonctions)
import _ from "lodash";
_.groupBy(mots, mot => mot[0]);

// ✅ Importe UNIQUEMENT groupBy
import groupBy from "lodash/groupBy";
groupBy(mots, mot => mot[0]);
```

Chaque fonction de lodash est disponible en import individuel via `lodash/nomDeLaFonction` :

```javascript
import capitalize from "lodash/capitalize";
import truncate from "lodash/truncate";
import chunk from "lodash/chunk";

console.log(capitalize("bonjour"));        // → "Bonjour"
console.log(chunk([1, 2, 3, 4, 5], 2));   // → [[1, 2], [3, 4], [5]]
```

> **Règle** : utilisez `import _ from "lodash"` pour **explorer** la lib (TP, tests). Pour du vrai code, préférez les imports ciblés `import fn from "lodash/fn"`.

### Intégrer lodash dans votre wiki.js

👉 Modifiez votre `wiki.js` pour améliorer l'affichage avec des imports ciblés :

```javascript
import capitalize from "lodash/capitalize";
import truncate from "lodash/truncate";

// ... votre code existant ...

// Formater le titre
console.log(capitalize(article.title));

// Limiter le résumé
console.log(truncate(article.extract, { length: 200 }));
```

📖 Documentation complète : [lodash.com/docs](https://lodash.com/docs)

---

## 4 — Installer un 2e package : date-fns

[date-fns](https://date-fns.org/) est une bibliothèque pour manipuler les dates. C'est l'équivalent JS de `datetime` en Python, en plus pratique.

### Installation

👉 Installez :

```bash
bun add date-fns
```

👉 Vérifiez `package.json` — vous avez maintenant 2 dépendances :

```json
"dependencies": {
  "date-fns": "^4.1.0",
  "lodash": "^4.17.21"
}
```

### Utilisation

👉 Créez un fichier `essai-dates.js` :

```javascript
import { format, formatDistanceToNow, isWeekend, addDays } from "date-fns";
import { fr } from "date-fns/locale";

const now = new Date();

// Formater une date en français
console.log(format(now, "EEEE d MMMM yyyy, HH:mm", { locale: fr }));
// → "vendredi 20 février 2026, 15:30"

// "Il y a combien de temps ?"
const datePassee = new Date("2025-01-01");
console.log(formatDistanceToNow(datePassee, { locale: fr, addSuffix: true }));
// → "il y a environ 1 an"

// Est-ce le week-end ?
console.log(`Aujourd'hui c'est le week-end : ${isWeekend(now)}`);

// Dans 30 jours
const future = addDays(now, 30);
console.log(`Dans 30 jours : ${format(future, "d MMMM yyyy", { locale: fr })}`);
```

👉 Testez :

```bash
bun run essai-dates.js
```

### Intégrer dans votre wiki.js

L'API Wikipedia renvoie un champ `timestamp` pour chaque article (date de dernière modification). Utilisez `date-fns` pour l'afficher :

```javascript
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

// ... après avoir récupéré l'article ...
if (article.timestamp) {
    const lastEdit = new Date(article.timestamp);
    const ago = formatDistanceToNow(lastEdit, { locale: fr, addSuffix: true });
    console.log(`Dernière modification : ${ago}`);
}
```

---

## 5 — Les scripts dans package.json

Le champ `"scripts"` de `package.json` permet de définir des raccourcis pour vos commandes.

👉 Ajoutez cette section dans votre `package.json` :

```json
{
  "name": "mon-projet-wiki",
  "module": "index.js",
  "type": "module",
  "scripts": {
    "start": "bun run index.js",
    "random": "bun run index.js --random",
    "test": "echo 'Pas de tests pour le moment'"
  },
  "dependencies": {
    "date-fns": "^4.1.0",
    "lodash": "^4.17.21"
  }
}
```

👉 Maintenant, au lieu de taper `bun run index.js`, vous pouvez faire :

```bash
bun run start
# raccourci encore plus court :
bun start
```

> **`bun run <script>`** exécute la commande définie dans `scripts`. `bun start` est un raccourci spécial pour `bun run start`.

### Conventions courantes

| Script | Usage habituel |
|--------|---------------|
| `start` | Lancer le programme principal |
| `dev` | Lancer en mode développement (avec hot reload) |
| `build` | Compiler/construire le projet |
| `test` | Lancer les tests |
| `lint` | Vérifier le style du code |

C'est comme un `Makefile` ou des alias shell — des raccourcis pour ne pas retaper les mêmes commandes.

---

## 6 — Partager son projet

Quand vous travaillez en équipe (ou que vous partagez du code sur GitHub), il y a une règle d'or :

### Ne JAMAIS commit `node_modules/`

Le dossier `node_modules/` peut peser des centaines de Mo. Il est **régénéré** à partir de `package.json` :

```bash
# Quelqu'un clone votre projet :
git clone <url>
cd mon-projet-wiki

# Il installe les dépendances :
bun install

# → node_modules/ est recréé automatiquement !
```

👉 Vérifiez que `.gitignore` contient `node_modules/` (normalement `bun init` l'a ajouté).

### Ce qu'on commit vs ce qu'on ignore

| Fichier | Git ? | Pourquoi |
|---------|-------|----------|
| `package.json` | ✅ oui | Décrit le projet et ses dépendances |
| `bun.lock` | ✅ oui | Verrouille les versions exactes |
| `index.js`, `wiki.js`... | ✅ oui | Votre code |
| `node_modules/` | ❌ non | Trop gros, régénéré par `bun install` |

> **`package.json`** = la recette. **`node_modules/`** = les ingrédients. On partage la recette, pas les ingrédients.

---

## ⚠️ Les pièges des packages

Les packages c'est puissant, mais ce n'est pas gratuit. Trois dangers à connaître.

### 1. Le poids — `node_modules`, le trou noir

Il y a un meme célèbre chez les développeurs :

> **Les objets les plus lourds de l'univers** : le Soleil → une étoile à neutrons → un trou noir → `node_modules/`

![Heaviest objects in the universe meme](node_modules_meme.png)

Ce n'est qu'à moitié une blague. Chaque package que vous installez embarque ses propres dépendances, qui elles-mêmes ont des dépendances, etc. Un simple `bun add lodash` ajoute 1 package. Mais un framework comme Next.js peut installer **plus de 300 packages** dans `node_modules/`.

👉 Testez avec votre projet :

```bash
# Combien de packages dans node_modules ?
ls node_modules | wc -l

# Combien d'espace ça prend ?
du -sh node_modules
```

**Règle** : chaque `bun add` a un coût. Demandez-vous toujours : "Est-ce que j'ai vraiment besoin de ce package, ou est-ce que je peux écrire ces 5 lignes moi-même ?"

### 2. La sécurité — des packages vérolés

C'est le risque le plus sérieux. Quand vous faites `bun add un-package`, vous exécutez du code écrit par un inconnu sur Internet. Si ce code est malveillant, il a accès à votre machine.

**Ce n'est pas théorique.** En septembre 2025, l'attaque ["Shai-Hulud"](https://jfrog.com/blog/new-compromised-packages-in-largest-npm-attack-in-history/) a compromis plus de 500 packages npm, dont des bibliothèques massivement utilisées comme **chalk** et **debug** (des milliards de téléchargements combinés). Le malware volait les tokens GitHub, les clés API AWS/Google Cloud, et les wallets crypto des développeurs.

Quelques attaques récentes sur npm :

| Date | Attaque | Impact |
|------|---------|--------|
| Août 2025 | [S1ngularity](https://securitylabs.datadoghq.com/articles/learnings-from-recent-npm-compromises/) | Packages Nx compromis via un token npm volé |
| Sept 2025 | [Shai-Hulud](https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem) | 500+ packages infectés, alerte CISA officielle |
| Nov 2025 | [Shai-Hulud 2.0](https://jfrog.com/blog/shai-hulud-npm-supply-chain-attack-new-compromised-packages-detected/) | Vague 2, 796 nouveaux packages malveillants |

**Bonnes pratiques** :
- Vérifiez le nombre de téléchargements et l'activité du package sur [npmjs.com](https://www.npmjs.com/) avant d'installer
- Préférez les packages maintenus par des organisations connues
- Méfiez-vous des packages au nom très similaire à un package populaire (*typosquatting* : `loadsh` au lieu de `lodash`)
- Faites `bun install` uniquement sur des projets de confiance

### 3. La dette technique — des packages inutiles

Certains packages font des choses que JavaScript sait déjà faire nativement. Le cas d'école :

- **[is-odd](https://www.npmjs.com/package/is-odd)** (250 000+ téléchargements/semaine) — vérifie si un nombre est impair
- **[is-even](https://www.npmjs.com/package/is-even)** (93 000+ téléchargements/semaine) — importe `is-odd` et retourne l'inverse
- **[is-number](https://www.npmjs.com/package/is-number)** (66 000 000+ téléchargements/semaine) — vérifie si une valeur est un nombre
- **[upper-case](https://www.npmjs.com/package/upper-case)** (27 000 000+ téléchargements/semaine) — met une chaîne en majuscules

Tout ça se fait en une ligne de JavaScript natif :

```javascript
// Pas besoin de package pour ça...
const isOdd = n => n % 2 !== 0;
const isEven = n => n % 2 === 0;
const isNumber = n => typeof n === "number" && Number.isFinite(n);
const upperCase = s => s.toUpperCase();
```

Chaque package ajouté est :
- du code que vous ne contrôlez pas
- une dépendance à maintenir à jour
- une surface d'attaque supplémentaire (cf. point 2)

> **Règle d'or** : avant d'installer un package, regardez son code source. S'il fait moins de 20 lignes, écrivez-le vous-même.

---

## Récap

| Commande | Description |
|----------|-------------|
| `bun init` | Créer un nouveau projet (génère `package.json`) |
| `bun add <pkg>` | Installer un package et l'ajouter à `package.json` |
| `bun add -d <pkg>` | Installer en dépendance de développement |
| `bun install` | Installer toutes les dépendances de `package.json` |
| `bun remove <pkg>` | Désinstaller un package |
| `bun run <script>` | Exécuter un script défini dans `package.json` |

### Structure finale du projet

```
mon-projet-wiki/
├── .gitignore
├── package.json          ← décrit le projet
├── bun.lock              ← versions exactes des packages
├── node_modules/         ← packages installés (PAS dans git)
├── index.js              ← votre code principal (wiki.js amélioré)
├── essai-lodash.js       ← exercices lodash
└── essai-dates.js        ← exercices date-fns
```
