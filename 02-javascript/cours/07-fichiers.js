// ============================================
// 07 — Lire et écrire des fichiers avec Bun
// Exécuter avec : bun run cours/07-fichiers.js
// ============================================

// ------------------------------------------
// 1. Lire un fichier texte
// ------------------------------------------

console.log("--- Lecture de fichier ---");

// Bun.file() crée une référence vers un fichier
// .text() retourne une Promise avec le contenu en string
const fichier = Bun.file("programme.md");

// On utilise await pour attendre le résultat
const contenu = await fichier.text();
console.log(`Taille du fichier : ${contenu.length} caractères`);
console.log(`Premières lignes :`);
console.log(contenu.split("\n").slice(0, 5).join("\n"));
console.log("...\n");

process.exit();

// ------------------------------------------
// 2. Écrire un fichier
// ------------------------------------------

console.log("--- Écriture de fichier ---");

const donnees = {
    cours: "JavaScript",
    date: new Date().toISOString(),
    etudiants: ["Alice", "Bob", "Charlie"],
    note_moyenne: 15.5,
};

// Bun.write() écrit dans un fichier (crée ou écrase)
await Bun.write("perso-donnees.json", JSON.stringify(donnees, null, 2));
console.log("Fichier perso-donnees.json écrit !");

// Relire pour vérifier
const relu = await Bun.file("perso-donnees.json").json(); // .json() parse directement !
console.log("Relu :", relu);
console.log(`Type de relu.etudiants : ${typeof relu.etudiants}, est un Array ? ${Array.isArray(relu.etudiants)}`);


// ------------------------------------------
// 3. Vérifier si un fichier existe
// ------------------------------------------

console.log("\n--- Existence de fichier ---");

const existe = await Bun.file("programme.md").exists();
const nexistePas = await Bun.file("inexistant.txt").exists();
console.log(`programme.md existe ? ${existe}`);
console.log(`inexistant.txt existe ? ${nexistePas}`);
