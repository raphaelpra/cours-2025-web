# Cours 07 — APIs modernes avec Hono

**Date :** mardi 31 mars 2026

---

## Objectifs

- Repartir du TP backend précédent et le corriger partiellement avec une stack plus moderne
- Comprendre ce qu'apporte un framework web comme **Hono** par rapport à `Bun.serve()`
- Savoir tester une API avec **Yaak** (ou `curl` / Hoppscotch si besoin)
- Comprendre le principe d'un déploiement sans serveur dédié avec **Cloudflare Workers**
- Préparer le terrain pour un TP d'API autour de **Motus**

---

## Déroulé (~3h)

1. Rappel du TP précédent et de ses limites
2. Pourquoi passer de `Bun.serve()` à Hono
3. Live coding : routes, params, body JSON, validation légère
4. Tester l'API avec Yaak
5. *Pause*
6. Corrigé partiel du TP précédent en version API
7. Déploiement sur Cloudflare Workers
8. Lancement du TP Motus
9. Récap

---

### 1. Retour sur la semaine dernière (~10 min)

Point de départ : le mini backend de formulaires du cours 06.

Questions à faire émerger :
- le code marche, mais devient vite répétitif
- les routes sont gérées à la main avec plusieurs `if`
- on mélange parfois HTML, validation, logique métier et format de réponse
- le stockage JSON était utile pédagogiquement, mais ce n'est pas le point important aujourd'hui

Message clé :

> Aujourd'hui, on garde le cœur du problème (recevoir, valider, répondre), mais on enlève la partie sauvegarde fichier pour se concentrer sur l'API elle-même.

---

### 2. Pourquoi Hono ? (~20 min)

À expliquer simplement :
- Hono est un petit framework web basé sur les standards du web
- il évite d'écrire à la main tout le routage bas niveau
- il fonctionne sur plusieurs runtimes : Bun, Node, Deno, Cloudflare Workers
- il est bien adapté à une petite API JSON

Comparaison à faire au tableau :

```javascript
// Bun.serve()
if (url.pathname === "/submit" && request.method === "POST") {
  ...
}

// Hono
app.post("/submit", (c) => {
  ...
})
```

Message clé :

> Le framework n'ajoute pas de magie. Il organise mieux ce qu'on faisait déjà.

---

### 3. Live coding Hono (~35 min)

Ordre conseillé avec les fichiers de `demos/` :

1. **Premier endpoint**
   ```bash
   bun run 07-api/demos/01-first-hono.js
   ```

2. **Routes + paramètres**
   ```bash
   PORT=3001 bun run 07-api/demos/02-routes-params.js
   ```

3. **Servir un formulaire simple**
   ```bash
   PORT=3002 bun run 07-api/demos/03-html-form.js
   ```

4. **Servir la même page via un fichier statique**
   ```bash
   PORT=3012 bun run 07-api/demos/03-html-form-bis.js
   ```

   Ici, on montre explicitement le middleware `serveStatic` de Hono.

5. **Recevoir du JSON**
   ```bash
   PORT=3003 bun run 07-api/demos/04-post-json.js
   ```

Messages clés :
- `new Hono()` crée l'application
- après la première démo, on préfère `export default app` pour ne pas dépendre uniquement de `Bun.serve()`
- `app.get()` et `app.post()` déclarent les routes
- `await c.req.json()` lit le body JSON
- `c.json()` renvoie une réponse JSON proprement

---

### 4. Tester avec Yaak (~15 min)

À montrer :
- choisir la méthode (`GET`, `POST`)
- saisir l'URL
- envoyer un body JSON
- lire le code de statut et la réponse JSON

Exemple à tester :

```json
{
  "name": "Ada",
  "message": "Bonjour depuis Yaak"
}
```

Remarque pratique : si Yaak n'est pas installé sur une machine, on peut faire les mêmes tests avec `curl` ou Hoppscotch.

---

### 5. *Pause* (~15 min)

---

### 6. Corrigé partiel du TP précédent (~35 min)

Objectif : refaire le mini backend de formulaires, mais en version API.

Ce qu'on garde :
- une route pour voir que le serveur tourne
- une route qui reçoit des données
- une validation minimale
- une réponse claire en JSON

