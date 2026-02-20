// wiki.js — notre premier appel API !

// L'URL de l'API Wikipedia pour le résumé d'un article
const url = "https://fr.wikipedia.org/api/rest_v1/page/summary/Paris";

// fetch() envoie une requête HTTP et retourne une Promise
const response = await fetch(url);

// .json() parse la réponse en objet JavaScript (aussi une Promise)
const data = await response.json();

// Affichons ce qu'on a reçu
console.log("Titre :", data.title);
console.log("Description :", data.description);
console.log();
console.log("Résumé :", data.extract);
