// ============================================
// 05 — Classes
// Exécuter avec : bun run cours/05-classes.js
// ============================================

class Animal {
    // Constructeur — comme __init__ en Python
    constructor(nom, espece) {
        this.nom = nom;       // this = self en Python
        this.espece = espece;
    }

    // Méthode — pas besoin de self en paramètre !
    sePresenter() {
        return `Je suis ${this.nom}, un ${this.espece}`;
    }
}

class Chien extends Animal {
    #nombreDOs = 0;  // propriété privée (avec #)

    constructor(nom, race) {
        super(nom, "chien");  // appel du constructeur parent
        this.race = race;
    }

    aboyer() {
        this.#nombreDOs++;
        return "Wouf !";
    }

    get os() {
        return this.#nombreDOs;
    }

    sePresenter() {
        return `${super.sePresenter()} (${this.race}, ${this.#nombreDOs} os rongés)`;
    }
}

const rex = new Chien("Rex", "berger allemand");
console.log(rex.sePresenter());

process.exit();

rex.aboyer();
rex.aboyer();
console.log(`Os rongés : ${rex.os}`);
console.log(rex.sePresenter());