Ce qu'on enlève :
- la sauvegarde dans un fichier JSON
- la persistance entre deux redémarrages

Pourquoi :
- si on veut persister “pour de vrai”, on parlera plutôt de BDD
- garder une logique de fichier local compliquerait le déploiement sur Cloudflare Workers

Ce qu'on peut ajouter à la place :
- un tableau en mémoire pendant que le serveur tourne
- un compteur de messages reçus
- un endpoint `GET /api/submissions`

Fichier conseillé :

```bash
PORT=3004 bun run 07-api/demos/05-contact-api.js
```

---

### 7. Déploiement Cloudflare Workers (~20 min)

Objectif : déployer l'exemple de base avant de passer à Motus.

À faire apparaître :
- `demos/05-contact-api.js` peut tourner localement puis être déployé ailleurs
- Cloudflare Workers exécute du JavaScript au plus près des utilisateurs
- `wrangler` est l'outil de ligne de commande pour développer et déployer

Commandes à montrer :

```bash
bun add -d wrangler
bunx wrangler login
bunx wrangler deploy
```

Message clé :

> Même API, autre runtime. C'est précisément là que Hono est utile.

---

### 8. TP — API Motus (~20 min de lancement)

Le TP sera volontairement moins guidé que le précédent.

Objectif général : construire progressivement un endpoint qui compare une proposition à un mot cible et renvoie une réponse exploitable par un frontend.

Capacités visées :
- définir une petite famille de routes d'API claire
- lire et valider un body JSON
- renvoyer une structure de réponse cohérente
- tester l'API avec Yaak
- déployer une version fonctionnelle

Contrat visé en fin de séance / TP :

- `GET /games/random`
- `GET /games/:id`
- `POST /games/:id/guess`

Avec un modèle simple :

- `const words = ["cours", "motus", "api", ...]`
- l'id est l'index du mot dans le tableau
- `GET /games/:id` renvoie au minimum `id`, `length` et `firstLetter`
- `POST /games/:id/guess` peut ensuite accepter un `alreadyGuess`, qu'il faut valider si le client l'envoie

Fichier d'énoncé : [tp-motus-api.md](tp-motus-api.md)

---

### 9. Récap (~10 min)

- `Bun.serve()` reste utile pour comprendre la base
- Hono simplifie le routage et les réponses
- Yaak sert à manipuler une API sans écrire de frontend
- Cloudflare Workers permet de publier rapidement une API
- le prochain enjeu n'est plus “recevoir un formulaire”, mais “concevoir une bonne API”

---

## Fichiers de la séance

| Fichier | Description |
|---------|-------------|
| `programme.md` | Déroulé de la séance |
| `cours.md` | Support détaillé pour le live coding |
| `tp-motus-api.md` | TP Motus, version peu guidée |
| `package.json` | Dépendances de la séance |
| `demos/01-first-hono.js` | Premier serveur Hono |
| `demos/02-routes-params.js` | Routes et paramètres |
| `demos/03-html-form.js` | Formulaire HTML servi par Hono |
| `demos/03-html-form-bis.js` | Même formulaire via un fichier statique |
| `demos/04-post-json.js` | Lecture d'un body JSON |
| `demos/05-contact-api.js` | Corrigé partiel du TP précédent |
| `demos/06-motus-check.js` | Départ pour l'API Motus |
| `demos/07-security.js` | Auth par headers |
| `demos/08-cookies.js` | Cookies avec Hono |
| `demos/09-sessions.js` | Sessions en mémoire |
| `cours/slides-annexe.md` | Annexe sécurité / cookies / sessions |

---

## Pour la prochaine fois

- [ ] Rejouer les démos `01` à `06`
- [ ] Tester chaque route avec Yaak ou `curl`
- [ ] Finir le TP Motus si besoin
- [ ] Déployer une version minimale sur Cloudflare Workers

---

## Annexe optionnelle

Pour aller plus loin :

```bash
bun run --cwd 07-api slides-annexe
```

Puis ouvrir :

```text
http://localhost:3000/slides-annexe.html
```

Contenu :

- types de sécurisation d'API
- cookies
- sessions
- démos Bun + Yaak
