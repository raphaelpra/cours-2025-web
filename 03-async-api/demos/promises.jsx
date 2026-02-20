import { useState, useEffect, useRef, useCallback } from "react";

const SCENARIOS = [
  {
    id: "anatomy",
    title: "Anatomie",
    subtitle: "Créer une Promise",
    color: "#a855f7",
    code: [
      { text: "const p = new Promise((resolve, reject) => {", color: "#a855f7" },
      { text: '  console.log("Début du travail…");', color: "#22c55e" },
      { text: "  // simuler un travail async (ex: réseau)", color: "#64748b" },
      { text: "  setTimeout(() => {", color: "#f59e0b" },
      { text: '    resolve("pizza prête 🍕");', color: "#22c55e" },
      { text: "  }, 2000);", color: "#f59e0b" },
      { text: "});", color: "#a855f7" },
      { text: "", color: null },
      { text: "// p est maintenant une Promise en état pending", color: "#64748b" },
    ],
    steps: [
      {
        promiseState: { status: "construction", value: null },
        activeLines: [0, 6],
        explanation: "On crée une Promise avec **new Promise()**. On lui passe une fonction avec deux paramètres : **resolve** (succès) et **reject** (échec). Ce sont des \"manettes\" que NOUS allons appeler quand le travail sera fini.",
        annotation: null,
        consoleLines: [],
      },
      {
        promiseState: { status: "pending", value: null },
        activeLines: [1],
        explanation: "Le code DANS la Promise s'exécute **immédiatement** et de manière synchrone ! C'est une erreur fréquente de croire que tout est différé. Seul le résultat (resolve/reject) sera traité de manière asynchrone.",
        annotation: "⚡ S'exécute tout de suite !",
        consoleLines: ["Début du travail…"],
      },
      {
        promiseState: { status: "pending", value: null },
        activeLines: [3, 4, 5],
        explanation: "Le setTimeout simule une opération longue (requête réseau, lecture fichier…). La Promise est en état **pending** — elle ne sait pas encore si ça va réussir ou échouer.",
        annotation: "⏳ En attente…",
        consoleLines: ["Début du travail…"],
      },
      {
        promiseState: { status: "fulfilled", value: '"pizza prête 🍕"' },
        activeLines: [4],
        explanation: "2 secondes plus tard, on appelle **resolve(\"pizza prête 🍕\")**. La valeur passée à resolve est le RÉSULTAT de la Promise. Elle passe de pending → **fulfilled**. Cette valeur sera accessible dans le .then().",
        annotation: '✅ resolve("pizza prête 🍕")',
        consoleLines: ["Début du travail…"],
      },
      {
        promiseState: { status: "fulfilled", value: '"pizza prête 🍕"' },
        activeLines: [8],
        explanation: "Une Promise a **3 états possibles** : ⏳ pending (en cours), ✅ fulfilled (réussie, via resolve), ❌ rejected (échouée, via reject). Une fois résolue ou rejetée, elle ne change PLUS jamais — c'est irréversible.",
        annotation: null,
        consoleLines: ["Début du travail…"],
      },
    ],
  },
  {
    id: "resolve-value",
    title: "resolve(valeur)",
    subtitle: "Passer des données",
    color: "#22c55e",
    code: [
      { text: "function chargerUtilisateur(id) {", color: "#64748b" },
      { text: "  return new Promise((resolve, reject) => {", color: "#a855f7" },
      { text: "    // simulation d'un appel API", color: "#64748b" },
      { text: "    setTimeout(() => {", color: "#f59e0b" },
      { text: "      const user = { id: id, nom: \"Alice\" };", color: "#22c55e" },
      { text: "      resolve(user);  // on passe l'objet !", color: "#22c55e" },
      { text: "    }, 1000);", color: "#f59e0b" },
      { text: "  });", color: "#a855f7" },
      { text: "}", color: "#64748b" },
      { text: "", color: null },
      { text: "chargerUtilisateur(42).then(user => {", color: "#c084fc" },
      { text: '  console.log(user.nom);   // "Alice"', color: "#c084fc" },
      { text: '  console.log(user.id);    // 42', color: "#c084fc" },
      { text: "});", color: "#c084fc" },
    ],
    steps: [
      {
        promiseState: { status: "construction", value: null },
        activeLines: [0, 1, 7, 8],
        explanation: "On crée une **fonction qui retourne une Promise**. C'est le pattern le plus courant ! L'appelant reçoit une Promise sur laquelle il peut appeler .then().",
        annotation: "Pattern : return new Promise(…)",
        consoleLines: [],
      },
      {
        promiseState: { status: "pending", value: null },
        activeLines: [3, 4, 5, 6],
        explanation: "Dans le setTimeout, on construit un objet user puis on le passe à **resolve(user)**. La valeur qu'on donne à resolve peut être N'IMPORTE QUOI : un string, un nombre, un objet, un tableau…",
        annotation: "resolve() accepte toute valeur",
        consoleLines: [],
      },
      {
        promiseState: { status: "fulfilled", value: '{ id: 42, nom: "Alice" }' },
        activeLines: [5],
        explanation: "resolve(user) est appelé avec notre objet. La Promise passe en **fulfilled** et \"contient\" maintenant l'objet { id: 42, nom: \"Alice\" }. Cette valeur sera le paramètre du .then().",
        annotation: "✅ resolve({ id: 42, nom: \"Alice\" })",
        consoleLines: [],
      },
      {
        promiseState: { status: "fulfilled", value: '{ id: 42, nom: "Alice" }' },
        activeLines: [10, 11, 12, 13],
        explanation: "Le .then() reçoit en paramètre **exactement la valeur passée à resolve()**. Ici, user = { id: 42, nom: \"Alice\" }. C'est le pont entre celui qui produit la donnée et celui qui la consomme.",
        annotation: "resolve(x) → .then(x => …)",
        consoleLines: ["Alice", "42"],
      },
    ],
  },
  {
    id: "reject-value",
    title: "reject(erreur)",
    subtitle: "Gérer les échecs",
    color: "#ef4444",
    code: [
      { text: "function chargerUtilisateur(id) {", color: "#64748b" },
      { text: "  return new Promise((resolve, reject) => {", color: "#a855f7" },
      { text: "    setTimeout(() => {", color: "#f59e0b" },
      { text: "      if (id <= 0) {", color: "#ef4444" },
      { text: '        reject(new Error("ID invalide"));', color: "#ef4444" },
      { text: "      } else {", color: "#64748b" },
      { text: '        resolve({ id, nom: "Alice" });', color: "#22c55e" },
      { text: "      }", color: "#64748b" },
      { text: "    }, 1000);", color: "#f59e0b" },
      { text: "  });", color: "#a855f7" },
      { text: "}", color: "#64748b" },
      { text: "", color: null },
      { text: "chargerUtilisateur(-1)", color: "#c084fc" },
      { text: "  .then(user => {", color: "#c084fc" },
      { text: '    console.log("OK:", user.nom);  // ⏭ SAUTÉ', color: "#64748b" },
      { text: "  })", color: "#c084fc" },
      { text: "  .catch(err => {", color: "#ef4444" },
      { text: '    console.log("Erreur:", err.message);', color: "#ef4444" },
      { text: "  });", color: "#ef4444" },
    ],
    steps: [
      {
        promiseState: { status: "pending", value: null },
        activeLines: [12],
        explanation: "On appelle chargerUtilisateur(**-1**). L'id est négatif — notre fonction va devoir signaler une erreur. Comment fait-on quand une opération async échoue ?",
        annotation: "id = -1 → va échouer",
        consoleLines: [],
      },
      {
        promiseState: { status: "pending", value: null },
        activeLines: [3, 4],
        explanation: "On vérifie : id <= 0 → on appelle **reject()** au lieu de resolve(). On lui passe un objet Error avec un message descriptif. C'est la convention : toujours reject avec une Error.",
        annotation: "reject(new Error(…))",
        consoleLines: [],
      },
      {
        promiseState: { status: "rejected", value: 'Error("ID invalide")' },
        activeLines: [4],
        explanation: "La Promise passe en état **rejected**. Elle \"contient\" l'erreur. Tout comme resolve() transmet au .then(), **reject() transmet au .catch()**.",
        annotation: "❌ État : rejected",
        consoleLines: [],
      },
      {
        promiseState: { status: "rejected", value: 'Error("ID invalide")' },
        activeLines: [13, 14, 15],
        explanation: "Le .then() est **complètement sauté** ! Quand une Promise est rejetée, elle ignore les .then() et cherche le prochain .catch(). C'est comme si l'erreur \"sautait\" par-dessus.",
        annotation: "⏭ .then() sauté !",
        consoleLines: [],
      },
      {
        promiseState: { status: "rejected", value: 'Error("ID invalide")' },
        activeLines: [16, 17, 18],
        explanation: "Le .catch() attrape l'erreur. **err** = l'objet Error passé à reject(). err.message = \"ID invalide\". Sans .catch(), l'erreur serait silencieuse → toujours ajouter un .catch() !",
        annotation: "reject(x) → .catch(x => …)",
        consoleLines: ["Erreur: ID invalide"],
      },
    ],
  },
  {
    id: "wrap",
    title: "Promisifier",
    subtitle: "Transformer un callback",
    color: "#f59e0b",
    code: [
      { text: "// ❌ Ancien style avec callback", color: "#ef4444" },
      { text: "function ancienneAPI(cb) {", color: "#64748b" },
      { text: '  setTimeout(() => cb(null, "données"), 1000);', color: "#64748b" },
      { text: "}", color: "#64748b" },
      { text: "", color: null },
      { text: "// ✅ Version Promise", color: "#22c55e" },
      { text: "function nouvelleAPI() {", color: "#22c55e" },
      { text: "  return new Promise((resolve, reject) => {", color: "#a855f7" },
      { text: "    ancienneAPI((err, data) => {", color: "#f59e0b" },
      { text: "      if (err) reject(err);", color: "#ef4444" },
      { text: "      else resolve(data);", color: "#22c55e" },
      { text: "    });", color: "#f59e0b" },
      { text: "  });", color: "#a855f7" },
      { text: "}", color: "#22c55e" },
      { text: "", color: null },
      { text: 'nouvelleAPI().then(data => console.log(data));', color: "#c084fc" },
    ],
    steps: [
      {
        promiseState: { status: "info", value: null },
        activeLines: [0, 1, 2, 3],
        explanation: "Avant les Promises, le JS utilisait des **callbacks** : on passait une fonction qui serait appelée plus tard. Le problème ? Imbriquer plusieurs callbacks → \"callback hell\" 🔥. Pas de .then(), pas de .catch().",
        annotation: "L'ancien monde : callbacks",
        consoleLines: [],
      },
      {
        promiseState: { status: "construction", value: null },
        activeLines: [6, 7, 8, 11, 12, 13],
        explanation: "On \"emballe\" l'ancienne API dans une Promise. On appelle l'ancienne fonction à l'intérieur, et dans son callback : si erreur → **reject(err)**, si succès → **resolve(data)**. C'est ce qu'on appelle **promisifier** une API.",
        annotation: "Emballer dans new Promise()",
        consoleLines: [],
      },
      {
        promiseState: { status: "pending", value: null },
        activeLines: [8, 9, 10, 11],
        explanation: "Le callback de l'ancienne API est appelé. Convention Node.js : le 1er paramètre est l'erreur (null si OK), le 2e est la donnée. On fait le pont entre les deux mondes : callback → Promise.",
        annotation: "callback(err, data) → resolve / reject",
        consoleLines: [],
      },
      {
        promiseState: { status: "fulfilled", value: '"données"' },
        activeLines: [15],
        explanation: "✅ Maintenant on peut utiliser .then() ! Ce pattern est très utile pour moderniser du code. D'ailleurs, Node.js fournit **util.promisify()** qui fait exactement ça automatiquement.",
        annotation: "✅ Utilisable avec .then()",
        consoleLines: ["données"],
      },
    ],
  },
  {
    id: "states",
    title: "Résumé",
    subtitle: "Les 3 états",
    color: "#06b6d4",
    code: [
      { text: "// La Promise est comme une commande au restaurant", color: "#64748b" },
      { text: "", color: null },
      { text: "const commande = new Promise((resolve, reject) => {", color: "#a855f7" },
      { text: "  // Le cuisinier travaille…", color: "#64748b" },
      { text: "  if (platDisponible) {", color: "#22c55e" },
      { text: '    resolve("🍕 Votre pizza !");  // → .then()', color: "#22c55e" },
      { text: "  } else {", color: "#ef4444" },
      { text: '    reject("❌ Plus de pâte");    // → .catch()', color: "#ef4444" },
      { text: "  }", color: "#64748b" },
      { text: "});", color: "#a855f7" },
      { text: "", color: null },
      { text: "commande", color: "#64748b" },
      { text: '  .then(plat => console.log("Servi:", plat))', color: "#22c55e" },
      { text: '  .catch(err => console.log("Désolé:", err));', color: "#ef4444" },
    ],
    steps: [
      {
        promiseState: { status: "pending", value: null },
        activeLines: [0, 2, 3, 9],
        explanation: "Une Promise est comme une **commande au restaurant**. Quand vous commandez, le serveur vous donne un \"ticket\" (la Promise). Vous ne savez pas encore si le plat sera prêt — c'est l'état **pending**.",
        annotation: "🎫 Ticket de commande reçu",
        consoleLines: [],
      },
      {
        promiseState: { status: "fulfilled", value: '"🍕 Votre pizza !"' },
        activeLines: [4, 5, 12],
        explanation: "Le plat est prêt ! Le cuisinier appelle **resolve()** → la commande est **fulfilled** → le serveur vous apporte le plat (**.then()**). La valeur dans resolve est ce que vous recevez.",
        annotation: "✅ fulfilled → .then()",
        consoleLines: ["Servi: 🍕 Votre pizza !"],
      },
      {
        promiseState: { status: "rejected", value: '"❌ Plus de pâte"' },
        activeLines: [6, 7, 13],
        explanation: "Ou bien : plus de pâte ! Le cuisinier appelle **reject()** → la commande est **rejected** → le serveur vous prévient de l'erreur (**.catch()**). Le message d'erreur est dans le paramètre du .catch().",
        annotation: "❌ rejected → .catch()",
        consoleLines: ["Désolé: ❌ Plus de pâte"],
      },
      {
        promiseState: { status: "info", value: null },
        activeLines: [],
        explanation: "Récapitulons les correspondances :\n**resolve(valeur)** → la valeur arrive dans **.then(valeur =>)**\n**reject(erreur)** → l'erreur arrive dans **.catch(erreur =>)**\nUne Promise résolue ou rejetée ne change plus jamais d'état.",
        annotation: null,
        consoleLines: [],
      },
    ],
  },
];

