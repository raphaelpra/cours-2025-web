import { useState, useEffect, useRef, useCallback } from "react";

// ─── SCENARIOS ───

const SCENARIOS = [
  {
    id: "basic",
    title: "Bases",
    subtitle: "async/await = Promises",
    color: "#06b6d4",
    promiseCode: [
      { text: "function getUser() {", color: "#64748b" },
      { text: '  return fetch("/api/user")', color: "#3b82f6" },
      { text: "    .then(r => r.json())", color: "#a855f7" },
      { text: "    .then(user => {", color: "#c084fc" },
      { text: '      console.log("Salut", user.name);', color: "#c084fc" },
      { text: "      return user;", color: "#c084fc" },
      { text: "    });", color: "#c084fc" },
      { text: "}", color: "#64748b" },
    ],
    awaitCode: [
      { text: "async function getUser() {", color: "#06b6d4" },
      { text: '  const r = await fetch("/api/user");', color: "#3b82f6" },
      { text: "  const user = await r.json();", color: "#a855f7" },
      { text: '  console.log("Salut", user.name);', color: "#c084fc" },
      { text: "  return user;", color: "#c084fc" },
      { text: "}", color: "#06b6d4" },
    ],
    steps: [
      {
        promiseHL: [], awaitHL: [0],
        promiseStates: [],
        engine: { callStack: ["main()", "getUser()"], microQueue: [], console: [] },
        explanation: "Le mot-clé **async** devant la fonction signifie une seule chose : cette fonction retournera TOUJOURS une Promise, même si on n'écrit pas \"new Promise\".",
        phase: "intro",
        marker: null,
      },
      {
        promiseHL: [1], awaitHL: [1],
        promiseStates: [
          { label: "fetch()", state: "pending ⏳", color: "#f59e0b" },
        ],
        engine: { callStack: ["getUser()", "fetch()"], microQueue: [], console: [] },
        explanation: "fetch() est lancé — identique dans les deux cas. La requête part vers le serveur. Mais que fait **await** exactement ?",
        phase: "fetch",
        marker: "fetch identique",
      },
      {
        promiseHL: [1], awaitHL: [1],
        promiseStates: [
          { label: "fetch()", state: "pending ⏳", color: "#f59e0b" },
          { label: "await = pause ici", state: "⏸ fonction suspendue", color: "#06b6d4" },
        ],
        engine: { callStack: [], microQueue: [], console: [] },
        explanation: "⚡ **await SUSPEND la fonction** et libère la Call Stack ! La fonction \"se met en pause\" à cette ligne. Le reste du programme peut continuer. C'est EXACTEMENT comme un .then() — le code après le await ne s'exécutera que quand la Promise sera résolue.",
        phase: "suspend",
        marker: "await = .then()",
      },
      {
        promiseHL: [2], awaitHL: [1],
        promiseStates: [
          { label: "fetch()", state: "✅ resolved", color: "#22c55e" },
          { label: "await reprend →", state: "r = Response", color: "#06b6d4" },
        ],
        engine: { callStack: ["getUser() reprend", "r.json()"], microQueue: [], console: [] },
        explanation: "La réponse arrive ! **await déballe la Promise** : au lieu de recevoir une Promise, on reçoit directement la VALEUR (l'objet Response). Avec .then(), il fallait un callback — ici, on assigne simplement à une variable.",
        phase: "resume1",
        marker: "await déballe",
      },
      {
        promiseHL: [2, 3], awaitHL: [2],
        promiseStates: [
          { label: "fetch()", state: "✅", color: "#22c55e" },
          { label: "r.json()", state: "pending ⏳", color: "#f59e0b" },
          { label: "await #2", state: "⏸ pause à nouveau", color: "#06b6d4" },
        ],
        engine: { callStack: [], microQueue: [], console: [] },
        explanation: "r.json() retourne aussi une Promise → deuxième await, deuxième pause. Avec les .then(), il fallait chaîner. Avec await, on écrit ligne après ligne, comme du code synchrone !",
        phase: "suspend2",
        marker: "2e .then() = 2e await",
      },
      {
        promiseHL: [3, 4, 5], awaitHL: [3, 4],
        promiseStates: [
          { label: "fetch()", state: "✅", color: "#22c55e" },
          { label: "r.json()", state: "✅", color: "#22c55e" },
          { label: "user =", state: "{ name: \"Alice\" }", color: "#22c55e" },
        ],
        engine: { callStack: ["getUser() reprend"], microQueue: [], console: ["Salut Alice"] },
        explanation: "user contient directement l'objet JSON — pas besoin de callback ! Le console.log s'exécute. return user retourne la valeur, mais ENCAPSULÉE dans une Promise (car la fonction est async).",
        phase: "done",
        marker: "même résultat",
      },
    ],
  },
  {
    id: "sequential",
    title: "Séquentiel",
    subtitle: "Requêtes l'une après l'autre",
    color: "#a855f7",
    promiseCode: [
      { text: "function getUserPosts() {", color: "#64748b" },
      { text: '  return fetch("/api/user")', color: "#3b82f6" },
      { text: "    .then(r => r.json())", color: "#a855f7" },
      { text: "    .then(user => {", color: "#c084fc" },
      { text: '      return fetch("/api/posts/" + user.id);', color: "#f59e0b" },
      { text: "    })", color: "#c084fc" },
      { text: "    .then(r => r.json())", color: "#fb923c" },
      { text: "    .then(posts => {", color: "#ef4444" },
      { text: "      console.log(posts.length);", color: "#ef4444" },
      { text: "    });", color: "#ef4444" },
      { text: "}", color: "#64748b" },
    ],
    awaitCode: [
      { text: "async function getUserPosts() {", color: "#06b6d4" },
      { text: '  const r1 = await fetch("/api/user");', color: "#3b82f6" },
      { text: "  const user = await r1.json();", color: "#a855f7" },
      { text: "", color: null },
      { text: '  const r2 = await fetch("/api/posts/" + user.id);', color: "#f59e0b" },
      { text: "  const posts = await r2.json();", color: "#fb923c" },
      { text: "", color: null },
      { text: "  console.log(posts.length);", color: "#ef4444" },
      { text: "}", color: "#06b6d4" },
    ],
    steps: [
      {
        promiseHL: [1], awaitHL: [1],
        promiseStates: [
          { label: "fetch #1 (user)", state: "pending ⏳", color: "#f59e0b" },
        ],
        engine: { callStack: ["fetch(\"/api/user\")"], microQueue: [], console: [] },
        explanation: "Premier fetch lancé. Les deux versions font exactement la même chose — mais regardez la lisibilité à droite : on lit de haut en bas, comme du code normal.",
        phase: "fetch1",
        marker: null,
      },
      {
        promiseHL: [2, 3, 4], awaitHL: [2, 4],
        promiseStates: [
          { label: "fetch #1", state: "✅ resolved", color: "#22c55e" },
          { label: "user =", state: "{ id: 7 }", color: "#22c55e" },
          { label: "fetch #2 (posts)", state: "pending ⏳", color: "#f59e0b" },
        ],
        engine: { callStack: ["fetch(\"/api/posts/7\")"], microQueue: [], console: [] },
        explanation: "User reçu → on lance le 2e fetch avec user.id. Avec les Promises, il fallait return fetch(...) dans un .then(). Avec await, c'est juste la ligne suivante. Le 2e fetch DÉPEND du 1er — c'est pour ça qu'on les fait en séquence.",
        phase: "fetch2",
        marker: "return fetch → await fetch",
      },
      {
        promiseHL: [6, 7, 8], awaitHL: [5, 7],
        promiseStates: [
          { label: "fetch #1", state: "✅", color: "#22c55e" },
          { label: "fetch #2", state: "✅ resolved", color: "#22c55e" },
          { label: "posts =", state: "[...42 posts]", color: "#22c55e" },
        ],
        engine: { callStack: ["console.log(42)"], microQueue: [], console: ["42"] },
        explanation: "✅ Terminé ! Même résultat, mais comparez : à gauche 10 lignes avec des .then() imbriqués — à droite 8 lignes lisibles de haut en bas. Plus la chaîne est longue, plus await est lisible.",
        phase: "done",
        marker: null,
      },
    ],
  },
  {
    id: "trycatch",
    title: "try/catch",
    subtitle: ".catch() → try/catch",
    color: "#ef4444",
    promiseCode: [
      { text: 'fetch("/api/data")', color: "#3b82f6" },
      { text: "  .then(r => {", color: "#a855f7" },
      { text: "    if (!r.ok) throw new Error(r.status);", color: "#ef4444" },
      { text: "    return r.json();", color: "#a855f7" },
      { text: "  })", color: "#a855f7" },
      { text: "  .then(data => {", color: "#c084fc" },
      { text: '    console.log("OK:", data);', color: "#c084fc" },
      { text: "  })", color: "#c084fc" },
      { text: "  .catch(err => {", color: "#ef4444" },
      { text: '    console.log("Erreur:", err.message);', color: "#ef4444" },
      { text: "  });", color: "#ef4444" },
    ],
    awaitCode: [
      { text: "async function getData() {", color: "#06b6d4" },
      { text: "  try {", color: "#22c55e" },
      { text: '    const r = await fetch("/api/data");', color: "#3b82f6" },
      { text: "    if (!r.ok) throw new Error(r.status);", color: "#ef4444" },
      { text: "    const data = await r.json();", color: "#a855f7" },
      { text: '    console.log("OK:", data);', color: "#c084fc" },
      { text: "  } catch (err) {", color: "#ef4444" },
      { text: '    console.log("Erreur:", err.message);', color: "#ef4444" },
      { text: "  }", color: "#ef4444" },
      { text: "}", color: "#06b6d4" },
    ],
    steps: [
      {
        promiseHL: [0, 1, 2], awaitHL: [2, 3],
        promiseStates: [
          { label: "fetch()", state: "✅ resolved (404)", color: "#f59e0b" },
        ],
        engine: { callStack: ["check response.ok"], microQueue: [], console: [] },
        explanation: "Le serveur répond 404. fetch() est résolu (pas rejeté !). On vérifie response.ok → false → on lance une erreur. Même logique des deux côtés.",
        phase: "check",
        marker: "throw identique",
      },
      {
        promiseHL: [2, 8, 9], awaitHL: [3, 6, 7],
        promiseStates: [
          { label: "throw Error", state: "💥 erreur lancée", color: "#ef4444" },
          { label: ".then() data", state: "⏭ sauté", color: "#64748b" },
        ],
        engine: { callStack: ["catch(err)"], microQueue: [], console: [] },
        explanation: "L'erreur est attrapée ! À gauche : .catch() attrape. À droite : catch {} attrape. **C'est exactement le même mécanisme** — await transforme un rejet de Promise en une exception classique.",
        phase: "catch",
        marker: ".catch() = catch {}",
      },
      {
        promiseHL: [8, 9, 10], awaitHL: [6, 7, 8],
        promiseStates: [
          { label: "erreur", state: "✅ attrapée", color: "#ef4444" },
        ],
        engine: { callStack: [], microQueue: [], console: ["Erreur: 404"] },
        explanation: "✅ L'erreur est gérée. L'avantage de try/catch : on gère les erreurs synchrones ET asynchrones au même endroit. Avec .catch(), il faut penser à le chaîner. Avec try/catch, c'est le pattern que tout développeur connaît déjà.",
        phase: "done",
        marker: "même gestion d'erreur",
      },
    ],
  },
  {
    id: "parallel",
    title: "Parallèle",
    subtitle: "Promise.all + await",
    color: "#f59e0b",
    promiseCode: [
      { text: "function loadDashboard() {", color: "#64748b" },
      { text: "  return Promise.all([", color: "#f59e0b" },
      { text: '    fetch("/api/user").then(r => r.json()),', color: "#3b82f6" },
      { text: '    fetch("/api/posts").then(r => r.json()),', color: "#a855f7" },
      { text: '    fetch("/api/stats").then(r => r.json()),', color: "#22c55e" },
      { text: "  ]).then(([user, posts, stats]) => {", color: "#f59e0b" },
      { text: '    console.log("Tout chargé !");', color: "#f59e0b" },
      { text: "  });", color: "#f59e0b" },
      { text: "}", color: "#64748b" },
    ],
    awaitCode: [
      { text: "async function loadDashboard() {", color: "#06b6d4" },
      { text: "  const [user, posts, stats] = await Promise.all([", color: "#f59e0b" },
      { text: '    fetch("/api/user").then(r => r.json()),', color: "#3b82f6" },
      { text: '    fetch("/api/posts").then(r => r.json()),', color: "#a855f7" },
      { text: '    fetch("/api/stats").then(r => r.json()),', color: "#22c55e" },
      { text: "  ]);", color: "#f59e0b" },
      { text: "", color: null },
      { text: '  console.log("Tout chargé !");', color: "#c084fc" },
      { text: "}", color: "#06b6d4" },
    ],
    steps: [
      {
        promiseHL: [2, 3, 4], awaitHL: [2, 3, 4],
        promiseStates: [
          { label: "fetch /user", state: "pending ⏳", color: "#3b82f6" },
          { label: "fetch /posts", state: "pending ⏳", color: "#a855f7" },
          { label: "fetch /stats", state: "pending ⏳", color: "#22c55e" },
        ],
        engine: { callStack: ["Promise.all([...])"], microQueue: [], console: [] },
        explanation: "🚀 Les 3 fetch partent EN MÊME TEMPS ! Promise.all() prend un tableau de Promises et attend qu'elles soient TOUTES résolues. Ici, les 3 requêtes sont indépendantes → on les lance en parallèle.",
        phase: "parallel",
        marker: "3 fetch en parallèle",
      },
      {
        promiseHL: [2, 3, 4], awaitHL: [2, 3, 4],
        promiseStates: [
          { label: "fetch /user", state: "✅ (120ms)", color: "#22c55e" },
          { label: "fetch /posts", state: "pending ⏳", color: "#a855f7" },
          { label: "fetch /stats", state: "✅ (80ms)", color: "#22c55e" },
        ],
        engine: { callStack: [], microQueue: [], console: [] },
        explanation: "Certains reviennent plus vite que d'autres — mais Promise.all ATTEND TOUT LE MONDE. C'est le plus lent qui détermine le temps total. await met la fonction en pause tant que tout n'est pas prêt.",
        phase: "partial",
        marker: "attend le plus lent",
      },
      {
        promiseHL: [5, 6, 7], awaitHL: [1, 5, 7],
        promiseStates: [
          { label: "fetch /user", state: "✅", color: "#22c55e" },
          { label: "fetch /posts", state: "✅ (200ms)", color: "#22c55e" },
          { label: "fetch /stats", state: "✅", color: "#22c55e" },
          { label: "Promise.all()", state: "✅ → [user, posts, stats]", color: "#f59e0b" },
        ],
        engine: { callStack: ["console.log(...)"], microQueue: [], console: ["Tout chargé !"] },
        explanation: "✅ Les 3 sont arrivées ! Le destructuring [user, posts, stats] récupère les résultats dans l'ordre. Temps total ≈ 200ms (le plus lent), PAS 400ms (la somme). C'est l'intérêt du parallèle !",
        phase: "done",
        marker: null,
      },
    ],
  },
  {
    id: "trap",
    title: "⚠️ Piège",
    subtitle: "Séquentiel accidentel",
    color: "#ef4444",
    promiseCode: [
      { text: "// ❌ PIÈGE : séquentiel déguisé", color: "#ef4444" },
      { text: "async function slow() {", color: "#ef4444" },
      { text: '  const user = await fetch("/api/user")', color: "#3b82f6" },
      { text: "    .then(r => r.json());", color: "#3b82f6" },
      { text: "", color: null },
      { text: '  const posts = await fetch("/api/posts")', color: "#a855f7" },
      { text: "    .then(r => r.json());", color: "#a855f7" },
      { text: "  // ⏱ ~400ms (200 + 200)", color: "#ef4444" },
      { text: "}", color: "#ef4444" },
    ],
    awaitCode: [
      { text: "// ✅ CORRECT : parallèle explicite", color: "#22c55e" },
      { text: "async function fast() {", color: "#22c55e" },
      { text: "  const [user, posts] = await Promise.all([", color: "#f59e0b" },
      { text: '    fetch("/api/user").then(r => r.json()),', color: "#3b82f6" },
      { text: '    fetch("/api/posts").then(r => r.json()),', color: "#a855f7" },
      { text: "  ]);", color: "#f59e0b" },
      { text: "  // ⏱ ~200ms (le plus lent)", color: "#22c55e" },
      { text: "}", color: "#22c55e" },
    ],
    steps: [
      {
        promiseHL: [2, 3], awaitHL: [3, 4],
        promiseStates: [
          { label: "⚠️ Version lente", state: "fetch #1 → attend → fetch #2 → attend", color: "#ef4444" },
        ],
        engine: { callStack: [], microQueue: [], console: [] },
        explanation: "⚠️ LE PIÈGE CLASSIQUE : à gauche, chaque await BLOQUE avant de lancer le fetch suivant. Le 2e fetch attend que le 1er soit fini. Pourtant, les deux requêtes sont INDÉPENDANTES !",
        phase: "trap",
        marker: "await bloque !",
      },
      {
        promiseHL: [7], awaitHL: [6],
        promiseStates: [
          { label: "❌ Séquentiel", state: "200ms + 200ms = 400ms", color: "#ef4444" },
          { label: "✅ Parallèle", state: "max(200ms, 200ms) = 200ms", color: "#22c55e" },
        ],
        engine: { callStack: [], microQueue: [], console: [] },
        explanation: "La version de droite avec Promise.all lance les deux en même temps → 2x plus rapide ! Règle : si les requêtes sont INDÉPENDANTES, utilisez Promise.all. Si l'une dépend de l'autre (comme user.id), utilisez await séquentiel.",
        phase: "compare",
        marker: null,
      },
      {
        promiseHL: [], awaitHL: [],
        promiseStates: [
          { label: "Dépendants ?", state: "→ await l'un après l'autre", color: "#06b6d4" },
          { label: "Indépendants ?", state: "→ Promise.all([...])", color: "#22c55e" },
        ],
        engine: { callStack: [], microQueue: [], console: [] },
        explanation: "✅ LA RÈGLE : Avant d'écrire await, demandez-vous \"est-ce que j'ai BESOIN du résultat précédent pour faire cet appel ?\" Si non → Promise.all. C'est l'erreur de performance la plus courante avec async/await.",
        phase: "done",
        marker: null,
      },
    ],
  },
];

