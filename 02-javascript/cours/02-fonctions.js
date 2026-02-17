// ============================================
// 02 — Fonctions
// Exécuter avec : bun run cours/02-fonctions.js
// ============================================

// Fonction classique
function saluer(nom) {
    return `Bonjour ${nom} !`;
}
console.log(saluer("Bob"));

process.exit();

// Arrow function (similaire à lambda en Python)
const carre = (x) => x * x;
console.log(`carré de 7 = ${carre(7)}`);

// Arrow function avec corps
const decrire = (nom, age) => {
    const anneeNaissance = new Date().getFullYear() - age;
    return `${nom} est né·e en ${anneeNaissance}`;
};
console.log(decrire("Charlie", 20));

// Paramètres par défaut
const puissance = (base, exposant = 2) => base ** exposant;
console.log(`puissance(3) = ${puissance(3)}`);      // 9
console.log(`puissance(3, 4) = ${puissance(3, 4)}`); // 81