// ─── COMPONENTS ───

const STATUS_CONFIG = {
  construction: { label: "🔧 Construction", bg: "#64748b", text: "La Promise est en train d'être créée" },
  pending: { label: "⏳ Pending", bg: "#f59e0b", text: "En attente de resolve() ou reject()" },
  fulfilled: { label: "✅ Fulfilled", bg: "#22c55e", text: "Réussie — valeur disponible" },
  rejected: { label: "❌ Rejected", bg: "#ef4444", text: "Échouée — erreur disponible" },
  info: { label: "📌 Info", bg: "#06b6d4", text: "" },
};

function PromiseStateViz({ state }) {
  const config = STATUS_CONFIG[state.status];
  const allStates = ["pending", "fulfilled", "rejected"];

  return (
    <div style={{
      background: "rgba(8,8,16,0.85)", borderRadius: 16, padding: "16px 18px",
      border: `1px solid ${config.bg}30`,
    }}>
      <div style={{
        fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2,
        color: "#4a5568", marginBottom: 14, fontFamily: "'JetBrains Mono', monospace",
      }}>🔮 État de la Promise</div>

      {/* State pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {allStates.map(s => {
          const c = STATUS_CONFIG[s];
          const isActive = state.status === s;
          return (
            <div key={s} style={{
              padding: "6px 14px", borderRadius: 10,
              background: isActive ? `${c.bg}22` : "#0a0a16",
              border: `2px solid ${isActive ? c.bg : "#14141f"}`,
              fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
              color: isActive ? c.bg : "#252535",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: isActive ? "scale(1.05)" : "scale(1)",
            }}>
              {c.label}
            </div>
          );
        })}
      </div>

      {/* Value display */}
      {state.value && (
        <div key={state.value} style={{
          background: `${config.bg}0c`, border: `1px solid ${config.bg}25`,
          borderRadius: 12, padding: "10px 14px", animation: "fadeUp 0.4s ease",
        }}>
          <div style={{
            fontSize: 9, fontWeight: 700, color: "#4a5568", textTransform: "uppercase",
            letterSpacing: 1.5, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace",
          }}>
            {state.status === "fulfilled" ? "Valeur (→ .then)" : state.status === "rejected" ? "Erreur (→ .catch)" : "Contenu"}
          </div>
          <div style={{
            fontSize: 14, fontWeight: 700, color: config.bg,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {state.value}
          </div>
        </div>
      )}

      {config.text && !state.value && (
        <div style={{
          fontSize: 12, color: "#4a5568", fontStyle: "italic",
          fontFamily: "'JetBrains Mono', monospace",
        }}>{config.text}</div>
      )}
    </div>
  );
}

function Annotation({ text, color }) {
  if (!text) return null;
  return (
    <div key={text} style={{
      display: "inline-block", background: `${color}18`,
      border: `1px solid ${color}35`, borderRadius: 10, padding: "5px 14px",
      fontSize: 12, fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace",
      animation: "fadeUp 0.35s ease", marginBottom: 10,
    }}>{text}</div>
  );
}

function ConsolePanel({ lines }) {
  return (
    <div style={{
      background: "rgba(8,8,16,0.85)", borderRadius: 14, padding: "12px 16px",
      border: "1px solid #14141f", minHeight: 52,
    }}>
      <div style={{
        fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2,
        color: "#4a5568", marginBottom: 8, fontFamily: "'JetBrains Mono', monospace",
      }}>🖥 Console</div>
      {lines.length === 0 ? (
        <div style={{ color: "#1a1a28", fontSize: 11, fontStyle: "italic", fontFamily: "'JetBrains Mono', monospace" }}>_</div>
      ) : lines.map((line, i) => (
        <div key={`${line}-${i}`} style={{
          fontSize: 13, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
          color: line.startsWith("Erreur") || line.startsWith("Désolé") ? "#fca5a5" : "#6ee7b7",
          animation: i === lines.length - 1 ? "fadeUp 0.35s ease" : "none",
        }}>
          <span style={{ color: "#252535", marginRight: 6 }}>›</span>{line}
        </div>
      ))}
    </div>
  );
}

export default function PromiseFundamentals() {
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
      }, 4000);
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

  const phaseColor = scenario.color;

  return (
    <div style={{
      minHeight: "100vh", background: "#07070d", color: "#e2e8f0",
      fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: "22px 16px", boxSizing: "border-box",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
          Comprendre les <span style={{ color: "#a855f7" }}>Promises</span>
        </h1>
        <p style={{ fontSize: 12, color: "#3e4a5c", margin: "4px 0 0", fontFamily: "'JetBrains Mono', monospace" }}>
          resolve, reject, .then(), .catch() — les fondamentaux
        </p>
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
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
        {scenario.steps.map((_, i) => (
          <div key={i} onClick={() => { setStep(i); setIsPlaying(false); }} style={{
            width: i === step ? 26 : 10, height: 10, borderRadius: 5,
            background: i === step ? phaseColor : i < step ? `${phaseColor}40` : "#12121e",
            transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer",
          }} />
        ))}
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Code + Promise state side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {/* Code block */}
          <div style={{
            background: "rgba(8,8,16,0.9)", borderRadius: 16, padding: "14px 16px",
            border: "1px solid #14141f",
          }}>
            <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#22c55e" }} />
            </div>
            {current.annotation && (
              <Annotation text={current.annotation} color={phaseColor} />
            )}
            <pre style={{
              margin: 0, fontSize: 12.5, lineHeight: 1.7, fontFamily: "'JetBrains Mono', monospace",
              overflowX: "auto",
            }}>
              {scenario.code.map((line, i) => {
                const isActive = current.activeLines.includes(i);
                return (
                  <div key={i} style={{
                    padding: "1px 8px", borderRadius: 6,
                    background: isActive ? `${phaseColor}12` : "transparent",
                    borderLeft: isActive ? `3px solid ${phaseColor}` : "3px solid transparent",
                    color: isActive ? "#f1f5f9" : (line.color ? "#313d4f" : "#1a1a28"),
                    transition: "all 0.3s",
                  }}>
                    <span style={{ color: "#1a1a28", marginRight: 10, fontSize: 10, userSelect: "none" }}>
                      {String(i + 1).padStart(2, " ")}
                    </span>
                    {line.text || " "}
                  </div>
                );
              })}
            </pre>
          </div>

          {/* Promise state + console */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <PromiseStateViz state={current.promiseState} />
            <ConsolePanel lines={current.consoleLines} />
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

        {/* Summary card on "states" scenario final step */}
        {scenario.id === "states" && step === scenario.steps.length - 1 && (
          <div style={{
            background: "linear-gradient(135deg, #06b6d406, #a855f706)",
            border: "1px solid #06b6d420", borderRadius: 16, padding: "18px 22px",
            marginBottom: 16, animation: "fadeUp 0.5s ease",
          }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#06b6d4", marginBottom: 14 }}>
              📌 Le mémo à retenir
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            }}>
              <div style={{ background: "#a855f710", borderRadius: 10, padding: "8px 12px", border: "1px solid #a855f722", color: "#c4b5fd" }}>
                resolve(valeur)
              </div>
              <div style={{ color: "#4a5568", fontWeight: 800 }}>→</div>
              <div style={{ background: "#22c55e10", borderRadius: 10, padding: "8px 12px", border: "1px solid #22c55e22", color: "#6ee7b7" }}>
                .then(valeur ={">"} …)
              </div>

              <div style={{ background: "#a855f710", borderRadius: 10, padding: "8px 12px", border: "1px solid #a855f722", color: "#c4b5fd" }}>
                reject(erreur)
              </div>
              <div style={{ color: "#4a5568", fontWeight: 800 }}>→</div>
              <div style={{ background: "#ef444410", borderRadius: 10, padding: "8px 12px", border: "1px solid #ef444422", color: "#fca5a5" }}>
                .catch(erreur ={">"} …)
              </div>

              <div style={{ background: "#f59e0b10", borderRadius: 10, padding: "8px 12px", border: "1px solid #f59e0b22", color: "#fbbf24" }}>
                new Promise(…)
              </div>
              <div style={{ color: "#4a5568", fontWeight: 800 }}>→</div>
              <div style={{ background: "#06b6d410", borderRadius: 10, padding: "8px 12px", border: "1px solid #06b6d422", color: "#67e8f9" }}>
                pending → fulfilled | rejected
              </div>
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
