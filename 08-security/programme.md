# Cours 08 — Sécurité web et initiation au hacking

**Date :** mardi 7 avril 2026

---

## Objectifs

- Revoir rapidement la différence entre **auth**, **cookie** et **session**
- Comprendre qu'une application web a une **surface d'attaque** observable depuis le navigateur
- Introduire le vocabulaire minimum de la sécurité web : **faille**, **payload**, **indice**, **scoreboard**
- Découvrir **OWASP Juice Shop** comme terrain d'entraînement volontairement vulnérable
- Faire un premier atelier guidé d'exploration et de résolution de challenges simples
- Garder un cadre clair : on attaque uniquement un environnement prévu pour cela

---

## Accès à l'instance du cours

L'instance du cours est déployée via **MultiJuicer** sur DigitalOcean.

- **URL publique :** https://secu.web-groupe1.info-mines.paris/balancer/
- **Accès élève :** chaque binôme choisit un nom d'équipe, récupère le passcode affiché, puis clique sur **Start Hacking** pour lancer sa propre instance de Juice Shop
- **Durée de vie :** les instances Juice Shop créées pour les équipes sont éphémères ; le nettoyage automatique supprime les instances inactives après 24 h

---

## Déroulé (~3h)

1. Rappel du cours précédent et cadrage de la séance
2. Rappel express : cookie / session / auth
3. Pourquoi une appli web peut être attaquée
4. Présentation de Juice Shop et règles du jeu
5. *Pause*
6. Prise en main de l'interface et des outils navigateur
7. Atelier Juice Shop guidé
8. Debrief collectif
9. Récap

---

### 1. Rappel et cadrage (~10 min)

Rappel rapide du cours 07 :
- on a construit une API avec Hono
- on a vu qu'une API ne fait pas que répondre ; elle peut aussi filtrer l'accès
- on a déjà aperçu plusieurs mécanismes de sécurisation simples

Message d'ouverture :

> Aujourd'hui, le but n'est pas de faire un cours théorique complet de cybersécurité. On veut surtout relier quelques notions vues la semaine dernière à une vraie application volontairement vulnérable.

---

### 2. Rappel express : cookie / session / auth (~20 min)

À faire en version très compacte, en s'appuyant sur l'annexe du cours précédent.

Support conseillé :
- `07-api/cours/slides-annexe.md`
- `07-api/demos/07-security.js`
- `07-api/demos/08-cookies.js`
- `07-api/demos/09-sessions.js`

À faire retenir :
- **auth** = comment le serveur vérifie qui appelle
- **cookie** = petite donnée renvoyée automatiquement par le navigateur
- **session** = état stocké côté serveur, souvent relié à un cookie de session

Insister sur une idée simple :

> Une grande partie de la sécurité web consiste à vérifier qu'un utilisateur ne peut pas lire, modifier ou faire exécuter plus que ce qu'il devrait.

---

### 3. Pourquoi une appli web peut être attaquée (~15 min)

À faire émerger au tableau :
- le navigateur envoie des requêtes que l'on peut observer et parfois modifier
- le frontend n'est pas une frontière de sécurité suffisante
- les champs cachés, boutons désactivés ou routes non visibles ne protègent pas vraiment
- si le serveur fait trop confiance à l'entrée utilisateur, il peut avoir un problème

Vocabulaire minimum :
- **vulnérabilité** : faiblesse exploitable
- **attaque** : action qui exploite cette faiblesse
- **payload** : donnée envoyée pour tester ou exploiter un comportement
- **indice / hint** : aide pour guider la recherche

---

### 4. Présentation de Juice Shop et règles du jeu (~15 min)

Support : `JUICE.md`

À expliquer simplement :
- OWASP Juice Shop est une application **volontairement vulnérable** faite pour l'entraînement
- elle couvre beaucoup de familles de failles web réelles
- la progression est suivie par un **scoreboard**
- certains challenges sont pensés pour les débutants et peuvent être guidés pas à pas

