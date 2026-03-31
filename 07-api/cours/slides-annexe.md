class: middle, slide_title
<img class="slide_title_mpt" src="static/media/logos/logo_mines_paris.png">
<img class="left_panel" src="static/media/logos/mines_paris_lampe.png">

# Cours Web 🚀

## Annexe — sécurité, cookies et sessions 🔐

<p><strong><i>Raphaël Prasquier</i></strong><br>MINES Paris - Université PSL</p>

---

layout: true
<img class="slide_header_mpt" src="static/media/logos/logo_mines_paris.png">

---

# Pourquoi cette annexe ?

Une API ne sert pas seulement à répondre.

Elle doit aussi parfois :

- reconnaître qui appelle
- refuser un accès
- garder un peu d'état
- protéger certaines routes

---

# Trois grandes familles

- **header d'authentification**
- **cookie**
- **session**

À chaque fois, on va regarder :

- ce que le serveur envoie ou vérifie
- ce que Yaak permet de voir ou de rejouer

---

# 1. Header d'authentification

Le client envoie une information dans les headers.

Exemples classiques :

- `X-API-Key`
- `Authorization: Bearer ...`
- `Authorization: Basic ...`

---

# Démo sécurité

```bash
PORT=3007 bun run 07-api/demos/07-security.js
```

À l'écran :

- `/public`
- `/api-key`
- `/bearer`
- `/basic`

---

# Avec Yaak

À montrer :

- **API Key** → header `X-API-Key: demo-key`
- **Bearer Token** → token `demo-token`
- **Basic Auth** → user `ada`, password `lovelace`

Ce que les élèves voient :

- sans auth → erreur
- avec le bon mécanisme → accès autorisé

---

# Ce que cela protège bien

- une API machine-to-machine
- une route d'administration simple
- un prototype rapide

Limite :

- il faut quand même du HTTPS

---

# 2. Cookie

Idée :

- le serveur envoie `Set-Cookie`
- le client renvoie ensuite `Cookie`

Le navigateur le fait automatiquement.
Yaak sait aussi gérer cela.

---

# Démo cookies

```bash
PORT=3008 bun run 07-api/demos/08-cookies.js
```

À l'écran :

- `GET /set`
- `GET /get`
- `GET /logout`

---

# Avec Yaak

Séquence à montrer :

1. appeler `GET /set`
2. regarder le header `Set-Cookie`
3. appeler `GET /get`
4. voir que Yaak renvoie le cookie
5. appeler `GET /logout`

---

# Attributs importants d'un cookie

- `HttpOnly` → le JavaScript du navigateur ne peut pas le lire
- `Secure` → envoyé seulement en HTTPS
- `SameSite` → limite certains envois cross-site
- `Path` → limite où le cookie est renvoyé

---

# 3. Session

Une session, ce n'est pas juste un cookie.

Le pattern classique est :

- un **session id** dans le cookie
- les vraies données côté serveur

---

# Démo sessions

```bash
PORT=3009 bun run 07-api/demos/09-sessions.js
```

À l'écran :

- `POST /login`
- `GET /me`
- `POST /logout`

---

# Avec Yaak

Séquence à montrer :

1. `POST /login` avec `{ "username": "ada" }`
2. observer le cookie `session-id`
3. `GET /me`
4. `POST /logout`
5. `GET /me` → erreur

---

# Où vit l'état ?

Dans cette démo :

```javascript
const sessions = new Map()
```

Donc :

- simple à comprendre
- parfait pour un cours
- perdu au redémarrage

---

# Et en vrai ?

En production, on stocke souvent les sessions dans :

- une base de données
- Redis
- un service dédié

---

# Cookies vs sessions

.cols[
.fifty[

## Cookie seul

- simple
- léger
- côté client

]
.fifty[

## Session

- état côté serveur
- plus flexible
- plus proche d'un login classique

]
]

---

# Deux mots de sécurité web

## CSRF

Si le navigateur renvoie automatiquement un cookie, un autre site peut parfois en profiter.

Protection simple à citer :

- `SameSite=Lax` ou `Strict`

---

# Deux mots de sécurité web

## XSS

Si une page exécute du code injecté, ce code peut lire ou envoyer des données.

Protection simple à citer :

- échapper le HTML
- préférer des cookies `HttpOnly` pour les sessions

---

# Ce qu'il faut retenir

- header d'auth → bien pour API key / bearer / basic
- cookie → bien pour garder une petite info côté client
- session → bien pour garder l'état côté serveur
- Yaak permet de voir et tester tout cela sans frontend complet

---

class: middle, center

# Fin de l'annexe 🔐

`07-security.js` • `08-cookies.js` • `09-sessions.js`
