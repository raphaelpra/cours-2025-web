// ============================================
// 09 — Asynchronisme : fetch, promises, async/await
// Exécuter avec : bun run cours/09-async.js
// ============================================

// ------------------------------------------
// 1. Pourquoi l'asynchronisme ?
// ------------------------------------------

// Un appel réseau prend entre 50ms et plusieurs secondes.
// Pendant ce temps, on ne veut pas bloquer tout le programme !
// JavaScript utilise des Promises pour gérer ça.


// ------------------------------------------
// 2. fetch() — requêtes HTTP
// ------------------------------------------

console.log("--- fetch() basique ---");

// fetch() permet de récupérer des données depuis une URL
// Ici on récupère une blague aléatoire via une API publique
const response = await fetch("https://official-joke-api.appspot.com/random_joke");
const joke = await response.json();

console.log(`😄 ${joke.setup}`);
console.log(`   → ${joke.punchline}`);
console.log();

process.exit();

// ------------------------------------------
// 3. Anatomie d'un fetch
// ------------------------------------------

console.log("--- Anatomie d'un fetch ---");

// fetch() retourne une Promise<Response>
// .json() retourne une Promise<Object>

// Équivalent avec .then() (ancienne syntaxe) :
// fetch(url)
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error(error));

// Avec async/await (syntaxe moderne, plus lisible) :
async function getRandomUser() {
    const res = await fetch("https://randomuser.me/api/");
    const data = await res.json();
    const user = data.results[0];
    return {
        nom: `${user.name.first} ${user.name.last}`,
        pays: user.location.country,
        email: user.email,
    };
}

const user = await getRandomUser();
console.log("Utilisateur aléatoire :", user);
console.log();


// ------------------------------------------
// 4. Gestion des erreurs
// ------------------------------------------

console.log("--- Gestion des erreurs ---");

async function fetchAvecGestionErreur(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return await res.json();
    } catch (erreur) {
        console.error(`❌ Erreur pour ${url}: ${erreur.message}`);
        return null;
    }
}

// URL valide
const ok = await fetchAvecGestionErreur("https://httpbin.org/json");
console.log("Réponse OK :", ok !== null ? "oui" : "non");

// URL invalide
const ko = await fetchAvecGestionErreur("https://httpbin.org/status/404");
console.log("Réponse KO :", ko !== null ? "oui" : "non");
console.log();


// ------------------------------------------
// 5. Requêtes en parallèle avec Promise.all
// ------------------------------------------

console.log("--- Requêtes en parallèle ---");

// Lancer 3 requêtes en même temps (pas l'une après l'autre)
const debut = Date.now();

const urls = [
    "https://official-joke-api.appspot.com/random_joke",
    "https://official-joke-api.appspot.com/random_joke",
    "https://official-joke-api.appspot.com/random_joke",
];

// Promise.all attend que TOUTES les promises soient résolues
const resultats = await Promise.all(
    urls.map(url => fetch(url).then(r => r.json()))
);

const duree = Date.now() - debut;
console.log(`3 blagues récupérées en ${duree}ms (en parallèle) :`);
for (const blague of resultats) {
    console.log(`  • ${blague.setup} → ${blague.punchline}`);
}
console.log();


// ------------------------------------------
// 6. Créer ses propres Promises
// ------------------------------------------

console.log("--- Créer une Promise ---");

// Simuler une opération lente
function attendreMs(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(ms), ms);
    });
}

console.log("Attente de 500ms...");
const ms = await attendreMs(500);
console.log(`Terminé après ${ms}ms`);
console.log();


// ------------------------------------------
// 7. Fetch avancé : POST avec un body JSON
// ------------------------------------------

console.log("--- POST request ---");

const postResponse = await fetch("https://httpbin.org/post", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        message: "Hello depuis Bun !",
        timestamp: Date.now(),
    }),
});

const postData = await postResponse.json();
console.log("Données envoyées (écho du serveur) :", JSON.parse(postData.data));

console.log("\n✅ Démos async terminées !");
