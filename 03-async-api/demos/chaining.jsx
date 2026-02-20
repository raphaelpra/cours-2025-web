import { useState, useEffect, useRef, useCallback } from "react";

// ─── SCENARIO DEFINITIONS ───

const SCENARIOS = [
  {
    id: "chain",
    title: ".then().then()",
    subtitle: "Chaînage simple",
    color: "#a855f7",
    code: [
      { text: 'fetch("/api/user")', color: "#3b82f6" },
      { text: "  .then(response => {", color: "#a855f7" },
      { text: '    console.log("Réponse reçue");', color: "#a855f7" },
      { text: "    return response.json();", color: "#a855f7" },
      { text: "  })", color: "#a855f7" },
      { text: "  .then(data => {", color: "#c084fc" },
      { text: '    console.log("Data:", data.name);', color: "#c084fc" },
      { text: "  });", color: "#c084fc" },
      { text: "", color: null },
      { text: 'console.log("Suite du code");', color: "#22c55e" },
    ],
    steps: [
      {
        callStack: ["main()", "fetch(\"/api/user\")"],
        microQueue: [], callbackQueue: [], resolved: [],
        console: [], activeLines: [0], promiseStates: [],
        explanation: "fetch() est appelé. Il crée une Promise et lance une requête HTTP via le navigateur. Le moteur JS n'attend pas la réponse.",
        phase: "fetch",
      },
      {
        callStack: ["main()", ".then().then()"],
        microQueue: [], callbackQueue: [], resolved: [],
        console: [], activeLines: [1, 4, 5, 7], promiseStates: [
          { label: "fetch()", state: "pending", color: "#f59e0b" },
          { label: ".then() #1", state: "en attente de fetch", color: "#64748b" },
          { label: ".then() #2", state: "en attente de #1", color: "#64748b" },
        ],
        explanation: "Les .then() sont enregistrés et forment une CHAÎNE. Chaque .then() crée une nouvelle Promise qui dépend du résultat du précédent. Rien ne s'exécute encore !",
        phase: "register",
      },
      {
        callStack: ["main()", 'console.log("Suite")'],
        microQueue: [], callbackQueue: [], resolved: [],
        console: [], activeLines: [9], promiseStates: [
          { label: "fetch()", state: "pending ⏳", color: "#f59e0b" },
          { label: ".then() #1", state: "en attente", color: "#64748b" },
          { label: ".then() #2", state: "en attente", color: "#64748b" },
        ],
        explanation: "Le code synchrone continue. Pendant ce temps, la requête réseau tourne en arrière-plan. Les .then() attendent sagement.",
        phase: "sync",
      },
      {
        callStack: [],
        microQueue: [], callbackQueue: [], resolved: [],
        console: ["Suite du code"], activeLines: [9], promiseStates: [
          { label: "fetch()", state: "pending ⏳", color: "#f59e0b" },
          { label: ".then() #1", state: "en attente", color: "#64748b" },
          { label: ".then() #2", state: "en attente", color: "#64748b" },
        ],
        explanation: "\"Suite du code\" s'affiche EN PREMIER. Le script principal est terminé. La Stack est vide. On attend la réponse réseau…",
        phase: "waiting",
      },
      {
        callStack: [],
        microQueue: ["then #1 (response => …)"], callbackQueue: [], resolved: ["fetch()"],
        console: ["Suite du code"], activeLines: [], promiseStates: [
          { label: "fetch()", state: "✅ resolved", color: "#22c55e" },
          { label: ".then() #1", state: "→ microtask queue", color: "#a855f7" },
          { label: ".then() #2", state: "en attente de #1", color: "#64748b" },
        ],
        explanation: "La réponse arrive ! fetch() est résolu → le callback du premier .then() entre dans la Microtask Queue. Le deuxième .then() attend encore : il dépend du RÉSULTAT du premier.",
        phase: "resolve1",
      },
      {
        callStack: ["then #1 (response => …)"],
        microQueue: [], callbackQueue: [], resolved: ["fetch()"],
        console: ["Suite du code", "Réponse reçue"], activeLines: [1, 2, 3, 4], promiseStates: [
          { label: "fetch()", state: "✅ resolved", color: "#22c55e" },
          { label: ".then() #1", state: "⚙️ en cours…", color: "#a855f7" },
          { label: ".then() #2", state: "en attente de #1", color: "#64748b" },
        ],
        explanation: "Le premier .then() s'exécute ! Il affiche \"Réponse reçue\" et fait return response.json(). Ce return est CRUCIAL — c'est cette valeur qui sera passée au .then() suivant.",
        phase: "exec1",
      },
      {
        callStack: [],
        microQueue: ["then #2 (data => …)"], callbackQueue: [], resolved: ["fetch()", "then #1"],
        console: ["Suite du code", "Réponse reçue"], activeLines: [], promiseStates: [
          { label: "fetch()", state: "✅ resolved", color: "#22c55e" },
          { label: ".then() #1", state: "✅ resolved → json", color: "#22c55e" },
          { label: ".then() #2", state: "→ microtask queue", color: "#c084fc" },
        ],
        explanation: "Le premier .then() a retourné response.json() → le deuxième .then() reçoit cette valeur et entre dans la Microtask Queue. La chaîne se déroule maillon par maillon !",
        phase: "chain2",
      },
      {
        callStack: ["then #2 (data => …)"],
        microQueue: [], callbackQueue: [], resolved: ["fetch()", "then #1", "then #2"],
        console: ["Suite du code", "Réponse reçue", "Data: Alice"], activeLines: [5, 6, 7], promiseStates: [
          { label: "fetch()", state: "✅ resolved", color: "#22c55e" },
          { label: ".then() #1", state: "✅ resolved", color: "#22c55e" },
          { label: ".then() #2", state: "✅ resolved", color: "#22c55e" },
        ],
        explanation: "✅ Le deuxième .then() s'exécute avec data (le JSON parsé). Toute la chaîne est résolue ! Chaque .then() a attendu le résultat du précédent, dans l'ordre.",
        phase: "done",
      },
    ],
  },
  {
    id: "nested",
    title: "Promise dans .then()",
    subtitle: "Retourner une Promise",
    color: "#3b82f6",
    code: [
      { text: 'fetch("/api/user")', color: "#3b82f6" },
      { text: "  .then(response => response.json())", color: "#a855f7" },
      { text: "  .then(user => {", color: "#c084fc" },
      { text: "    // Retourne une NOUVELLE Promise !", color: "#64748b" },
      { text: '    return fetch("/api/posts/" + user.id);', color: "#f59e0b" },
      { text: "  })", color: "#c084fc" },
      { text: "  .then(response => response.json())", color: "#fb923c" },
      { text: "  .then(posts => {", color: "#ef4444" },
      { text: '    console.log("Posts:", posts.length);', color: "#ef4444" },
      { text: "  });", color: "#ef4444" },
    ],
    steps: [
      {
        callStack: [], microQueue: [], callbackQueue: [], resolved: [],
        console: [], activeLines: [0, 1, 2, 5, 6, 7, 9], promiseStates: [
          { label: "fetch #1 (user)", state: "pending ⏳", color: "#f59e0b" },
          { label: ".then() json", state: "en attente", color: "#64748b" },
          { label: ".then() user =>", state: "en attente", color: "#64748b" },
          { label: ".then() json #2", state: "en attente", color: "#64748b" },
          { label: ".then() posts =>", state: "en attente", color: "#64748b" },
        ],
        explanation: "Toute la chaîne est enregistrée d'un coup. 4 .then() qui dépendent les uns des autres. Le premier fetch est en cours…",
        phase: "register",
      },
      {
        callStack: ["then (response => json())"],
        microQueue: [], callbackQueue: [], resolved: ["fetch #1"],
        console: [], activeLines: [1], promiseStates: [
          { label: "fetch #1 (user)", state: "✅ resolved", color: "#22c55e" },
          { label: ".then() json", state: "⚙️ en cours", color: "#a855f7" },
          { label: ".then() user =>", state: "en attente", color: "#64748b" },
          { label: ".then() json #2", state: "en attente", color: "#64748b" },
          { label: ".then() posts =>", state: "en attente", color: "#64748b" },
        ],
        explanation: "Fetch #1 revient. Le premier .then() parse le JSON. Simple, il retourne une valeur → le .then() suivant la recevra directement.",
        phase: "exec1",
      },
      {
        callStack: ["then (user => fetch(...))"],
        microQueue: [], callbackQueue: [], resolved: ["fetch #1", "json"],
        console: [], activeLines: [2, 3, 4, 5], promiseStates: [
          { label: "fetch #1 (user)", state: "✅", color: "#22c55e" },
          { label: ".then() json", state: "✅", color: "#22c55e" },
          { label: ".then() user =>", state: "⚙️ en cours", color: "#c084fc" },
          { label: ".then() json #2", state: "en attente", color: "#64748b" },
          { label: ".then() posts =>", state: "en attente", color: "#64748b" },
        ],
        explanation: "⚡ MOMENT CLÉ : ce .then() fait return fetch(\"/api/posts/\"). Il retourne une NOUVELLE Promise ! Que se passe-t-il pour la suite de la chaîne ?",
        phase: "key-moment",
      },
      {
        callStack: [],
        microQueue: [], callbackQueue: [], resolved: ["fetch #1", "json"],
        console: [], activeLines: [4], promiseStates: [
          { label: "fetch #1 (user)", state: "✅", color: "#22c55e" },
          { label: ".then() json", state: "✅", color: "#22c55e" },
          { label: ".then() user =>", state: "⏳ attend fetch #2", color: "#f59e0b" },
          { label: "→ fetch #2 (posts)", state: "pending ⏳", color: "#f59e0b" },
          { label: ".then() json #2", state: "⛔ bloqué", color: "#64748b" },
          { label: ".then() posts =>", state: "⛔ bloqué", color: "#64748b" },
        ],
        explanation: "Quand un .then() retourne une Promise, la chaîne ATTEND que cette Promise soit résolue. Les .then() suivants sont bloqués tant que le 2e fetch n'a pas répondu !",
        phase: "waiting-nested",
      },
      {
        callStack: ["then (response => json())"],
        microQueue: [], callbackQueue: [], resolved: ["fetch #1", "json", "fetch #2"],
        console: [], activeLines: [6], promiseStates: [
          { label: "fetch #1 (user)", state: "✅", color: "#22c55e" },
          { label: ".then() json", state: "✅", color: "#22c55e" },
          { label: ".then() user =>", state: "✅", color: "#22c55e" },
          { label: "fetch #2 (posts)", state: "✅ resolved", color: "#22c55e" },
          { label: ".then() json #2", state: "⚙️ en cours", color: "#fb923c" },
          { label: ".then() posts =>", state: "en attente", color: "#64748b" },
        ],
        explanation: "Fetch #2 revient ! La chaîne reprend. Le JSON est parsé. Tout se déroule séquentiellement, mais de manière non-bloquante. C'est la puissance des Promises !",
        phase: "resume",
      },
      {
        callStack: ["then (posts => …)"],
        microQueue: [], callbackQueue: [], resolved: ["fetch #1", "json", "fetch #2", "json#2"],
        console: ["Posts: 42"], activeLines: [7, 8, 9], promiseStates: [
          { label: "fetch #1 (user)", state: "✅", color: "#22c55e" },
          { label: ".then() json", state: "✅", color: "#22c55e" },
          { label: ".then() user =>", state: "✅", color: "#22c55e" },
          { label: "fetch #2 (posts)", state: "✅", color: "#22c55e" },
          { label: ".then() json #2", state: "✅", color: "#22c55e" },
          { label: ".then() posts =>", state: "✅ resolved", color: "#22c55e" },
        ],
        explanation: "✅ Toute la chaîne est résolue. On a fait 2 appels réseau SÉQUENTIELS grâce au chaînage. Le 2e fetch attendait le résultat du 1er pour connaître user.id.",
        phase: "done",
      },
    ],
  },
  {
    id: "catch",
    title: ".catch()",
    subtitle: "Gestion d'erreurs",
    color: "#ef4444",
    code: [
      { text: 'fetch("/api/data")', color: "#3b82f6" },
      { text: "  .then(response => {", color: "#a855f7" },
      { text: "    if (!response.ok)", color: "#a855f7" },
      { text: '      throw new Error("HTTP " + response.status);', color: "#ef4444" },
      { text: "    return response.json();", color: "#a855f7" },
      { text: "  })", color: "#a855f7" },
      { text: "  .then(data => {", color: "#c084fc" },
      { text: '    console.log("Succès:", data);', color: "#c084fc" },
      { text: "  })", color: "#c084fc" },
      { text: "  .catch(err => {", color: "#ef4444" },
      { text: '    console.log("Erreur:", err.message);', color: "#ef4444" },
      { text: "  });", color: "#ef4444" },
    ],
    steps: [
      {
        callStack: [], microQueue: [], callbackQueue: [], resolved: [],
        console: [], activeLines: [0, 1, 5, 6, 8, 9, 11], promiseStates: [
          { label: "fetch()", state: "pending ⏳", color: "#f59e0b" },
          { label: ".then() #1 check", state: "en attente", color: "#64748b" },
          { label: ".then() #2 data", state: "en attente", color: "#64748b" },
          { label: ".catch() err", state: "en attente", color: "#64748b" },
        ],
        explanation: "La chaîne a 2 .then() et un .catch() à la fin. Le .catch() fonctionne comme un filet de sécurité — il attrape les erreurs de N'IMPORTE QUEL maillon précédent.",
        phase: "register",
      },
      {
        callStack: ["then #1 (response => …)"],
        microQueue: [], callbackQueue: [], resolved: ["fetch()"],
        console: [], activeLines: [1, 2, 3], promiseStates: [
          { label: "fetch()", state: "✅ resolved (404)", color: "#f59e0b" },
          { label: ".then() #1 check", state: "⚙️ en cours", color: "#a855f7" },
          { label: ".then() #2 data", state: "en attente", color: "#64748b" },
          { label: ".catch() err", state: "en attente", color: "#64748b" },
        ],
        explanation: "Le serveur répond avec un 404. ⚠️ Attention : fetch() ne rejette PAS sur un 404 ! La Promise est résolue, mais response.ok est false. C'est à nous de vérifier.",
        phase: "check",
      },
      {
        callStack: ['throw new Error("HTTP 404")'],
        microQueue: [], callbackQueue: [], resolved: ["fetch()"],
        console: [], activeLines: [3], promiseStates: [
          { label: "fetch()", state: "✅ resolved (404)", color: "#f59e0b" },
          { label: ".then() #1 check", state: "💥 throw Error!", color: "#ef4444" },
          { label: ".then() #2 data", state: "en attente", color: "#64748b" },
          { label: ".catch() err", state: "en attente", color: "#64748b" },
        ],
        explanation: "💥 On lance une erreur avec throw ! Quand une erreur est lancée dans un .then(), la Promise retournée par ce .then() est REJETÉE (rejected).",
        phase: "throw",
      },
      {
        callStack: [],
        microQueue: [], callbackQueue: [], resolved: ["fetch()"],
        console: [], activeLines: [], promiseStates: [
          { label: "fetch()", state: "✅", color: "#22c55e" },
          { label: ".then() #1", state: "❌ rejected", color: "#ef4444" },
          { label: ".then() #2 data", state: "⏭ SAUTÉ", color: "#64748b" },
          { label: ".catch() err", state: "→ va s'exécuter", color: "#ef4444" },
        ],
        explanation: "L'erreur \"saute\" par-dessus le .then() #2 ! Quand une Promise est rejetée, les .then() suivants sont IGNORÉS jusqu'au prochain .catch(). C'est comme un try/catch.",
        phase: "skip",
      },
      {
        callStack: ["catch (err => …)"],
        microQueue: [], callbackQueue: [], resolved: ["fetch()"],
        console: ["Erreur: HTTP 404"], activeLines: [9, 10, 11], promiseStates: [
          { label: "fetch()", state: "✅", color: "#22c55e" },
          { label: ".then() #1", state: "❌", color: "#ef4444" },
          { label: ".then() #2", state: "⏭ sauté", color: "#64748b" },
          { label: ".catch()", state: "✅ erreur attrapée", color: "#ef4444" },
        ],
        explanation: "Le .catch() attrape l'erreur et s'exécute. Il reçoit l'objet Error en paramètre. Le programme ne crash PAS — l'erreur est gérée proprement.",
        phase: "caught",
      },
      {
        callStack: [],
        microQueue: [], callbackQueue: [], resolved: [],
        console: ["Erreur: HTTP 404"], activeLines: [], promiseStates: [
          { label: "fetch()", state: "✅", color: "#22c55e" },
          { label: ".then() #1", state: "❌ rejected", color: "#ef4444" },
          { label: ".then() #2", state: "⏭ sauté", color: "#64748b" },
          { label: ".catch()", state: "✅ géré", color: "#22c55e" },
        ],
        explanation: "✅ Terminé. Sans le .catch(), l'erreur aurait été silencieuse (\"Unhandled Promise Rejection\"). Règle : TOUJOURS mettre un .catch() à la fin de vos chaînes !",
        phase: "done",
      },
    ],
  },
  {
    id: "catch-recover",
    title: ".catch() → .then()",
    subtitle: "Récupérer après une erreur",
    color: "#f59e0b",
    code: [
      { text: 'fetch("/api/user")', color: "#3b82f6" },
      { text: "  .then(r => r.json())", color: "#a855f7" },
      { text: "  .catch(err => {", color: "#ef4444" },
      { text: '    console.log("Erreur réseau, fallback");', color: "#ef4444" },
      { text: '    return { name: "Utilisateur hors-ligne" };', color: "#f59e0b" },
      { text: "  })", color: "#ef4444" },
      { text: "  .then(user => {", color: "#22c55e" },
      { text: '    console.log("Utilisateur:", user.name);', color: "#22c55e" },
      { text: "  });", color: "#22c55e" },
    ],
    steps: [
      {
        callStack: [], microQueue: [], callbackQueue: [], resolved: [],
        console: [], activeLines: [0, 1, 2, 5, 6, 8], promiseStates: [
          { label: "fetch()", state: "pending ⏳", color: "#f59e0b" },
          { label: ".then() json", state: "en attente", color: "#64748b" },
          { label: ".catch()", state: "en attente", color: "#64748b" },
          { label: ".then() user", state: "en attente", color: "#64748b" },
        ],
        explanation: "Cette fois, le .catch() est AU MILIEU de la chaîne, pas à la fin. Il y a un .then() APRÈS le .catch(). Que se passe-t-il si le réseau échoue ?",
        phase: "register",
      },
      {
        callStack: [],
        microQueue: [], callbackQueue: [], resolved: [],
        console: [], activeLines: [0], promiseStates: [
          { label: "fetch()", state: "❌ rejected (réseau)", color: "#ef4444" },
          { label: ".then() json", state: "⏭ SAUTÉ", color: "#64748b" },
          { label: ".catch()", state: "→ va s'exécuter", color: "#ef4444" },
          { label: ".then() user", state: "en attente", color: "#64748b" },
        ],
        explanation: "Le réseau échoue ! fetch() est REJETÉ (pas de connexion). Le .then(r => r.json()) est sauté. L'erreur arrive au .catch().",
        phase: "reject",
      },
      {
        callStack: ["catch (err => …)"],
        microQueue: [], callbackQueue: [], resolved: [],
        console: ["Erreur réseau, fallback"], activeLines: [2, 3, 4, 5], promiseStates: [
          { label: "fetch()", state: "❌ rejected", color: "#ef4444" },
          { label: ".then() json", state: "⏭ sauté", color: "#64748b" },
          { label: ".catch()", state: "⚙️ en cours", color: "#ef4444" },
          { label: ".then() user", state: "en attente", color: "#64748b" },
        ],
        explanation: "Le .catch() s'exécute et fait return { name: \"Utilisateur hors-ligne\" }. ⚡ Point clé : quand un .catch() RETOURNE une valeur (sans throw), la chaîne REPREND normalement !",
        phase: "recover",
      },
      {
        callStack: ["then (user => …)"],
        microQueue: [], callbackQueue: [], resolved: [],
        console: ["Erreur réseau, fallback", "Utilisateur: Utilisateur hors-ligne"], activeLines: [6, 7, 8], promiseStates: [
          { label: "fetch()", state: "❌", color: "#ef4444" },
          { label: ".then() json", state: "⏭", color: "#64748b" },
          { label: ".catch()", state: "✅ récupéré", color: "#22c55e" },
          { label: ".then() user", state: "✅ exécuté !", color: "#22c55e" },
        ],
        explanation: "Le .then() après le .catch() S'EXÉCUTE ! Il reçoit la valeur de fallback. Le .catch() a \"réparé\" la chaîne. C'est un pattern puissant pour gérer les erreurs gracieusement.",
        phase: "resumed",
      },
      {
        callStack: [],
        microQueue: [], callbackQueue: [], resolved: [],
        console: ["Erreur réseau, fallback", "Utilisateur: Utilisateur hors-ligne"], activeLines: [], promiseStates: [
          { label: "fetch()", state: "❌ rejected", color: "#ef4444" },
          { label: ".then() json", state: "⏭ sauté", color: "#64748b" },
          { label: ".catch()", state: "✅ return valeur", color: "#22c55e" },
          { label: ".then() user", state: "✅ exécuté", color: "#22c55e" },
        ],
        explanation: "✅ Le .catch() peut RÉCUPÉRER une chaîne ! En retournant une valeur par défaut, les .then() suivants continuent comme si de rien n'était. Utile pour les fallbacks.",
        phase: "done",
      },
    ],
  },
];