// ─── COMPONENTS ───

function CodeBlock({ lines, highlights, label, labelColor, side }) {
  return (
    <div style={{
      background: "rgba(8,8,16,0.9)", borderRadius: 14, padding: "12px 14px",
      border: `1px solid ${labelColor}18`, flex: 1, minWidth: 0, overflow: "hidden",
    }}>
      <div style={{
        fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2,
        color: labelColor, marginBottom: 10, fontFamily: "'JetBrains Mono', monospace",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{
          background: `${labelColor}18`, borderRadius: 6, padding: "2px 8px",
          border: `1px solid ${labelColor}30`,
        }}>{label}</span>
      </div>
      <pre style={{
        margin: 0, fontSize: 12, lineHeight: 1.65, fontFamily: "'JetBrains Mono', monospace",
        overflowX: "auto", whiteSpace: "pre",
      }}>
        {lines.map((line, i) => {
          const isActive = highlights.includes(i);
          return (
            <div key={i} style={{
              padding: "1px 6px", borderRadius: 6,
              background: isActive ? `${labelColor}12` : "transparent",
              borderLeft: isActive ? `2px solid ${labelColor}` : "2px solid transparent",
              color: isActive ? "#f1f5f9" : (line.color ? "#3e4a5c" : "#1a1a28"),
              transition: "all 0.3s", whiteSpace: "pre",
            }}>
              {line.text || " "}
            </div>
          );
        })}
      </pre>
    </div>
  );
}

function Marker({ text }) {
  if (!text) return null;
  return (
    <div style={{
      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
      background: "#06b6d4dd", color: "#fff", padding: "4px 12px", borderRadius: 20,
      fontSize: 10, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
      whiteSpace: "nowrap", zIndex: 10, boxShadow: "0 0 16px #06b6d433",
      animation: "fadeUp 0.4s ease", letterSpacing: 0.5,
    }}>
      ={`>`} {text}
    </div>
  );
}

function PromiseState({ item }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "5px 10px",
      background: `${item.color}08`, borderRadius: 8, border: `1px solid ${item.color}20`,
      animation: "fadeUp 0.3s ease",
    }}>
      <div style={{
        fontSize: 11.5, fontWeight: 700, color: item.color,
        fontFamily: "'JetBrains Mono', monospace", minWidth: 100,
      }}>{item.label}</div>
      <div style={{
        fontSize: 11, color: item.color === "#22c55e" ? "#6ee7b7" : item.color === "#ef4444" ? "#fca5a5" : "#8896a6",
        fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
      }}>{item.state}</div>
    </div>
  );
}