Cadre impératif à poser explicitement :
- on travaille **uniquement** sur l'instance du cours : https://secu.web-groupe1.info-mines.paris/balancer/
- on ne reproduit rien sur un vrai service sans autorisation explicite
- l'objectif est de comprendre les erreurs de conception, pas “faire du chaos”

Message clé :

> Ici, on apprend dans un bac à sable. Le bon réflexe n'est pas “comment casser un site ?”, mais “qu'est-ce qui rend cette faille possible ?”.

---

### 5. *Pause* (~15 min)

---

### 6. Prise en main de l'interface et des outils (~15 min)

Avant de lancer les élèves seuls, montrer rapidement :
- la page d'accueil
- la navigation principale
- les formulaires et zones de recherche
- l'onglet **Network** des DevTools
- l'onglet **Console** si utile
- comment repérer qu'une action frontend déclenche une requête

Message clé :

> On ne “devine” pas une application web. On l'observe : interface, requêtes, réponses, erreurs, comportements étranges.

---

### 7. Atelier Juice Shop guidé (~1h20)

Objectif : laisser un maximum de temps de pratique.

Progression conseillée :

1. **Exploration libre courte** (~10 min)
   - ouvrir l'application : https://secu.web-groupe1.info-mines.paris/balancer/
   - créer une équipe avec le nom du binôme
   - cliquer sur **Start Hacking** quand l'instance est prête
   - repérer les zones interactives
   - formuler des hypothèses

2. **Premiers challenges guidés** (~25 min)
   - un challenge très simple de découverte
   - un challenge autour d'une entrée utilisateur
   - un challenge qui oblige à ouvrir DevTools ou observer une requête

3. **Travail en binômes** (~35 min)
   - les élèves avancent par petits objectifs
   - ils notent ce qu'ils ont testé, pas seulement ce qui a marché
   - on valorise la démarche d'observation

4. **Aide graduée** (~10 min)
   - premier niveau : question de recadrage
   - deuxième niveau : indice léger
   - troisième niveau : démonstration partielle

Conseils à donner pendant l'atelier :
- commencer par les comportements visibles et simples
- tester une hypothèse à la fois
- lire les messages d'erreur
- comparer “avant / après” dans Network
- garder une trace des essais intéressants

---

### 8. Debrief collectif (~10 min)

Questions utiles :
- qu'avez-vous trouvé facilement ?
- qu'est-ce qui vous a bloqués ?
- quelles requêtes ou pages vous ont donné des indices ?
- quelle différence entre intuition, observation et preuve ?

Faire reformuler par les élèves quelques idées :
- une faille n'est pas toujours “spectaculaire”
- beaucoup de problèmes viennent d'une confiance excessive côté serveur
- observer le trafic web aide énormément à comprendre une application

---

### 9. Récap (~5 min)

- cookie, session et auth restent des briques de base pour comprendre la sécurité web
- une application web expose toujours une surface observable depuis le navigateur
- Juice Shop sert à s'entraîner sur des vulnérabilités réelles dans un cadre sûr
- la bonne méthode = observer, formuler une hypothèse, tester proprement, comprendre la cause

---

## Fichiers de la séance

| Fichier | Description |
|---------|-------------|
| `programme.md` | Déroulé de la séance |
| `JUICE.md` | Support pratique Juice Shop |
| `presences.csv` | Feuille de présence |
| `../07-api/cours/slides-annexe.md` | Rappel express sécurité / cookies / sessions |
| `../07-api/demos/07-security.js` | Démo auth par headers |
| `../07-api/demos/08-cookies.js` | Démo cookies |
| `../07-api/demos/09-sessions.js` | Démo sessions |

---

## Pour la prochaine fois

- [ ] Revoir la différence entre **authentification** et **autorisation**
- [ ] Relire l'annexe du cours 07 sur cookies et sessions
- [ ] Noter 2 ou 3 choses apprises pendant l'atelier Juice Shop
- [ ] *(optionnel)* Lire la page officielle de présentation de Juice Shop : https://owasp.org/www-project-juice-shop/
