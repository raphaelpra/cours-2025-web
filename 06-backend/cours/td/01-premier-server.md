# TD 1 — Votre premier serveur avec Bun

**Objectif** : Créer un serveur HTTP minimal qui répond aux requêtes.

---

## Étape 0 — Préparation

Créez un fichier `td1-server.js` dans `06-backend/perso/`.

```bash
mkdir -p 06-backend/perso
touch 06-backend/perso/td1-server.js
```

---

## Étape 1 — Serveur minimal ✅ (Fait en cours)

> **Cette étape sera réalisée ensemble lors du cours.**

Créez un serveur qui écoute sur le port **3000** et répond `Bonjour !` à toutes les requêtes.

**Indices :**
- Utilisez `Bun.serve()`
- La fonction `fetch` doit retourner une `Response`

**Test :**
```bash
bun run 06-backend/perso/td1-server.js
```

Puis ouvrez : `http://localhost:3000`

---

## Étape 2 — Ajouter une route ⭐ (Début du TD)

**Le TD commence ici !**

Modifiez votre serveur pour qu'il réponde différemment selon l'URL :

- `/` → `Page d'accueil`
- `/about` → `À propos`
- Tout le reste → `404 Not Found` (avec le bon code HTTP)

**Indices :**
- Utilisez `new URL(request.url)` pour parser l'URL
- Vérifiez `url.pathname`
- Pour le 404 : `new Response("...", { status: 404 })`

---

## Étape 3 — Méthodes HTTP

Ajoutez la gestion des méthodes :

- `GET /` → `Page d'accueil`
- `POST /` → `Données reçues`
- `GET /about` → `À propos`

**Indices :**
- Vérifiez `request.method`

---

## Étape 4 — Réponse HTML

Faites en sorte que votre serveur renvoie du **HTML** au lieu de texte brut.

**Indices :**
- `headers: { "Content-Type": "text/html; charset=utf-8" }`

---

## Étape 5 — Query params (Bonus)

Ajoutez une route `/hello` qui accepte un paramètre `name` :

- `/hello?name=Ada` → `Bonjour Ada !`
- `/hello` → `Bonjour inconnu !`

**Indices :**
- Utilisez `url.searchParams.get("name")`
- L'opérateur `??` peut servir pour la valeur par défaut

---

## Ressources utiles

- **Exemple complet** : `06-backend/demos/01-first-server.js`
- **Snippet de référence** : `06-backend/cours/snippets/random-api-server.js`

---

## Vérification

Testez avec curl :

```bash
# Test basique
curl http://localhost:3000

# Test 404
curl http://localhost:3000/inconnu

# Test POST
curl -X POST http://localhost:3000

# Test query param (bonus)
curl "http://localhost:3000/hello?name=Ada"
```
