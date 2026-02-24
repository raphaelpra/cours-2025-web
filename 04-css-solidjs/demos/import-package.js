// ============================================
// Démo — Le lien entre `bun add` et `import`
// ============================================
//
// Avant de lancer ce fichier :
//   cd 04-css-solidjs/demos
//   bun add chalk
//
// Puis :
//   bun run import-package.js

// -------------------------------------------
// 1. Importer un package npm
// -------------------------------------------

// `bun add chalk` a fait deux choses :
//   1. Téléchargé le code de chalk dans node_modules/chalk/
//   2. Ajouté "chalk" dans les dependencies de package.json
//
// Maintenant on peut l'importer — par son NOM (pas de ./ devant)

import chalk from "chalk";

console.log(chalk.green("✓ Ce texte est vert"));
console.log(chalk.red.bold("✗ Ce texte est rouge et gras"));
console.log(chalk.blue.underline("→ Ce texte est bleu souligné"));

// -------------------------------------------
// 2. La règle : ./ ou pas ?
// -------------------------------------------

// Fichier local → chemin relatif avec ./
//   import { addition } from "./utils.js"
//
// Package npm/bun → juste le nom
//   import chalk from "chalk"
//
// Comment JS sait où chercher ?
//   "./utils.js"  → regarde dans le même dossier
//   "chalk"       → regarde dans node_modules/

// -------------------------------------------
// 3. Vérifier : où est le code de chalk ?
// -------------------------------------------

// Essayez dans le terminal :
//   ls node_modules/chalk
//   cat node_modules/chalk/package.json
//
// C'est du JavaScript comme le vôtre — écrit par quelqu'un
// et publié sur npmjs.com pour que d'autres puissent l'utiliser.
