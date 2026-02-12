# Git — Le minimum vital

Git est un outil de gestion de versions. Il permet de suivre l'historique des modifications d'un projet et de collaborer.

## Installation

### macOS

```bash
xcode-select --install
```

### Linux (Ubuntu/Debian)

```bash
sudo apt install git
```

### Windows

Déjà installé si vous avez **Git Bash**. Sinon : https://git-scm.com/downloads

> **Important** : utilisez **Git Bash** comme terminal (pas PowerShell, pas CMD).

### Vérifier

```bash
git --version
```

---

## Configuration initiale (une seule fois)

```bash
git config --global user.name "Prénom Nom"
git config --global user.email "votre@email.fr"
```

---

## Les commandes du cours

### Récupérer le cours (première fois)

```bash
git clone https://github.com/raphaelpra/cours-2025-web.git
cd cours-2025-web
```

### Récupérer les mises à jour (avant chaque séance)

```bash
git pull
```

### Voir l'état de vos fichiers

```bash
git status
```

---

## En cas de problème

Si `git pull` échoue à cause de modifications locales :

```bash
git stash        # met de côté vos modifications
git pull         # récupère les mises à jour
git stash pop    # ré-applique vos modifications
```

Si rien ne marche — option nucléaire :

```bash
git fetch --all
git reset --hard origin/main
```

> **Attention** : ceci écrase toutes vos modifications (sauf les fichiers `perso*`).

---

## Concepts clés

| Concept | Explication |
|---------|-------------|
| **Repository (repo)** | Un dossier dont l'historique est suivi par git |
| **Clone** | Copier un repo distant sur votre machine |
| **Pull** | Récupérer les dernières modifications du repo distant |
| **Commit** | Un instantané de vos modifications (une "sauvegarde") |
| **Push** | Envoyer vos commits vers le repo distant |
| **Branch** | Une version parallèle du projet |

---

## Ressources

- [Git - le guide simple](https://git.info-mines.paris)
- [Learn Git Branching](https://learngitbranching.js.org/?locale=fr_FR) — exercices interactifs
