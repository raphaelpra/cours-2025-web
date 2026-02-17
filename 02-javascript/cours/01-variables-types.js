// ============================================
// 01 — Variables et types
// Exécuter avec : bun run cours/01-variables-types.js
// ============================================

// ------------------------------------------
// 1. Variables : let et const
// ------------------------------------------

const NOM_DU_COURS = "Web";  // constante — ne peut pas changer
let compteur = 0;            // variable — peut changer

compteur += 1;
console.log(`Cours : ${NOM_DU_COURS}, compteur : ${compteur}`);

// ⚠️ Ne JAMAIS utiliser var — préférer let ou const
// var est l'ancienne syntaxe, elle a des comportements surprenants

process.exit();

// ------------------------------------------
// 2. Types de données
// ------------------------------------------

// Nombres (tous en virgule flottante 64 bits — pas de int !)
const entier = 42;
const decimal = 3.14;
const resultat = 2 ** 10;  // puissance : 1024
console.log(`entier: ${entier}, decimal: ${decimal}, 2^10: ${resultat}`);

// ⚠️ Attention à la précision flottante
console.log(`0.1 + 0.2 === 0.3 ? ${0.1 + 0.2 === 0.3}`);  // false !
console.log(`0.1 + 0.2 = ${0.1 + 0.2}`);                    // 0.30000000000000004

// Chaînes de caractères
const prenom = "Alice";
const message = `Bonjour ${prenom}, nous sommes le ${new Date().toLocaleDateString("fr-FR")}`;
console.log(message);

// Booléens
const estVrai = true;
const estFaux = false;
console.log(`true && false = ${estVrai && estFaux}`);   // AND
console.log(`true || false = ${estVrai || estFaux}`);   // OR
console.log(`!true = ${!estVrai}`);                     // NOT

// null et undefined
let nonInitialise;               // undefined — pas encore de valeur
const vide = null;               // null — volontairement vide
console.log(`undefined: ${nonInitialise}, null: ${vide}`);

// typeof pour connaître le type
console.log(`typeof 42 = ${typeof 42}`);
console.log(`typeof "hello" = ${typeof "hello"}`);
console.log(`typeof true = ${typeof true}`);
console.log(`typeof null = ${typeof null}`);  // "object" — un bug historique !
