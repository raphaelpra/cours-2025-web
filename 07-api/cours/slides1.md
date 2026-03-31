class: middle, slide_title
<img class="slide_title_mpt" src="static/media/logos/logo_mines_paris.png">
<img class="left_panel" src="static/media/logos/mines_paris_lampe.png">

# Cours Web 🚀

## APIs modernes avec Hono ⚙️

<p><strong><i>Raphaël Prasquier</i></strong><br>MINES Paris - Université PSL</p>

---

layout: true
<img class="slide_header_mpt" src="static/media/logos/logo_mines_paris.png">

---

# Point de départ

La semaine dernière, on a construit un mini backend avec `Bun.serve()`.

On savait déjà :

- recevoir une requête HTTP
- servir du HTML
- lire un body `POST`
- renvoyer du JSON
- stocker des données dans un fichier

---

# Aujourd'hui

On garde le **même problème**, mais on change de niveau d'abstraction.

On veut :

- écrire les routes plus proprement
- tester l'API plus facilement
- préparer un déploiement simple

Outils du jour :

- **Hono**
- **Yaak**
- **Cloudflare Workers**

---

# Le fil rouge

## Corriger le TP précédent, mais autrement

Avant :

- `Bun.serve()`
- beaucoup de `if`
- formulaire + fichier JSON

Aujourd'hui :

- routes déclarées explicitement
- API JSON plus claire
- stockage en mémoire seulement

---

# Bun.serve() vs Hono

.cols[
.fifty[

## Bun.serve()

```javascript
if (url.pathname === "/submit" && request.method === "POST") {
    ...
}
```

]
.fifty[

## Hono

```javascript
app.post("/submit", async (c) => {
    ...
})
```

]
]

Hono n'ajoute pas de magie.

Il rend le code plus **lisible**, plus **organisé**, plus **portable**.

---

# Pattern minimal Hono

```javascript
import { Hono } from "hono"

const app = new Hono()

app.get("/", (c) => {
    return c.text("API prête")
})

Bun.serve({
    port: 3000,
    fetch: app.fetch,
})
```

---

# Ce qu'on gagne tout de suite

- `app.get()` / `app.post()`
- `c.req.param()` pour les paramètres d'URL
- `c.req.query()` pour la query string
- `await c.req.json()` pour le body JSON
- `c.json()` pour répondre proprement

---

# Première démo

```bash
bun run 07-api/demos/01-first-hono.js
```

Objectif : juste voir qu'une app Hono reste un serveur JS tout simple.

Cette démo garde volontairement `Bun.serve()`.

---

# Transition importante

On vient de voir le point de départ avec `Bun.serve()`.

À partir de maintenant, on préfère `export default app`.

Pourquoi ?

- le code devient plus générique
- on dépend moins de Bun
- on prépare mieux le passage à Workers

---

# Deuxième démo

```bash
PORT=3001 bun run 07-api/demos/02-routes-params.js
```

À observer :

- paramètre d'URL avec `:name`
- query string avec `?q=...`
- réponses texte et JSON

---

# Hono peut aussi servir du HTML

```bash
PORT=3002 bun run 07-api/demos/03-html-form.js
```

Message important :

> Hono n'est pas “uniquement pour les APIs JSON”.

Mais aujourd'hui, ce n'est pas le HTML qui nous intéresse le plus.

---

# Même idée, autre approche

```bash
PORT=3012 bun run 07-api/demos/03-html-form-bis.js
```

Cette fois :

- le serveur utilise le middleware `serveStatic`
- le fichier HTML est servi comme ressource statique
- la logique dynamique reste seulement sur `/preview`

---

# Pourquoi montrer les deux ?

- construire une page en chaîne permet de comprendre vite
- rendre un fichier statique se rapproche davantage d'une vraie organisation de projet
- on voit aussi un vrai middleware Hono de service de fichiers statiques
- cela montre que Hono peut servir du HTML de plusieurs manières

---

# Lire du JSON

```bash
PORT=3003 bun run 07-api/demos/04-post-json.js
```

Pattern de validation simple :

