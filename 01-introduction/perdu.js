// === COMPTEUR DE CLICS ===
let clickCount = 0;
const h1 = document.querySelector("h1");
const h2 = document.querySelector("h2");
const pre = document.querySelector("pre");

const counter = document.createElement("div");
counter.style.position = "fixed";
counter.style.bottom = "20px";
counter.style.right = "20px";
counter.style.fontSize = "24px";
counter.style.fontFamily = "monospace";
counter.style.padding = "10px 20px";
counter.style.background = "#333";
counter.style.color = "#0f0";
counter.style.borderRadius = "10px";
counter.textContent = "Clics : 0";
document.body.appendChild(counter);

document.addEventListener("click", function() {
    clickCount++;
    counter.textContent = "Clics : " + clickCount;
    counter.style.transform = "scale(1.3)";
    setTimeout(function() { counter.style.transform = "scale(1)"; }, 200);
});

// === COULEUR ALÉATOIRE ===
function randomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// === H1 : CHANGE DE COULEUR AU CLIC ===
h1.style.cursor = "pointer";
h1.style.transition = "all 0.3s ease";
h1.style.userSelect = "none";

h1.addEventListener("click", function() {
    h1.style.color = randomColor();
    h1.style.fontSize = (Math.random() * 30 + 20) + "px";
    setTimeout(function() { h1.style.fontSize = ""; }, 500);
});

// === H2 : CLIGNOTEMENT ===
let visible = true;
setInterval(function() {
    visible = !visible;
    h2.style.opacity = visible ? "1" : "0";
}, 800);

// === PRE : SUIT LA SOURIS ===
document.addEventListener("mousemove", function(event) {
    const x = event.clientX;
    const y = event.clientY;
    const offsetX = (x - window.innerWidth / 2) / 20;
    const offsetY = (y - window.innerHeight / 2) / 20;
    pre.style.transform = "translate(" + offsetX + "px, " + offsetY + "px)";
});

// === FOND QUI CHANGE DE COULEUR EN CONTINU ===
let hue = 0;
setInterval(function() {
    hue = (hue + 1) % 360;
    document.body.style.backgroundColor = "hsl(" + hue + ", 70%, 95%)";
}, 50);

// === PLUIE DE CARACTÈRES AU CLIC ===
document.addEventListener("click", function(event) {
    const symbols = ["*", "✦", "✧", "●", "◆", "♦", "★", "☆", "♠", "♣"];
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement("span");
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.position = "fixed";
        particle.style.left = event.clientX + "px";
        particle.style.top = event.clientY + "px";
        particle.style.fontSize = (Math.random() * 20 + 10) + "px";
        particle.style.color = randomColor();
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "9999";
        particle.style.fontWeight = "bold";
        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 15;
        const velocity = Math.random() * 100 + 50;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;

        let posX = event.clientX;
        let posY = event.clientY;
        let opacity = 1;
        let frame = 0;

        function animate() {
            frame++;
            posX += dx / 30;
            posY += dy / 30 + frame * 0.1;
            opacity -= 0.02;
            particle.style.left = posX + "px";
            particle.style.top = posY + "px";
            particle.style.opacity = opacity;
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }
        requestAnimationFrame(animate);
    }
});

// === TEXTE QUI SE REMPLACE TOUT SEUL ===
const alternatives = [
    "Perdu sur l'Internet ?",
    "Lost on the Internet?",
    "¿Perdido en Internet?",
    "Im Internet verloren?",
    "インターネットで迷子？",
    "Потерялись в Интернете?",
    "迷失在互联网上？",
    "Perdido na Internet?",
];
let textIndex = 0;

setInterval(function() {
    textIndex = (textIndex + 1) % alternatives.length;
    h1.textContent = alternatives[textIndex];
}, 3000);

// === TOUCHE CLAVIER : SECOUER LA PAGE ===
document.addEventListener("keydown", function(event) {
    document.body.style.transition = "transform 0.1s";
    const shakeX = (Math.random() - 0.5) * 20;
    const shakeY = (Math.random() - 0.5) * 20;
    document.body.style.transform = "translate(" + shakeX + "px, " + shakeY + "px)";
    setTimeout(function() {
        document.body.style.transform = "translate(0, 0)";
    }, 100);

    const keyDisplay = document.createElement("div");
    keyDisplay.textContent = event.key;
    keyDisplay.style.position = "fixed";
    keyDisplay.style.left = Math.random() * (window.innerWidth - 50) + "px";
    keyDisplay.style.top = Math.random() * (window.innerHeight - 50) + "px";
    keyDisplay.style.fontSize = "48px";
    keyDisplay.style.fontWeight = "bold";
    keyDisplay.style.color = randomColor();
    keyDisplay.style.pointerEvents = "none";
    keyDisplay.style.zIndex = "9999";
    document.body.appendChild(keyDisplay);
    setTimeout(function() { keyDisplay.remove(); }, 1500);
});

// === MESSAGE CONSOLE POUR LES CURIEUX ===
console.log("🎉 Bravo ! Tu as ouvert la console développeur !");
console.log("💡 C'est ici qu'on débugue le JavaScript.");
console.log("👀 Essaie de taper : document.title = 'Trouvé !'");
