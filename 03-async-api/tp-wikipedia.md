# TP — Explorateur Wikipedia

Ce TP vous apprend à utiliser une **API** pour récupérer des données réelles depuis Wikipedia. Vous allez construire un outil en ligne de commande capable de rechercher des articles et d'en afficher le résumé.

**Concepts pratiqués :**
- `fetch()` et `async`/`await`
- Lecture de JSON
- Requêtes en parallèle (`Promise.all`)
- Arguments CLI (`process.argv`) et entrée utilisateur (`prompt`)

---

## Étape 0 — C'est quoi une API ?

Une **API** (Application Programming Interface) permet à un programme de communiquer avec un autre programme. Sur le web, les API fonctionnent via **HTTP** — le même protocole que quand vous tapez une URL dans votre navigateur.

| Restaurant | API Web |
|------------|---------|
| Le **menu** liste les plats disponibles | La **documentation** liste les requêtes possibles |
| Vous passez une **commande** au serveur | Vous envoyez une **requête HTTP** à une URL |
| La **cuisine** prépare votre plat | Le **serveur** traite votre requête |
| On vous apporte le **plat** | Vous recevez une **réponse JSON** |

> **Concrètement** : au lieu d'appeler `maFonction(arg)` dans votre fichier, vous appelez `fetch("https://serveur.com/endpoint/arg")` et la "fonction" s'exécute sur un autre ordinateur.

Les API répondent en **JSON** (JavaScript Object Notation) — un format texte structuré. Avec `fetch()`, la méthode `.json()` parse automatiquement ce texte en objet JavaScript.

### L'API Wikipedia

Nous allons utiliser l'API officielle de Wikipedia — gratuite, sans inscription.

