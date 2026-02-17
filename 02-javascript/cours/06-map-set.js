// ============================================
// 06 — Map et Set
// Exécuter avec : bun run cours/06-map-set.js
// ============================================

// ------------------------------------------
// Map — équivalent de dict en Python
// ------------------------------------------

console.log("--- Map ---");

const scores = new Map();
scores.set("Alice", 95);
scores.set("Bob", 87);
scores.set("Charlie", 92);

console.log(`Score d'Alice : ${scores.get("Alice")}`);
console.log(`Bob existe ? ${scores.has("Bob")}`);

for (const [nom, score] of scores) {
    console.log(`  ${nom}: ${score}`);
}

process.exit();

// ------------------------------------------
// Set — pas de doublons
// ------------------------------------------

console.log("\n--- Set ---");

const unique = new Set([1, 2, 3, 2, 1, 4]);
console.log(`Set: ${[...unique]}`);  // [1, 2, 3, 4]
unique.add(5);
console.log(`Contient 3 ? ${unique.has(3)}`);