// ─── COMPONENTS ───

function PromiseState({ item }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "6px 10px",
      background: `${item.color}0c`, borderRadius: 10, border: `1px solid ${item.color}25`,
      animation: "fadeUp 0.3s ease",
    }}>
      <div style={{
        fontSize: 12, fontWeight: 700, color: item.color,
        fontFamily: "'JetBrains Mono', monospace", minWidth: 120, whiteSpace: "nowrap",
      }}>{item.label}</div>
      <div style={{
        fontSize: 11.5, color: item.color === "#22c55e" ? "#6ee7b7" : item.color === "#ef4444" ? "#fca5a5" : "#94a3b8",
        fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
      }}>{item.state}</div>
    </div>
  );
}

function QueueBox({ items, color, label, icon, emptyText, highlight }) {
  return (
    <div style={{
      background: "rgba(10,10,18,0.8)", borderRadius: 14, padding: "12px 14px",
      minHeight: 70, border: highlight ? `2px solid ${color}66` : `1px solid ${color}18`,
      position: "relative", overflow: "hidden", transition: "all 0.4s",
      boxShadow: highlight ? `0 0 24px ${color}12` : "none",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${color}${highlight ? "99" : "33"}, transparent)`,
      }} />
      <div style={{
        fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2,
        color, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace",
      }}>{icon} {label}</div>
      {items.length === 0 ? (
        <div style={{ color: "#222", fontSize: 11, fontStyle: "italic", fontFamily: "'JetBrains Mono', monospace" }}>
          {emptyText}
        </div>
      ) : items.map((item, i) => (
        <div key={`${item}-${i}`} style={{
          background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 8,
          padding: "6px 10px", fontSize: 12, color: "#e2e8f0",
          fontFamily: "'JetBrains Mono', monospace", animation: "fadeUp 0.3s ease",
        }}>{item}</div>
      ))}
    </div>
  );
}

export default function PromiseChaining() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  const scenario = SCENARIOS[scenarioIdx];
  const current = scenario.steps[step];

  const next = useCallback(() => setStep(s => Math.min(s + 1, scenario.steps.length - 1)), [scenario]);
  const prev = useCallback(() => setStep(s => Math.max(s - 1, 0)), []);
  const reset = useCallback(() => { setStep(0); setIsPlaying(false); }, []);

  const selectScenario = useCallback((idx) => {
    setScenarioIdx(idx);
    setStep(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStep(s => {
          if (s >= scenario.steps.length - 1) { setIsPlaying(false); return s; }
          return s + 1;
        });
      }, 3800);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, scenario]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") { e.preventDefault(); setIsPlaying(p => !p); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const phaseColor = current.phase === "done" ? "#22c55e"
    : current.phase.includes("throw") || current.phase.includes("reject") || current.phase === "skip" ? "#ef4444"
    : current.phase.includes("recover") || current.phase === "resumed" ? "#f59e0b"
    : current.phase.includes("key") || current.phase.includes("waiting-nested") ? "#f59e0b"
    : scenario.color;

  return (
    <div style={{
      minHeight: "100vh", background: "#07070e", color: "#e2e8f0",
      fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: "20px 16px", boxSizing: "border-box",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 21, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
          Chaînage de <span style={{ color: "#a855f7" }}>Promises</span>
        </h1>
      </div>

      {/* Scenario tabs */}
      <div style={{
        display: "flex", gap: 6, justifyContent: "center", marginBottom: 18, flexWrap: "wrap",
      }}>
        {SCENARIOS.map((sc, i) => (
          <button key={sc.id} onClick={() => selectScenario(i)} style={{
            background: i === scenarioIdx ? `${sc.color}20` : "#0c0c18",
            color: i === scenarioIdx ? sc.color : "#4a5568",
            border: `1.5px solid ${i === scenarioIdx ? sc.color + "55" : "#1a1a2e"}`,
            borderRadius: 12, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", transition: "all 0.3s",
          }}>
            <div>{sc.title}</div>
            <div style={{ fontSize: 9, fontWeight: 400, opacity: 0.7, marginTop: 2 }}>{sc.subtitle}</div>
          </button>
        ))}
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
        {scenario.steps.map((_, i) => (
          <div key={i} onClick={() => { setStep(i); setIsPlaying(false); }} style={{
            width: i === step ? 24 : 9, height: 9, borderRadius: 5,
            background: i === step ? phaseColor : i < step ? `${phaseColor}44` : "#141420",
            transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer",
          }} />
        ))}
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Main grid: Code + Promise states */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {/* Code */}
          <div style={{
            background: "rgba(10,10,18,0.9)", borderRadius: 16, padding: "14px 16px",
            border: "1px solid #141425",
          }}>
            <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#22c55e" }} />
            </div>
            <pre style={{ margin: 0, fontSize: 12.5, lineHeight: 1.7, fontFamily: "'JetBrains Mono', monospace", overflowX: "auto" }}>
              {scenario.code.map((line, i) => {
                const isActive = current.activeLines.includes(i);
                const isPast = current.activeLines.length > 0 ? i < Math.min(...current.activeLines) : current.phase === "done";
                return (
                  <div key={i} style={{
                    padding: "1px 8px", borderRadius: 6,
                    background: isActive ? `${phaseColor}14` : "transparent",
                    borderLeft: isActive ? `3px solid ${phaseColor}` : "3px solid transparent",
                    color: isActive ? "#f1f5f9" : isPast ? "#252535" : (line.color || "#1a1a2a"),
                    transition: "all 0.3s",
                  }}>
                    <span style={{ color: "#1a1a2a", marginRight: 10, fontSize: 10, userSelect: "none" }}>
                      {String(i + 1).padStart(2, " ")}
                    </span>
                    {line.text || " "}
                  </div>
                );
              })}
            </pre>
          </div>

          {/* Promise chain state */}
          <div style={{
            background: "rgba(10,10,18,0.8)", borderRadius: 16, padding: "14px 16px",
            border: "1px solid #141425",
          }}>
            <div style={{
              fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2,
              color: "#64748b", marginBottom: 10, fontFamily: "'JetBrains Mono', monospace",
            }}>🔗 État de la chaîne</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {current.promiseStates.map((ps, i) => (
                <PromiseState key={`${ps.label}-${i}-${step}`} item={ps} />
              ))}
              {current.promiseStates.length === 0 && (
                <div style={{ color: "#222", fontSize: 11, fontStyle: "italic", fontFamily: "'JetBrains Mono', monospace" }}>
                  en attente…
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Queues */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
          <QueueBox
            items={[...current.callStack].reverse()}
            color="#22c55e" label="Call Stack" icon="📚"
            emptyText="vide"
            highlight={current.callStack.length > 0}
          />
          <QueueBox
            items={current.microQueue}
            color="#a855f7" label="Microtask Queue" icon="⚡"
            emptyText="vide"
            highlight={current.microQueue.length > 0}
          />
          <div style={{
            background: "rgba(10,10,18,0.8)", borderRadius: 14, padding: "12px 14px",
            minHeight: 70, border: "1px solid #1a1a2e",
          }}>
            <div style={{
              fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2,
              color: "#4a5568", marginBottom: 8, fontFamily: "'JetBrains Mono', monospace",
            }}>🖥 Console</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {current.console.length === 0 ? (
                <span style={{ color: "#1a1a2a", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>_</span>
              ) : current.console.map((line, i) => {
                const isErr = line.startsWith("Erreur");
                const isLast = i === current.console.length - 1;
                return (
                  <div key={`${line}-${i}`} style={{
                    fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                    color: isErr ? "#fca5a5" : isLast ? "#6ee7b7" : "#4a5568",
                    animation: isLast ? "fadeUp 0.35s ease" : "none",
                  }}>
                    <span style={{ color: "#252535", marginRight: 4 }}>›</span>{line}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div key={`${scenarioIdx}-${step}`} style={{
          background: `${phaseColor}0a`, border: `1px solid ${phaseColor}25`,
          borderRadius: 16, padding: "14px 18px", marginBottom: 16,
          animation: "fadeUp 0.4s ease",
        }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#b0bcc8" }}>
            <span style={{ color: phaseColor, fontWeight: 800, fontSize: 16, marginRight: 8 }}>
              {step + 1}.
            </span>
            {current.explanation}
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <button onClick={reset} style={{
            background: "#0c0c18", color: "#4a5568", border: "1px solid #1a1a2e",
            borderRadius: 12, padding: "10px 18px", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Inter', sans-serif",
          }}>↺</button>
          <button onClick={prev} disabled={step === 0} style={{
            background: step === 0 ? "#07070e" : "#0c0c18",
            color: step === 0 ? "#141420" : "#e2e8f0",
            border: "1px solid #1a1a2e", borderRadius: 12, padding: "10px 18px",
            fontSize: 13, fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer",
            fontFamily: "'Inter', sans-serif",
          }}>←</button>
          <button onClick={() => setIsPlaying(p => !p)} style={{
            background: isPlaying ? "linear-gradient(135deg, #dc2626, #ef4444)" : `linear-gradient(135deg, ${scenario.color}, ${scenario.color}99)`,
            color: "#fff", border: "none", borderRadius: 12, padding: "10px 28px",
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif",
            boxShadow: `0 4px 16px ${isPlaying ? "#dc262633" : scenario.color + "22"}`,
          }}>{isPlaying ? "⏸" : "▶"}</button>
          <button onClick={next} disabled={step === scenario.steps.length - 1} style={{
            background: step === scenario.steps.length - 1 ? "#07070e" : "#0c0c18",
            color: step === scenario.steps.length - 1 ? "#141420" : "#e2e8f0",
            border: "1px solid #1a1a2e", borderRadius: 12, padding: "10px 18px",
            fontSize: 13, fontWeight: 600,
            cursor: step === scenario.steps.length - 1 ? "not-allowed" : "pointer",
            fontFamily: "'Inter', sans-serif",
          }}>→</button>
        </div>

        <p style={{
          textAlign: "center", fontSize: 10, color: "#1e1e30", marginTop: 10,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          ← → naviguer · Espace play/pause
        </p>
      </div>
    </div>
  );
}
