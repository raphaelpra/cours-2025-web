# Cours 07 — Support détaillé

Ce document accompagne le live coding et sert de pense-bête pendant la séance.

> **Idée centrale** : on sait déjà recevoir une requête. Aujourd'hui, on apprend à structurer une API plus proprement, à la tester, puis à la déployer.

---

## Le changement de niveau d'abstraction

### Semaine dernière

```javascript
Bun.serve({
    port: 3000,
    async fetch(request) {
        const url = new URL(request.url)

        if (url.pathname === "/submit" && request.method === "POST") {
            const formData = await request.formData()
            ...
        }
    },
})
```

### Cette semaine

```javascript
import { Hono } from "hono"

const app = new Hono()

app.post("/submit", async (c) => {
    const body = await c.req.json()
    return c.json({ ok: true, body })
})

export default app
```

Hono ne remplace pas HTTP. Hono organise mieux notre code HTTP.

Pendant le cours, on garde `Bun.serve()` dans la toute première démo pour bien voir le point de départ, puis on passe à `export default app` pour rendre les exemples plus génériques.

---

## Pattern Hono minimal

```javascript
import { Hono } from "hono"

const app = new Hono()

app.get("/", (c) => {
    return c.text("API prête")
})

app.post("/hello", async (c) => {
    const body = await c.req.json()
    return c.json({ message: `Bonjour ${body.name}` })
})

Bun.serve({
    port: 3000,
    fetch: app.fetch,
})
```

---

## Vocabulaire utile

- **endpoint** : une route d'API (`GET /api/submissions`)
- **payload** : les données envoyées par le client
- **validation** : vérifier que les données sont présentes et du bon type
- **status code** : `200`, `201`, `400`, `404`...
- **runtime** : l'environnement d'exécution (Bun, Cloudflare Workers, etc.)

---

## Lire les données avec Hono

### Paramètre dans l'URL

```javascript
app.get("/hello/:name", (c) => {
    const name = c.req.param("name")
    return c.text(`Bonjour ${name}`)
})
```

### Query string

```javascript
app.get("/search", (c) => {
    const q = c.req.query("q") ?? ""
    return c.json({ q })
})
```

### Body JSON

```javascript
app.post("/api/messages", async (c) => {
    const body = await c.req.json()
    return c.json(body, 201)
})
```

---

## Valider sans compliquer

On reste simple pendant le cours.

```javascript
app.post("/api/messages", async (c) => {
    const body = await c.req.json()

    const name = String(body.name ?? "").trim()
    const message = String(body.message ?? "").trim()

    if (!name || !message) {
        return c.json(
            { ok: false, error: "name et message sont obligatoires" },
            400,
        )
    }

    return c.json({ ok: true, item: { name, message } }, 201)
})
```

Message important : une bonne API explique clairement pourquoi une requête est refusée.

---

## Réponses utiles pendant le cours

```javascript
return c.text("Bonjour")
return c.html("<h1>Hello</h1>")
return c.json({ ok: true })
return c.json({ ok: false, error: "bad request" }, 400)
```

---

## HTML : deux approches

Première approche : construire la page dans le code.

```bash
PORT=3002 bun run 07-api/demos/03-html-form.js
```

Deuxième approche : utiliser le middleware `serveStatic` pour servir un fichier HTML statique.

```bash
PORT=3012 bun run 07-api/demos/03-html-form-bis.js
```

Pourquoi montrer les deux ?

- la première aide à comprendre vite ce que renvoie le serveur
- la seconde prépare une organisation plus réaliste avec des fichiers séparés
- la seconde montre aussi un vrai middleware Hono pour les fichiers statiques

---

## Corrigé partiel du TP précédent

Version API minimale :

1. `GET /` → petit message de bienvenue
2. `POST /api/submissions` → reçoit `{ name, message }`
3. validation légère
4. ajout dans un tableau en mémoire
5. `GET /api/submissions` → renvoie le tableau