export default function AsyncAwaitViz() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  const scenario = SCENARIOS[scenarioIdx];
  const current = scenario.steps[step];

  const next = useCallback(() => setStep(s => Math.min(s + 1, scenario.steps.length - 1)), [scenario]);
  const prev = useCallback(() => setStep(s => Math.max(s - 1, 0)), []);

  const selectScenario = useCallback((idx) => {
    setScenarioIdx(idx); setStep(0); setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStep(s => {
          if (s >= scenario.steps.length - 1) { setIsPlaying(false); return s; }
          return s + 1;
        });
      }, 4200);
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
    : current.phase === "trap" || current.phase === "catch" ? "#ef4444"
    : current.phase === "compare" ? "#f59e0b"
    : scenario.color;

  return (
    <div style={{
      minHeight: "100vh", background: "#07070d", color: "#e2e8f0",
      fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: "20px 14px", boxSizing: "border-box",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
          <span style={{ color: "#06b6d4" }}>async</span>/<span style={{ color: "#a855f7" }}>await</span>
          <span style={{ color: "#3e4a5c", fontWeight: 400, fontSize: 14, marginLeft: 8 }}>— du sucre syntaxique sur les Promises</span>
        </h1>
      </div>

      {/* Scenario tabs */}
      <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
        {SCENARIOS.map((sc, i) => (
          <button key={sc.id} onClick={() => selectScenario(i)} style={{
            background: i === scenarioIdx ? `${sc.color}18` : "#0a0a16",
            color: i === scenarioIdx ? sc.color : "#3e4a5c",
            border: `1.5px solid ${i === scenarioIdx ? sc.color + "44" : "#14141f"}`,
            borderRadius: 10, padding: "7px 14px", fontSize: 11, fontWeight: 700,
            cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", transition: "all 0.3s",
          }}>
            <div>{sc.title}</div>
            <div style={{ fontSize: 8, fontWeight: 400, opacity: 0.6, marginTop: 1 }}>{sc.subtitle}</div>
          </button>
        ))}
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14 }}>
        {scenario.steps.map((_, i) => (
          <div key={i} onClick={() => { setStep(i); setIsPlaying(false); }} style={{
            width: i === step ? 26 : 10, height: 10, borderRadius: 5,
            background: i === step ? phaseColor : i < step ? `${phaseColor}40` : "#12121e",
            transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer",
          }} />
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Side by side code */}
        <div style={{ display: "flex", gap: 10, marginBottom: 12, position: "relative" }}>
          <CodeBlock
            lines={scenario.promiseCode}
            highlights={current.promiseHL}
            label={scenario.id === "trap" ? "❌ Lent" : "Promises"}
            labelColor={scenario.id === "trap" ? "#ef4444" : "#a855f7"}
          />
          <Marker text={current.marker} />
          <CodeBlock
            lines={scenario.awaitCode}
            highlights={current.awaitHL}
            label={scenario.id === "trap" ? "✅ Rapide" : "async/await"}
            labelColor={scenario.id === "trap" ? "#22c55e" : "#06b6d4"}
          />
        </div>

        {/* State panel */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          {/* Promise chain states */}
          <div style={{
            background: "rgba(8,8,16,0.8)", borderRadius: 14, padding: "12px 14px",
            border: "1px solid #14141f",
          }}>
            <div style={{
              fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2,
              color: "#4a5568", marginBottom: 8, fontFamily: "'JetBrains Mono', monospace",
            }}>🔗 État des Promises</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minHeight: 30 }}>
              {current.promiseStates.length === 0 ? (
                <div style={{ color: "#1e1e2e", fontSize: 11, fontStyle: "italic", fontFamily: "'JetBrains Mono', monospace" }}>
                  en attente…
                </div>
              ) : current.promiseStates.map((ps, i) => (
                <PromiseState key={`${ps.label}-${i}-${step}`} item={ps} />
              ))}
            </div>
          </div>

          {/* Engine state */}
          <div style={{
            background: "rgba(8,8,16,0.8)", borderRadius: 14, padding: "12px 14px",
            border: "1px solid #14141f",
          }}>
            <div style={{
              fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2,
              color: "#4a5568", marginBottom: 8, fontFamily: "'JetBrains Mono', monospace",
            }}>⚙️ Moteur JS</div>
            {current.engine.callStack.length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 9, color: "#22c55e", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>STACK </span>
                {current.engine.callStack.map((item, i) => (
                  <span key={i} style={{
                    fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace",
                    background: "#22c55e0c", borderRadius: 6, padding: "2px 8px", marginLeft: 4,
                    border: "1px solid #22c55e20",
                  }}>{item}</span>
                ))}
              </div>
            )}
            {current.engine.console.length > 0 && (
              <div>
                <span style={{ fontSize: 9, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>CONSOLE </span>
                {current.engine.console.map((item, i) => (
                  <span key={i} style={{
                    fontSize: 12, fontWeight: 700, color: "#6ee7b7", fontFamily: "'JetBrains Mono', monospace",
                    marginLeft: 4,
                  }}>› {item}</span>
                ))}
              </div>
            )}
            {current.engine.callStack.length === 0 && current.engine.console.length === 0 && (
              <div style={{ color: "#1e1e2e", fontSize: 11, fontStyle: "italic", fontFamily: "'JetBrains Mono', monospace" }}>
                en attente…
              </div>
            )}
          </div>
        </div>

        {/* Explanation */}
        <div key={`${scenarioIdx}-${step}`} style={{
          background: `${phaseColor}08`, border: `1px solid ${phaseColor}22`,
          borderRadius: 16, padding: "14px 18px", marginBottom: 16,
          animation: "fadeUp 0.4s ease",
        }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: "#a8b4c2" }}>
            <span style={{ color: phaseColor, fontWeight: 800, fontSize: 16, marginRight: 8 }}>
              {step + 1}.
            </span>
            {current.explanation.split("**").map((part, i) =>
              i % 2 === 1
                ? <strong key={i} style={{ color: "#e2e8f0", fontWeight: 700 }}>{part}</strong>
                : <span key={i}>{part}</span>
            )}
          </p>
        </div>

        {/* Summary on done for "basic" scenario */}
        {current.phase === "done" && scenario.id === "basic" && (
          <div style={{
            background: "linear-gradient(135deg, #06b6d406, #a855f706)",
            border: "1px solid #06b6d420", borderRadius: 16, padding: "16px 20px",
            marginBottom: 16, animation: "fadeUp 0.5s ease",
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#06b6d4", marginBottom: 10 }}>
              📌 Traduction mentale
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            }}>
              <div style={{ background: "#a855f710", borderRadius: 10, padding: "8px 12px", border: "1px solid #a855f722", color: "#c4b5fd" }}>
                .then(val ={">"} ...)</div>
              <div style={{ color: "#06b6d4", fontWeight: 800, fontSize: 16 }}>≡</div>
              <div style={{ background: "#06b6d410", borderRadius: 10, padding: "8px 12px", border: "1px solid #06b6d422", color: "#67e8f9" }}>
                const val = await ...</div>

              <div style={{ background: "#ef444410", borderRadius: 10, padding: "8px 12px", border: "1px solid #ef444422", color: "#fca5a5" }}>
                .catch(err ={">"} ...)</div>
              <div style={{ color: "#06b6d4", fontWeight: 800, fontSize: 16 }}>≡</div>
              <div style={{ background: "#ef444410", borderRadius: 10, padding: "8px 12px", border: "1px solid #ef444422", color: "#fca5a5" }}>
                try {"{"} ... {"}"} catch(err)</div>

              <div style={{ background: "#22c55e10", borderRadius: 10, padding: "8px 12px", border: "1px solid #22c55e22", color: "#6ee7b7" }}>
                return valeur</div>
              <div style={{ color: "#06b6d4", fontWeight: 800, fontSize: 16 }}>≡</div>
              <div style={{ background: "#22c55e10", borderRadius: 10, padding: "8px 12px", border: "1px solid #22c55e22", color: "#6ee7b7" }}>
                return valeur</div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => { setStep(0); setIsPlaying(false); }} style={{
            background: "#0a0a16", color: "#4a5568", border: "1px solid #14141f",
            borderRadius: 12, padding: "10px 18px", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Inter', sans-serif",
          }}>↺</button>
          <button onClick={prev} disabled={step === 0} style={{
            background: step === 0 ? "#07070d" : "#0a0a16",
            color: step === 0 ? "#14141f" : "#e2e8f0",
            border: "1px solid #14141f", borderRadius: 12, padding: "10px 18px",
            fontSize: 13, fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer",
            fontFamily: "'Inter', sans-serif",
          }}>←</button>
          <button onClick={() => setIsPlaying(p => !p)} style={{
            background: isPlaying ? "linear-gradient(135deg, #dc2626, #ef4444)" : `linear-gradient(135deg, ${scenario.color}, ${scenario.color}88)`,
            color: "#fff", border: "none", borderRadius: 12, padding: "10px 28px",
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif",
            boxShadow: `0 4px 16px ${isPlaying ? "#dc262622" : scenario.color + "1a"}`,
          }}>{isPlaying ? "⏸" : "▶"}</button>
          <button onClick={next} disabled={step === scenario.steps.length - 1} style={{
            background: step === scenario.steps.length - 1 ? "#07070d" : "#0a0a16",
            color: step === scenario.steps.length - 1 ? "#14141f" : "#e2e8f0",
            border: "1px solid #14141f", borderRadius: 12, padding: "10px 18px",
            fontSize: 13, fontWeight: 600,
            cursor: step === scenario.steps.length - 1 ? "not-allowed" : "pointer",
            fontFamily: "'Inter', sans-serif",
          }}>→</button>
        </div>

        <p style={{
          textAlign: "center", fontSize: 10, color: "#1a1a28", marginTop: 8,
          fontFamily: "'JetBrains Mono', monospace",
        }}>← → naviguer · Espace play/pause</p>
      </div>
    </div>
  );
}
