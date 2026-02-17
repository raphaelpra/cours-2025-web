// ============================================
// 03 — Tableaux (Arrays)
// Exécuter avec : bun run cours/03-tableaux.js
// ============================================

const fruits = ["pomme", "banane", "orange", "kiwi"];
console.log(`fruits: ${fruits}`);
console.log(`longueur: ${fruits.length}`);
console.log(`premier: ${fruits[0]}, dernier: ${fruits[fruits.length - 1]}`);

process.exit();

// Ajouter / retirer
fruits.push("mangue");       // ajouter à la fin
const dernier = fruits.pop(); // retirer le dernier
console.log(`après push+pop: ${fruits}`);

// Itérer avec for...of (comme Python : for fruit in fruits)
for (const fruit of fruits) {
    process.stdout.write(`${fruit} `);
}
console.log();

// map — transformer chaque élément (comme une list comprehension)
const majuscules = fruits.map(f => f.toUpperCase());
console.log(`majuscules: ${majuscules}`);

// filter — garder certains éléments
const courtes = fruits.filter(f => f.length <= 5);
console.log(`mots courts: ${courtes}`);

// find — trouver le premier qui matche
const avecO = fruits.find(f => f.includes("o"));
console.log(`premier avec 'o': ${avecO}`);

// includes — vérifier la présence
console.log(`contient 'banane' ? ${fruits.includes("banane")}`);

// Destructuring
const [premier, deuxieme, ...reste] = fruits;
console.log(`premier: ${premier}, deuxieme: ${deuxieme}, reste: ${reste}`);
