// ============================================
// 99 — WAT : les pièges de JavaScript
// Exécuter avec : bun run cours/99-wat.js
//
// Inspiré de "Wat" par Gary Bernhardt (CodeMash 2012)
// https://www.destroyallsoftware.com/talks/wat
// ============================================

// Déplacez le process.exit() vers le bas au fur et à mesure !

// --- WAT #1 : l'addition de tableaux ---
console.log("[] + []  =", [] + []);

process.exit();

// --- WAT #2 : tableau + objet ---
console.log("[] + {}  =", [] + {});
process.exit();

// --- WAT #3 : objet + tableau ---
console.log("{} + []  =", {} + []);
// Testez dans la console du navigateur ou node : {} + [] donne 0 !
process.exit();

// --- WAT #4 : objet + objet ---
console.log("{} + {}  =", {} + {});
// Testez dans la console du navigateur ou node : {} + {} donne NaN !
process.exit();

// --- WAT #5 : le + unaire sur un tableau vide ---
console.log("+[]      =", +[]);
process.exit();

// --- WAT #6 : true + true + true ---
console.log("true + true + true =", true + true + true);
process.exit();

// --- WAT #7 : true - true ---
console.log("true - true =", true - true);
process.exit();

// --- WAT #8 : true == 1 mais true !== "1" ---
console.log('true == 1   →', true == 1);
console.log('true === 1  →', true === 1);
process.exit();

// --- WAT #9 : "5" + 3 vs "5" - 3 ---
console.log('"5" + 3 =', "5" + 3);
console.log('"5" - 3 =', "5" - 3);
process.exit();

// --- WAT #10 : NaN, le menteur ---
console.log("NaN === NaN →", NaN === NaN);
console.log("typeof NaN  →", typeof NaN);
process.exit();

// --- WAT #11 : typeof null ---
console.log("typeof null →", typeof null);
process.exit();

// --- WAT #12 : 0.1 + 0.2 ---
console.log("0.1 + 0.2 ===  0.3 →", 0.1 + 0.2 === 0.3);
console.log("0.1 + 0.2         =", 0.1 + 0.2);
process.exit();

// --- WAT #13 : comparaisons absurdes avec == ---
console.log('"" == false  →', "" == false);
console.log('"0" == false →', "0" == false);
console.log('"" == "0"    →', "" == "0");
process.exit();

// --- WAT #14 : l'infini ---
console.log("1/0          =", 1/0);
console.log("Infinity > Infinity →", Infinity > Infinity);
console.log("-Infinity < Infinity →", -Infinity < Infinity);
process.exit();

// --- WAT #15 : les bananes ---
console.log("'b'+'a'+ +'a'+'a' =", "b" + "a" + +"a" + "a");
process.exit();

// --- WAT #16 : sort() par défaut ---
console.log("[10,9,8,1,2,3].sort() =", [10, 9, 8, 1, 2, 3].sort());
process.exit();

// --- WAT #17 : Math.max() sans arguments ---
console.log("Math.max() =", Math.max());
console.log("Math.min() =", Math.min());
process.exit();

// --- WAT #18 : la virgule piégeuse ---
console.log("[,,,].length =", [,,,].length);
console.log("\n🎤 Voilà, c'était WAT. (https://www.destroyallsoftware.com/talks/wat)");
