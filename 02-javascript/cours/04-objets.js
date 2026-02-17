// ============================================
// 04 — Objets
// Exécuter avec : bun run cours/04-objets.js
// ============================================

// Créer un objet (similaire à un dict Python, mais c'est plus que ça)
const etudiant = {
    nom: "Alice",
    age: 21,
    formation: "Mines Paris",
    langages: ["Python", "C", "JavaScript"],
};

// Accéder aux propriétés
console.log(`nom: ${etudiant.nom}`);
console.log(`langages: ${etudiant.langages}`);

process.exit();

// Ajouter une propriété
etudiant.email = "alice@mines-paris.fr";

// Destructuring d'objet
const { nom, age, formation } = etudiant;
console.log(`${nom}, ${age} ans, ${formation}`);

// Itérer sur les clés
for (const [cle, valeur] of Object.entries(etudiant)) {
    console.log(`  ${cle}: ${valeur}`);
}

// Spread operator — fusionner des objets
const defaults = { theme: "dark", langue: "fr" };
const preferences = { langue: "en", taille: 14 };
const config = { ...defaults, ...preferences };
console.log("config:", config);  // langue: "en" (preferences écrase defaults)
