# TP — Construire une API Motus avec Hono

**Objectif** : implémenter une petite API Motus capable de comparer une proposition à un mot cible et de renvoyer une réponse exploitable par un frontend.

> Ce TP est volontairement **moins guidé** que le précédent, mais l'API cible est imposée pour que tout le monde travaille sur le même contrat.

---

## 🎯 Compétences visées

- créer une API avec Hono
- définir un endpoint clair
- lire et valider un body JSON
- renvoyer une réponse structurée
- tester l'API avec Yaak ou `curl`
- publier une version minimale sur Cloudflare Workers

---

## Contrat d'API à respecter

Routes attendues :

- `GET /games/random`
- `GET /games/:id`
- `POST /games/:id/guess`

Source de vérité côté serveur :

```javascript
const words = ["cours", "motus", "api", "python", "worker"]
```

Ici, l'identifiant d'une partie est simplement l'**index** du mot dans le tableau.

Exemple : `id = 3` correspond au mot `"python"`.

Exemple de réponse pour `GET /games/:id` :

```json
{
  "id": 3,
  "length": 6,
  "firstLetter": "p"
}
```

Exemple de body pour une proposition :

```json
{
  "guess": "poivre"
}
```

Exemple de réponse attendue :

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

## Étape 0 — Mise en place

Créez votre espace de travail personnel :

```bash
mkdir -p 07-api/perso
touch 07-api/perso/tp-motus-api.js
```

Si besoin, inspirez-vous des démos de `07-api/demos/`.

---

## Étape 1 — Démarrer une API minimale

But : vérifier que Hono tourne correctement.

Attendu minimal :
- une route `GET /`
- une réponse simple du style `API Motus prête`

Test :

```bash
curl http://localhost:3000
```

---

## Étape 2 — Première version avec un mot hardcodé

But : faire marcher la logique sans encore gérer une liste de jeux.

À faire :
- créer `POST /games/:id/guess`
- commencer avec un mot cible hardcodé côté serveur
- lire un body JSON contenant `guess`

Le paramètre `:id` peut d'abord être ignoré si vous voulez avancer par étapes.

Conseil : gardez une API simple et lisible.

---

## Étape 3 — Lire et valider `guess`

But : refuser proprement les requêtes invalides.

Vérifications utiles :
- body JSON valide
- champ `guess` présent
- type chaîne de caractères
- bonne longueur
- alphabet autorisé si vous voulez aller plus loin

Attendu :
- code `400` si la requête est invalide
- message d'erreur clair en JSON

---

## Étape 4 — Implémenter la logique Motus

But : comparer la proposition au mot cible.

Votre API doit pouvoir distinguer au minimum :
- lettre bien placée
- lettre présente mais mal placée
- lettre absente

Conseil : commencez par un cas simple, puis améliorez.

Questions de conception :
- comment représenter l'état d'une lettre ?
- comment construire `currentGuess` ?
- comment gérer les lettres répétées ?

Pour cette première version, vous pouvez déjà utiliser :

- `correct`
- `present`
- `absent`

Puis raffiner plus tard le cas des lettres répétées.

---

## Étape 5 — Renvoyer la réponse attendue

But : produire un JSON facile à relire et à réutiliser.

Attendu :
- `letters: [{ letter, state }]`
- `currentGuess`
- `guessed`
- une réponse cohérente et lisible

Dans cette version, la réponse de `POST /games/:id/guess` ne contient pas de champ `ok`.
Dans les exemples du support, on peut écrire `...` pour montrer que la réponse est volontairement tronquée.

Pensez à la personne qui consommera l'API côté frontend.

---

## Étape 6 — Ajouter les routes de jeux

But : faire évoluer l'API vers le contrat complet.

À faire :
- créer un tableau `words`
- utiliser l'index du tableau comme identifiant
- ajouter `GET /games/:id`
- ajouter `GET /games/random`
- renvoyer au minimum `id`, `length` et `firstLetter`

Le mot cible doit rester côté serveur.

---

## Étape 7 — Ajouter `alreadyGuess`

But : permettre au client de renvoyer le résultat connu jusque-là.

Exemple de body :

```json
{
  "guess": "poivre",
  "alreadyGuess": "p....."
}
```

Attendu :
- si `alreadyGuess` est fourni, il doit être valide
- s'il est invalide, l'API renvoie une erreur claire
- s'il est valide, il aide à construire le nouveau `currentGuess`

---

## Étape 8 — Tester sérieusement

But : ne pas se contenter d'un seul cas heureux.

À tester au minimum :
- `GET /games/random`
- `GET /games/:id`
- mot correct
- mot faux
- mauvaise longueur
- `alreadyGuess` invalide
- body incomplet
- JSON invalide

Outils possibles :
- Yaak
- Hoppscotch
- `curl`

---

## Étape 9 — Déployer

But : rendre l'API accessible en dehors de votre machine.

Objectif minimum :
- une version locale fonctionnelle

Objectif normal :
- une version déployée sur Cloudflare Workers

---

## Bonus

- garder l'historique des tentatives en mémoire
- améliorer la validation pour refuser les mauvais types plus explicitement
- mieux gérer les lettres répétées
- documenter votre API avec quelques requêtes d'exemple

---

## Critères de réussite

Votre TP est réussi si :

- l'API démarre sans erreur
- l'endpoint principal répond correctement
- les entrées invalides sont traitées proprement
- la réponse JSON est claire
- vous savez expliquer vos choix d'API