Pourquoi garder un tableau en mémoire ?
- cela suffit pour comprendre la logique d'API
- si on veut de la persistance plus tard, on parlera plutôt de BDD que de fichier local
- la logique de fichier compliquerait inutilement le passage au déploiement sur Workers

Limite assumée : les données disparaissent au redémarrage.

---

## Tester avec Yaak

Ce qu'il faut montrer aux élèves :

1. créer une requête `POST`
2. mettre l'URL `http://localhost:3003/api/messages`
3. choisir un body JSON
4. cliquer sur **Send**
5. observer le status code et le JSON de réponse

Exemple de body :

```json
{
  "name": "Ada",
  "message": "Bonjour depuis Yaak"
}
```

Fallback si Yaak n'est pas disponible :

```bash
curl -X POST http://localhost:3003/api/messages \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","message":"Bonjour"}'
```

---

## Déployer sur Cloudflare Workers

On veut pouvoir déployer **l'exemple de base**, avant même de passer à Motus.

Idée à faire passer :

- en local, Bun sait servir un fichier qui fait `export default app`
- en production simple, Cloudflare Workers peut réutiliser le même `app`
- l'API garde presque la même structure

Exemple ciblé : `demos/05-contact-api.js`

Commandes de base :

```bash
bun add -d wrangler
bunx wrangler login
bunx wrangler deploy
```

Configuration minimale :

```jsonc
// wrangler.jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "07-api-demo",
  "main": "demos/05-contact-api.js",
  "compatibility_date": "2026-03-31"
}
```

Ce qu'il faut dire explicitement :
- Cloudflare Workers n'est pas Bun
- mais Hono fonctionne sur les deux
- c'est le framework qui rend le changement de plateforme plus simple

---

## Motus : ce qu'on veut préparer

L'idée n'est plus seulement de “recevoir un message”, mais de concevoir une réponse exploitable par un frontend.

Exemple de réflexion à mener :
- quel endpoint ?
- quelle méthode HTTP ?
- quel body JSON ?
- quel format de réponse pour chaque lettre ?
- comment garder la trace de ce qui est déjà découvert ?

Contrat retenu pour le TP :

- `GET /games/random`
- `GET /games/:id`
- `POST /games/:id/guess`

Base de données minimale côté serveur pour le support :

```javascript
const words = ["cours", "motus", "api", "python", "worker"]
```

Ici, l'identifiant est simplement l'index du mot dans le tableau.

Exemple pour `GET /games/:id` :

```json
{
  "id": 3,
  "length": 6,
  "firstLetter": "p"
}
```

Base du body envoyé au serveur :

```json
{
  "guess": "poivre"
}
```

Puis, dans un troisième temps :

```json
{
  "guess": "poivre",
  "alreadyGuess": "p....."
}
```

Réponse attendue :

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

Progression pédagogique retenue :

1. commencer avec un mot hardcodé côté serveur
2. passer ensuite à un tableau `words` et des identifiants numériques
3. ajouter `GET /games/:id` avec `firstLetter`
4. ajouter `GET /games/random`
5. accepter ensuite un `alreadyGuess` dans `POST /games/:id/guess`
6. valider explicitement `alreadyGuess` si le client l'envoie

Pour cette première version, on peut déjà utiliser les états `correct`, `present` et `absent`.

Le vrai raffinement à garder pour plus tard, c'est surtout la gestion des lettres répétées.

---

## Fichiers de démo (`07-api/demos/`)

| Fichier | Concept |
|---------|---------|
| `01-first-hono.js` | Premier serveur Hono |
| `02-routes-params.js` | Routes, params, query |
| `03-html-form.js` | Formulaire HTML servi par Hono |
| `04-post-json.js` | Lire un body JSON |
| `05-contact-api.js` | Corrigé partiel du TP précédent |
| `06-motus-check.js` | API Motus avec `words`, `firstLetter`, `present/absent` et `alreadyGuess` |
