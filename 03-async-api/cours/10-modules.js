// ============================================
// 10 — Modules ES (import / export)
// Exécuter avec : bun run cours/10-modules.js
// ============================================

// En Python on fait : from math import sqrt
// En JavaScript :     import { sqrt } from "./math.js"

// ------------------------------------------
// 1. Importer depuis un fichier local
// ------------------------------------------

// On a un fichier cours/utils.js à côté — importons-le
import { addition, factorielle, PI } from "./utils.js";

console.log("--- Import depuis un fichier local ---");
console.log(`addition(3, 4)   = ${addition(3, 4)}`);
console.log(`factorielle(6)   = ${factorielle(6)}`);
console.log(`PI               = ${PI}`);

process.exit();

// ------------------------------------------
// 2. Export nommé vs export default
// ------------------------------------------

console.log("\n--- Export nommé vs default ---");

// Export nommé : on choisit ce qu'on importe
// import { addition, PI } from "./utils.js"

// Export default : un seul export principal par fichier
// import maFonction from "./mon-module.js"
// (pas de { }, on peut renommer librement)

import saluer from "./saluer.js";
console.log(saluer("Alice"));
console.log(saluer("Bob"));

process.exit();

// ------------------------------------------
// 3. Renommer à l'import
// ------------------------------------------

console.log("\n--- Renommer à l'import ---");

import { addition as add, PI as pi } from "./utils.js";
console.log(`add(10, 20) = ${add(10, 20)}`);
console.log(`pi = ${pi}`);

process.exit();

// ------------------------------------------
// 4. Importer tout un module
// ------------------------------------------

console.log("\n--- Import * ---");

import * as utils from "./utils.js";
console.log(`utils.addition(1, 2) = ${utils.addition(1, 2)}`);
console.log(`utils.PI = ${utils.PI}`);
console.log("Contenu du module :", Object.keys(utils));

process.exit();

// ------------------------------------------
// 5. Importer un package npm
// ------------------------------------------

console.log("\n--- Import depuis npm ---");

// Avec Bun, pas besoin de npm install d'abord !
// bun add <package> installe, puis on importe normalement

// Exemple (si chalk est installé) :
// import chalk from "chalk";
// console.log(chalk.green("Tout est vert !"));

// Les packages npm s'importent par nom (pas de ./ devant)
// import express from "express";     ← package npm
// import { foo } from "./foo.js";    ← fichier local

console.log("Packages npm : import par nom (sans ./)");
console.log("Fichiers locaux : import par chemin (avec ./)");

// ------------------------------------------
// Récap
// ------------------------------------------

console.log("\n--- Récap modules ---");
console.log("export function foo() {}   → export nommé");
console.log("export default function()  → export par défaut");
console.log("import { foo } from '...'  → import nommé");
console.log("import bar from '...'      → import default");
console.log("import * as mod from '...' → tout importer");