```javascript
let body

try {
    body = await c.req.json()
} catch {
    return c.json({ ok: false, error: "JSON invalide" }, 400)
}
```

---

# Réponse d'erreur claire

```javascript
if (!name || !message) {
    return c.json(
        { ok: false, error: "name et message sont obligatoires" },
        400,
    )
}
```

Une bonne API :

- refuse proprement
- explique pourquoi
- reste cohérente

---

# Un navigateur pour API

## Yaak

Ce qu'on veut montrer :

1. choisir `POST`
2. saisir l'URL
3. mettre un body JSON
4. observer le status code
5. relire la réponse

---

# Exemple de requête

```json
{
  "name": "Ada",
  "message": "Bonjour depuis Yaak"
}
```

Sur la démo `04-post-json.js` :

```text
POST http://localhost:3003/api/messages
```

---

# Fallback : curl

```bash
curl -X POST http://localhost:3003/api/messages \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","message":"Bonjour"}'
```

---

# Corrigé partiel du TP précédent

```bash
PORT=3004 bun run 07-api/demos/05-contact-api.js
```

On garde :

- `GET /`
- `GET /api/submissions`
- `POST /api/submissions`
- validation légère

On enlève :

- le fichier JSON
- la persistance entre deux redémarrages

---

# Pourquoi enlever le fichier ?

Parce que garder une logique de fichier nous emmène dans une mauvaise direction.

Si on veut de la persistance dans une vraie application, on ira plutôt vers une **BDD** ou un service dédié.

Sinon, on mélange :

- logique d'API
- logique de stockage
- logique liée au disque local

Et surtout, cela complique inutilement le déploiement.

Sur Cloudflare Workers, raisonner en “je vais écrire dans un fichier à côté de mon script” n'est plus le bon modèle.

Donc aujourd'hui le vrai sujet n'est pas :

> comment écrire sur le disque ?

Le vrai sujet est plutôt :

> comment concevoir une API claire, testable, réutilisable ?

---

# Déploiement

## Cloudflare Workers

On veut pouvoir déployer **l'exemple de base** avant même de passer à Motus.

Exemple ciblé :

```bash
PORT=3004 bun run 07-api/demos/05-contact-api.js
```

---

# Même API, autre runtime

Ce qu'on veut montrer :

- en local, Bun sait servir un fichier qui fait `export default app`
- en production, Cloudflare Workers peut réutiliser le même `app`
- on n'est plus obligé de dépendre d'un seul runtime

---

# Déployer l'exemple de base

```bash
bun add -d wrangler
bunx wrangler login
bunx wrangler deploy
```