📖 Documentation : [https://fr.wikipedia.org/api/rest_v1/](https://fr.wikipedia.org/api/rest_v1/)

Testez dans votre navigateur — collez cette URL :
```
https://fr.wikipedia.org/api/rest_v1/page/summary/Paris
```

Vous voyez du JSON ? C'est exactement ce que `fetch()` va récupérer dans votre code.

---

## Étape 1 — Fetch, await et arguments

### Premier fetch

Créez un fichier `wiki.js`. On va récupérer le résumé de l'article Wikipedia sur Paris.

```javascript
// wiki.js — notre premier appel API !

const url = "https://fr.wikipedia.org/api/rest_v1/page/summary/Paris";

// fetch() envoie une requête HTTP et retourne une Promise
// .then() s'exécute quand la Promise est résolue (= quand le serveur répond)
fetch(url)
    .then(response => response.json())  // parse le JSON en objet JS
    .then(data => {
        console.log("Titre :", data.title);
        console.log("Description :", data.description);
        console.log();
        console.log("Résumé :", data.extract);
    });
```

```bash
bun run wiki.js
```

> Ajoutez `console.log(data)` pour voir TOUT ce que l'API renvoie : `title`, `extract`, `description`, `thumbnail`, `content_urls`…

### À vous : réécrire avec `await`

Les `.then()` en chaîne, c'est vite pénible. Réécrivez le même code avec `await` — ça devrait ressembler à du code synchrone classique.

> 💡 `await` fonctionne directement à la racine du fichier dans Bun (top-level await).

### Rendre le script dynamique

On veut maintenant passer le sujet en argument : `bun run wiki.js Lyon`.

En JavaScript (comme `sys.argv` en Python), on accède aux arguments via `process.argv`. Les 2 premiers éléments sont le chemin de bun et le fichier — votre argument commence à l'index 2.

Complétez le squelette :

```javascript
// wiki.js — version dynamique

const subject = process.argv[???];  // quel index ?

// TODO : si pas de sujet, afficher un message d'usage et quitter
// 💡 process.exit(1) pour terminer le programme

const url = `https://fr.wikipedia.org/api/rest_v1/page/summary/${subject}`;
const response = await fetch(url);

// TODO : gérer le cas où l'article n'existe pas
// 💡 Quel code HTTP renvoie l'API pour un article inexistant ?
//    Testez dans le navigateur, puis utilisez response.status

const data = await response.json();

// TODO : afficher titre, description et résumé
```

**Question** : testez `bun run wiki.js "Tour Eiffel"` (avec guillemets) et `bun run wiki.js Tour Eiffel` (sans). Quelle différence ? Pourquoi ?

Vérifiez :
```bash
bun run wiki.js Lyon
bun run wiki.js "Tour Eiffel"
bun run wiki.js xyzabc123      # → message d'erreur propre
```

---

## Étape 3 — Rechercher sur Wikipedia

Le problème : l'utilisateur ne connaît pas toujours le titre exact. "jeux olympiques" ne marchera pas car l'article s'appelle "Jeux olympiques" (avec la bonne casse). Il nous faut une **recherche**.

Wikipedia propose un endpoint de recherche ("opensearch"). Testez dans votre navigateur :
```
https://fr.wikipedia.org/w/api.php?action=opensearch&search=jeux olympiques&limit=5&format=json
```

### Questions avant de coder

1. Observez la réponse dans le navigateur. Quel est le **format** de la réponse ? (un objet ? un tableau ? un tableau de tableaux ?)
2. À quel **index** se trouvent les titres des articles ?
3. L'URL contient des espaces (`jeux olympiques`). Pourquoi ça marche dans le navigateur mais pas forcément en JavaScript ? Cherchez ce que fait `encodeURIComponent()`.

### À vous

Créez une fonction `async function searchWiki(term)` qui :
- Construit l'URL de recherche avec le terme donné
- Fait un `fetch` et parse le JSON
- Retourne le tableau de titres (ou `null` si aucun résultat)
- Affiche les résultats numérotés (1, 2, 3…)

```javascript
async function searchWiki(term) {
    const url = `https://fr.wikipedia.org/w/api.php?action=opensearch&search=${???}&limit=5&format=json`;

    // TODO : fetch + parse JSON

    // TODO : extraire les titres depuis la réponse
    //        (indice : la réponse est un tableau, les titres sont à l'index ?)

    // TODO : si aucun résultat, afficher un message et retourner null

    // TODO : afficher les résultats numérotés
    // 💡 .forEach((element, index) => { ... }) donne l'élément ET son index

    // TODO : retourner les titres
}

// Testez :
const results = await searchWiki("jeux olympiques");
console.log("\nTitres reçus :", results);
```

> **`encodeURIComponent()`** transforme les espaces et caractères spéciaux pour les URL. `"Tour Eiffel"` → `"Tour%20Eiffel"`. Sans ça, l'URL serait invalide.

---

## Étape 4 — Combiner : recherche + résumé

Maintenant assemblons le tout dans un programme complet. Voici le plan :

1. L'utilisateur lance le script avec un mot clé
2. Le script **cherche** et affiche les résultats
3. L'utilisateur **choisit** un numéro
4. Le script affiche le **résumé** de l'article choisi

### Question de conception

Avant de coder, réfléchissez à la structure : de quelles **fonctions** avez-vous besoin ? Quels sont leurs paramètres et retours ?

> 💡 Vous avez déjà `searchWiki(term)` de l'étape 3. Il vous manque une fonction pour récupérer le résumé d'un article à partir de son titre.

### À vous

Créez une fonction `getSummary(title)` qui récupère le résumé d'un article via l'API `/page/summary/` (celle de l'étape 1), puis assemblez le programme principal :

```javascript
// wiki.js — version complète

// --- Fonctions ---

// Votre searchWiki de l'étape 3

async function getSummary(title) {
    // TODO : construire l'URL (même API que l'étape 1, mais avec le titre en paramètre)
    // 💡 N'oubliez pas encodeURIComponent() sur le titre !

    // TODO : fetch + vérifier que la réponse est ok (response.ok)
    //        Si erreur, afficher le code HTTP et retourner null

    // TODO : parser et retourner le JSON
}

// --- Programme principal ---

// TODO : récupérer le mot clé depuis process.argv

// 1. Rechercher avec searchWiki()
// 2. Afficher les résultats numérotés
// 3. Demander le choix de l'utilisateur
//    💡 prompt() fonctionne dans Bun ! Il affiche un message et attend une saisie.
//    💡 prompt() retourne une string → pensez à parseInt()
// 4. Récupérer et afficher le résumé de l'article choisi
```

### Indices (ouvrez seulement si bloqué)

<details>
<summary>Indice 1 — Demander un choix à l'utilisateur</summary>

```javascript
const choice = prompt("\nVotre choix (1-5) :");
const index = parseInt(choice) - 1;  // -1 car les tableaux commencent à 0
```

N'oubliez pas de vérifier que `index` est valide (pas `NaN`, pas négatif, pas au-delà du tableau).
</details>

<details>
<summary>Indice 2 — Accéder à l'article choisi</summary>

Si `titles` contient les résultats de recherche et `index` le choix de l'utilisateur :
```javascript
const article = await getSummary(titles[index]);
```
</details>

Testez :
```bash
bun run wiki.js "intelligence artificielle"
bun run wiki.js chat
bun run wiki.js "mines de paris"
```

---

## Étape 5 — Gestion d'erreurs

Sur le web, tout peut casser : plus d'Internet, serveur en panne, URL invalide. En Python vous utilisez `try`/`except` — en JavaScript c'est `try`/`catch`, et ça marche exactement pareil.

### Questions — anticiper les erreurs

Avant de coder, réfléchissez : quels **types d'erreurs** peuvent survenir quand on fait un `fetch()` ?

1. Que se passe-t-il si l'utilisateur n'a **pas de connexion Internet** ? (Testez : passez en mode avion et relancez votre script)
2. Que se passe-t-il si le serveur répond avec un **code d'erreur** (404, 500) ? Est-ce que `fetch()` lance une erreur automatiquement ?
3. Que se passe-t-il si le serveur répond du **texte au lieu du JSON** et qu'on appelle `.json()` ?

> 💡 Spoiler : `fetch()` ne lance **jamais** d'erreur pour un code HTTP 404 ou 500. Il faut vérifier `response.ok` soi-même. Par contre, il lance une `TypeError` si le réseau est inaccessible.

### À vous

Créez une fonction `safeFetch(url)` qui centralise la gestion d'erreurs pour **tous** vos appels réseau :

```javascript
async function safeFetch(url) {
    try {
        // TODO : faire le fetch

        // TODO : vérifier que la réponse est ok
        //        Si non → lancer une erreur avec le code HTTP
        //        💡 throw new Error(`HTTP ${response.status} : ${response.statusText}`)

        // TODO : parser et retourner le JSON
    } catch (error) {
        // Ce catch attrape DEUX types d'erreurs :
        // - TypeError : pas de réseau (fetch a échoué)
        // - Error : notre throw ci-dessus (réponse HTTP en erreur)
        console.error(`Erreur : ${error.message}`);
        return null;
    }
}
```

Remplacez ensuite les `fetch()` dans vos fonctions `searchWiki` et `getSummary` par des appels à `safeFetch`.

Testez avec une URL cassée :
```javascript
const broken = await safeFetch("https://fr.wikipedia.org/api/rest_v1/page/summary/xyzxyzxyz404");
console.log("Résultat :", broken); // → null, pas de crash
```

> **Règle** : toute requête réseau devrait être dans un `try`/`catch`. C'est comme `try`/`except` en Python.

---

## Étape 6 — Requêtes en parallèle avec Promise.all

Comparons deux approches pour récupérer 3 articles en même temps.

### Version séquentielle (lente)

```javascript
// compare.js — version séquentielle

const articles = ["Paris", "Lyon", "Marseille"];
const start = Date.now();

// ❌ Un après l'autre : chaque await attend la fin du précédent
const results = [];
for (const title of articles) {
    const url = `https://fr.wikipedia.org/api/rest_v1/page/summary/${title}`;
    const response = await fetch(url);
    const data = await response.json();
    results.push(data);
}

const sequentialTime = Date.now() - start;
console.log(`Séquentiel : ${sequentialTime}ms`);
for (const article of results) {
    console.log(`  ${article.title} : ${article.extract.length} caractères`);
}
```

### Questions

1. Pourquoi est-ce lent ? Dessinez mentalement (ou sur papier) la **chronologie** des 3 requêtes. Combien de temps total si chaque requête prend ~200ms ?
2. Si les 3 requêtes sont **indépendantes** (aucune n'a besoin du résultat d'une autre), pourquoi les faire une par une ?
3. Cherchez `Promise.all` : que fait cette fonction ? Quel est son paramètre ? Que retourne-t-elle ?

### À vous — version parallèle

Écrivez maintenant la version parallèle dans le même fichier, avec d'autres villes (pour comparer les temps) :

```javascript
// --- Version parallèle ---

const articles2 = ["Berlin", "Londres", "Tokyo"];
const start2 = Date.now();

// TODO : lancer les 3 fetch EN MÊME TEMPS avec Promise.all
// 💡 .map() crée un tableau de Promises → Promise.all attend qu'elles soient toutes résolues
// 💡 Deux étapes : d'abord les fetch, puis les .json()

const parallelTime = Date.now() - start2;
console.log(`\nParallèle : ${parallelTime}ms`);

// TODO : afficher les résultats

console.log(`\n⚡ Gain : ${sequentialTime - parallelTime}ms`);
```

Testez :
```bash
bun run compare.js
```

Vous devriez observer un gain de ~2-3x !

<details>
<summary>Indice — structure de Promise.all avec fetch</summary>

```javascript
// Étape 1 : lancer tous les fetch en parallèle
const responses = await Promise.all(
    articles.map(title => fetch(`...${title}`))
);
// Étape 2 : parser tous les JSON en parallèle
const results = await Promise.all(responses.map(r => r.json()));
```
</details>

> **La règle** : si vos requêtes sont **indépendantes** (l'une n'a pas besoin du résultat de l'autre), utilisez `Promise.all`. Si elles sont **dépendantes** (comme recherche → puis résumé de l'article choisi), faites-les en séquence avec `await`.

---

## Rappel des commandes

```bash
bun run wiki.js                    # sans argument → affiche l'usage
bun run wiki.js Paris              # résumé direct
bun run wiki.js "Tour Eiffel"      # avec espaces → guillemets
bun run compare.js                 # comparaison séquentiel vs parallèle
```

---

## Bonus

### Bonus 1 — Mode interactif

Ajoutez une boucle `while(true)` pour enchaîner les recherches sans relancer le script :

```javascript
while (true) {
    const query = prompt("\n🔍 Recherche Wikipedia (ou 'q' pour quitter) :");
    if (!query || query === "q") break;
    // ... votre code de recherche + résumé ici
}
```

### Bonus 2 — Article aléatoire

Wikipedia a un endpoint pour les articles au hasard :
```
https://fr.wikipedia.org/api/rest_v1/page/random/summary
```

Ajoutez une option : si l'utilisateur tape "random", affichez un article au hasard.

### Bonus 3 — Comparer deux articles

Créez une commande `bun run wiki.js --compare Paris Lyon` qui affiche les résumés des deux articles côte à côte (utilisez `Promise.all` pour les récupérer en parallèle).

### Bonus 4 — Couleurs dans le terminal

Rendez la sortie plus lisible avec des codes ANSI :

```javascript
const VERT = "\x1b[32m";
const CYAN = "\x1b[36m";
const GRAS = "\x1b[1m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

console.log(`${GRAS}${CYAN}${article.title}${RESET}`);
console.log(`${DIM}${article.description}${RESET}`);
```