Configuration minimale :

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "07-api-demo",
  "main": "demos/05-contact-api.js",
  "compatibility_date": "2026-03-31"
}
```

---

# Place au jeu : Motus

Le TP ne sera plus un formulaire.

Cette fois, il faut concevoir une API pour un jeu.

---

# Règles du jeu

- le serveur choisit un mot cible
- le client envoie des propositions
- on révèle au moins la première lettre
- on aide ensuite le frontend à afficher l'état courant

Question centrale :

> quelle forme de requête et quelle forme de réponse rendent le jeu simple à coder côté client ?

---

class: center, middle

# Quand tu crois que “c'est juste un petit endpoint” 😅

.center[
<iframe src="https://giphy.com/embed/JrSwnF7PLhgvmNfM8C" width="700" height="348" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
]

---

# Version trop naïve

```json
{
  "target": "motus",
  "guess": "motus"
}
```

Problème :

- le client envoie aussi le mot secret
- donc le joueur peut tricher
- ce n'est pas un vrai contrat d'API de jeu

---

# Notre contrat cible

## API stateless

Routes imposées :

- `GET /games/random`
- `GET /games/:id`
- `POST /games/:id/guess`

---

# Pourquoi ce contrat ?

- assez simple pour un TP
- assez réaliste pour un vrai jeu
- le serveur connaît le mot
- le frontend n'a pas besoin de connaître la solution complète
- pas besoin de gérer une session complète

---

# Le modèle de données

```javascript
const words = ["cours", "motus", "api", "python", "worker"]
```

Ici, l'id est simplement l'index du mot dans le tableau.

Donc :

- `id = 0` est accepté
- `id = 3` correspond à `python`

---

# GET /games/:id

Exemple de réponse :

```json
{
  "id": 3,
  "length": 6,
  "firstLetter": "p"
}
```

Le frontend sait donc :

- combien de cases afficher
- quelle première lettre montrer

---

# GET /games/random

Même idée, mais avec un identifiant choisi aléatoirement.

```json
{
  "id": 1,
  "length": 5,
  "firstLetter": "m"
}
```

---

# POST /games/:id/guess

Body minimal :

```json
{
  "guess": "poivre"
}
```

---

# Réponse attendue

```json
{
  "id": 3,
  "letters": [
    { "letter": "p", "state": "correct" },
    { "letter": "o", "state": "present" },
    ...
  ],
  "currentGuess": "p.....",
  "guessed": false
}
```

---

# Pourquoi ce format ?

- `letters` est facile à afficher lettre par lettre
- `state` est explicite
- `currentGuess` donne une vue compacte de ce qu'on sait déjà
- `guessed` évite au frontend de refaire un calcul

---

# Première version des états

Pour commencer, on garde les noms les plus parlants :

- `correct`
- `present`
- `absent`

Plus tard, on raffinera surtout la gestion des lettres répétées.

---

# Version 1 de l'algorithme

On commence simple.

Pour l'instant :

- on ignore le cas difficile des lettres répétées
- on normalise en minuscules
- on vérifie la longueur

Le but est d'avoir une API qui marche vite, pas une copie parfaite de Motus.

---

# Squelette de comparaison

```javascript
function compareWords(target, guess) {
    return guess.split("").map((letter, index) => {
        if (letter === target[index]) {
            return { letter, state: "correct" }
        }

        if (target.includes(letter)) {
            return { letter, state: "present" }
        }

        return { letter, state: "absent" }
    })
}
```

---

# currentGuess

Si on veut construire :

```text
p.....
```

On garde uniquement les lettres bien placées.

```javascript
const currentGuess = letters
  .map((item) => item.state === "correct" ? item.letter : ".")
  .join("")
```

---

# Troisième temps : `alreadyGuess`

Le client peut renvoyer le résultat déjà connu.

Exemple :

```json
{
  "guess": "poivre",
  "alreadyGuess": "p....."
}
```

---

# Pourquoi `alreadyGuess` ?

- le client garde la mémoire de ce qu'il sait déjà
- le serveur peut reconstruire un nouveau `currentGuess`
- on peut détecter des incohérences si le client envoie une mauvaise valeur

---

# Validation de `alreadyGuess`

Si `alreadyGuess` est fourni, il faut vérifier :

- que c'est bien une chaîne
- qu'il a la bonne longueur
- qu'il ne contient que `.` ou des lettres déjà trouvées à la bonne place

Sinon : réponse d'erreur claire.

---

# Étapes du TP

1. démarrer une API Hono minimale
2. créer `POST /games/:id/guess`
3. valider `{ guess }`
4. comparer avec un mot hardcodé
5. renvoyer `letters`, `currentGuess`, `guessed`
6. remplacer le mot hardcodé par `words[id]`
7. ajouter `GET /games/:id` puis `GET /games/random`
8. accepter `alreadyGuess` et le valider

---

# Ce qui est imposé

- les routes
- l'id numérique
- le fait que le serveur connaisse le mot
- la présence de `firstLetter`
- la réponse par lettres
- le caractère stateless

---

# Ce qu'on laisse encore ouvert

- le fait d'ajouter plus de mots au tableau `words`
- le nombre de mots disponibles
- la façon de tester
- le style de code
- la profondeur de validation

---

# Récap

- `Bun.serve()` nous a appris les bases
- Hono structure mieux une API
- Yaak sert de navigateur pour API
- Workers aide à déployer vite
- pour Motus, le vrai enjeu est le **contrat d'API**

---

class: middle, center

# À vous de jouer 🚀

TP : construire l'API Motus

`GET /games/random` • `GET /games/:id` • `POST /games/:id/guess`
