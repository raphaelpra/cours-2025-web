import { useState, useEffect, useRef, useCallback } from "react";

const STEPS = [
  {
    callStack: ["main()"],
    webApis: [],
    queue: [],
    console: [],
    explanation: "Le moteur JS commence à lire le script. Il crée un contexte d'exécution principal (main) sur la Call Stack.",
    arrow: null,
    phase: "start",
  },
  {
    callStack: ["main()", 'console.log("Bonjour")'],
    webApis: [],
    queue: [],
    console: [],
    explanation: "Première ligne : console.log(\"Bonjour\") est poussé sur la Call Stack. C'est du code synchrone → il s'exécute immédiatement.",
    arrow: "push-stack",
    phase: "sync",
  },
  {
    callStack: ["main()"],
    webApis: [],
    queue: [],
    console: ["Bonjour"],
    explanation: "\"Bonjour\" s'affiche dans la console. L'appel est terminé → il est retiré (pop) de la Call Stack. On passe à la ligne suivante.",
    arrow: "to-console",
    phase: "sync",
  },
  {
    callStack: ["main()", "setTimeout(cb, 2000)"],
    webApis: [],
    queue: [],
    console: ["Bonjour"],
    explanation: "setTimeout est poussé sur la Call Stack. Mais attention : setTimeout n'est PAS une fonction JavaScript ! C'est une API fournie par le navigateur.",
    arrow: "push-stack",
    phase: "delegate",
  },
  {
    callStack: ["main()"],
    webApis: ["⏱ Timer (2s)"],
    queue: [],
    console: ["Bonjour"],
    explanation: "Le navigateur prend en charge le timer. setTimeout quitte la Call Stack. Le moteur JS continue SANS attendre les 2 secondes. C'est ça l'asynchrone !",
    arrow: "to-webapi",
    phase: "webapi",
  },
  {
    callStack: ["main()", 'console.log("Au revoir")'],
    webApis: ["⏱ Timer (2s)"],
    queue: [],
    console: ["Bonjour"],
    explanation: "Pendant que le timer tourne en arrière-plan, JS exécute la ligne suivante sans attendre. console.log(\"Au revoir\") est poussé sur la Stack.",
    arrow: "push-stack",
    phase: "sync",
  },
  {
    callStack: ["main()"],
    webApis: ["⏱ Timer (2s)"],
    queue: [],
    console: ["Bonjour", "Au revoir"],
    explanation: "\"Au revoir\" s'affiche. Remarque : on a affiché \"Au revoir\" AVANT le callback du setTimeout ! Le code synchrone passe toujours en premier.",
    arrow: "to-console",
    phase: "sync",
  },
  {
    callStack: [],
    webApis: ["⏱ Timer (2s)"],
    queue: [],
    console: ["Bonjour", "Au revoir"],
    explanation: "Le script principal est terminé, main() quitte la Stack. Elle est maintenant vide. Mais le timer tourne toujours dans le navigateur…",
    arrow: null,
    phase: "waiting",
  },
  {
    callStack: [],
    webApis: ["⏱ Timer ✅ terminé !"],
    queue: [],
    console: ["Bonjour", "Au revoir"],
    explanation: "⏱ Les 2 secondes sont écoulées ! Le timer est terminé. Le navigateur pousse le callback dans la Callback Queue (file d'attente).",
    arrow: null,
    phase: "timer-done",
  },
  {
    callStack: [],
    webApis: [],
    queue: ["callback()"],
    console: ["Bonjour", "Au revoir"],
    explanation: "Le callback attend sagement dans la Queue. Il ne peut PAS s'exécuter directement — il doit attendre que la Call Stack soit vide. C'est le rôle de l'Event Loop.",
    arrow: "to-queue",
    phase: "queued",
  },
  {
    callStack: [],
    webApis: [],
    queue: ["callback()"],
    console: ["Bonjour", "Au revoir"],
    explanation: "🔄 L'Event Loop vérifie en boucle : « La Call Stack est-elle vide ET y a-t-il quelque chose dans la Queue ? » → OUI aux deux ! Il transfère le callback sur la Stack.",
    arrow: "eventloop",
    phase: "eventloop",
  },
  {
    callStack: ['console.log("…2 sec plus tard")'],
    webApis: [],
    queue: [],
    console: ["Bonjour", "Au revoir"],
    explanation: "Le callback s'exécute enfin ! Il contient notre console.log qui est poussé sur la Call Stack.",
    arrow: "queue-to-stack",
    phase: "exec",
  },
  {
    callStack: [],
    webApis: [],
    queue: [],
    console: ["Bonjour", "Au revoir", "…2 sec plus tard"],
    explanation: "✅ Terminé ! L'ordre final est Bonjour → Au revoir → …2 sec plus tard. Le code synchrone passe toujours avant l'asynchrone, même si setTimeout avait 0ms !",
    arrow: "to-console",
    phase: "done",
  },
];

const CODE_LINES = [
  { text: 'console.log("Bonjour");', active: [1, 2] },
  { text: "", active: [] },
  { text: "setTimeout(function() {", active: [3, 4] },
  { text: '  console.log("…2 sec plus tard");', active: [11, 12] },
  { text: "}, 2000);", active: [3, 4] },
  { text: "", active: [] },
  { text: 'console.log("Au revoir");', active: [5, 6] },
];

const COLORS = {
  stack: "#22c55e",
  webapi: "#3b82f6",
  queue: "#f59e0b",
  eventloop: "#06b6d4",
  console: "#94a3b8",
  sync: "#22c55e",
  delegate: "#f59e0b",
  waiting: "#64748b",
  "timer-done": "#3b82f6",
  queued: "#f59e0b",
  exec: "#22c55e",
  done: "#06b6d4",
  start: "#64748b",
};

function Box({ items, color, label, icon, emptyText, highlight }) {
  return (
    <div
      style={{
        background: "rgba(12,12,22,0.8)",
        borderRadius: 16,
        padding: "16px 18px",
        minHeight: 100,
        border: highlight ? `2px solid ${color}88` : `1px solid ${color}25`,
        position: "relative",
        overflow: "hidden",
        transition: "border 0.4s, box-shadow 0.4s",
        boxShadow: highlight ? `0 0 24px ${color}20` : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${color}${highlight ? "cc" : "55"}, transparent)`,
          transition: "background 0.4s",
        }}
      />
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 2,
          color: color,
          marginBottom: 12,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {icon} {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 36 }}>
        {items.length === 0 ? (
          <div style={{ color: "#333", fontSize: 12, fontStyle: "italic", fontFamily: "'JetBrains Mono', monospace" }}>
            {emptyText}
          </div>
        ) : (
          items.map((item, i) => (
            <div
              key={`${item}-${i}-${items.length}`}
              style={{
                background: `${color}15`,
                border: `1px solid ${color}40`,
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 13,
                color: "#e2e8f0",
                fontFamily: "'JetBrains Mono', monospace",
                animation: "itemIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                lineHeight: 1.4,
              }}
            >
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ArrowFlow({ type, color }) {
  if (!type) return null;
  const arrows = {
    "to-webapi": { label: "délégué au navigateur →", x: "52%", y: "38%" },
    "to-queue": { label: "→ vers la Queue", x: "52%", y: "62%" },
    "to-console": { label: "→ console", x: "25%", y: "78%" },
    "push-stack": { label: "↑ push", x: "25%", y: "30%" },
    "queue-to-stack": { label: "← vers la Stack", x: "40%", y: "78%" },
    eventloop: { label: "🔄 Event Loop transfère", x: "40%", y: "70%" },
  };
  const a = arrows[type];
  if (!a) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: a.x,
        top: a.y,
        transform: "translate(-50%, -50%)",
        background: `${color}dd`,
        color: "#fff",
        padding: "5px 14px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace",
        animation: "itemIn 0.4s ease",
        zIndex: 10,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        boxShadow: `0 0 20px ${color}44`,
      }}
    >
      {a.label}
    </div>
  );
}

export default function AsyncSimple() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);
  const current = STEPS[step];
  const phaseColor = COLORS[current.phase] || "#64748b";

  const next = useCallback(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), []);
  const prev = useCallback(() => setStep(s => Math.max(s - 1, 0)), []);
  const reset = useCallback(() => { setStep(0); setIsPlaying(false); }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStep(s => {
          if (s >= STEPS.length - 1) { setIsPlaying(false); return s; }
          return s + 1;
        });
      }, 3200);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") { e.preventDefault(); setIsPlaying(p => !p); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const isEventLoopPhase = ["eventloop", "queued"].includes(current.phase);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#08080f",
      color: "#e2e8f0",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      padding: "28px 20px",
      boxSizing: "border-box",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes itemIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes loopSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{
          fontSize: 24,
          fontWeight: 800,
          margin: 0,
          color: "#e2e8f0",
          letterSpacing: -0.5,
        }}>
          <span style={{ color: "#f59e0b" }}>async</span> JavaScript
          <span style={{ color: "#64748b", fontWeight: 400, fontSize: 16, marginLeft: 10 }}>— comment ça marche ?</span>
        </h1>
      </div>

      {/* Step indicator */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 6,
        marginBottom: 20,
      }}>
        {STEPS.map((_, i) => (
          <div
            key={i}
            onClick={() => { setStep(i); setIsPlaying(false); }}
            style={{
              width: i === step ? 28 : 10,
              height: 10,
              borderRadius: 5,
              background: i === step ? phaseColor : i < step ? `${phaseColor}55` : "#1e293b",
              transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        {/* Code block */}
        <div style={{
          background: "rgba(12,12,22,0.9)",
          borderRadius: 16,
          padding: "18px 20px",
          marginBottom: 16,
          border: "1px solid #1a1a2e",
        }}>
          <div style={{
            display: "flex",
            gap: 6,
            marginBottom: 14,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
          </div>
          <pre style={{ margin: 0, fontSize: 14, lineHeight: 1.9, fontFamily: "'JetBrains Mono', monospace" }}>
            {CODE_LINES.map((line, i) => {
              const isActive = line.active.includes(step);
              const isPast = line.active.length > 0 && line.active.every(s => s < step);
              return (
                <div key={i} style={{
                  padding: "1px 10px",
                  borderRadius: 8,
                  marginLeft: 0,
                  background: isActive ? `${phaseColor}18` : "transparent",
                  borderLeft: isActive ? `3px solid ${phaseColor}` : "3px solid transparent",
                  color: isActive ? "#f8fafc" : isPast ? "#3e4a5c" : "#5a6577",
                  transition: "all 0.3s",
                }}>
                  <span style={{ color: "#293040", marginRight: 16, fontSize: 12, userSelect: "none" }}>{i + 1}</span>
                  {line.text || " "}
                </div>
              );
            })}
          </pre>
        </div>

        {/* Engine visualization */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, position: "relative", marginBottom: 16 }}>
          <ArrowFlow type={current.arrow} color={phaseColor} />

          <Box
            items={[...current.callStack].reverse()}
            color={COLORS.stack}
            label="Call Stack"
            icon="📚"
            emptyText="vide"
            highlight={["sync", "exec", "start", "delegate"].includes(current.phase)}
          />
          <Box
            items={current.webApis}
            color={COLORS.webapi}
            label="Web APIs (navigateur)"
            icon="🌐"
            emptyText="aucune tâche en cours"
            highlight={["webapi", "waiting", "timer-done"].includes(current.phase)}
          />

          {/* Event Loop visual */}
          <div style={{
            gridColumn: "1 / -1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 0",
            gap: 12,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: `3px solid ${isEventLoopPhase ? "#06b6d4" : "#222"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              animation: isEventLoopPhase ? "loopSpin 1.2s linear infinite" : "none",
              transition: "border-color 0.4s",
            }}>🔄</div>
            <div>
              <div style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: isEventLoopPhase ? "#06b6d4" : "#333",
                fontFamily: "'JetBrains Mono', monospace",
                transition: "color 0.3s",
              }}>
                Event Loop
              </div>
              <div style={{
                fontSize: 11,
                color: isEventLoopPhase ? "#67e8f9" : "#333",
                fontFamily: "'JetBrains Mono', monospace",
                transition: "color 0.3s",
                animation: isEventLoopPhase ? "blink 1.5s infinite" : "none",
              }}>
                {isEventLoopPhase ? "Stack vide ? Queue pleine ? → Transférer !" : "en veille…"}
              </div>
            </div>
          </div>

          <Box
            items={current.queue}
            color={COLORS.queue}
            label="Callback Queue"
            icon="📬"
            emptyText="aucun callback en attente"
            highlight={["queued", "eventloop"].includes(current.phase)}
          />

          {/* Console */}
          <div style={{
            background: "rgba(12,12,22,0.8)",
            borderRadius: 16,
            padding: "16px 18px",
            minHeight: 100,
            border: current.arrow === "to-console" ? `2px solid ${COLORS.console}66` : `1px solid #1a1a2e`,
            transition: "border 0.4s",
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: "#64748b",
              marginBottom: 12,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              🖥 Console
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {current.console.length === 0 ? (
                <div style={{ color: "#333", fontSize: 12, fontStyle: "italic", fontFamily: "'JetBrains Mono', monospace" }}>
                  _
                </div>
              ) : current.console.map((line, i) => (
                <div key={`${line}-${i}`} style={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: i === current.console.length - 1 && current.arrow === "to-console" ? "#22c55e" : "#94a3b8",
                  animation: i === current.console.length - 1 ? "fadeSlide 0.35s ease" : "none",
                }}>
                  <span style={{ color: "#334155", marginRight: 6 }}>›</span>{line}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Explanation bubble */}
        <div key={step} style={{
          background: `${phaseColor}0d`,
          border: `1px solid ${phaseColor}30`,
          borderRadius: 16,
          padding: "16px 20px",
          marginBottom: 20,
          animation: "fadeSlide 0.4s ease",
        }}>
          <p style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.7,
            color: "#c8d2de",
          }}>
            <span style={{ color: phaseColor, fontWeight: 800, fontSize: 17, marginRight: 8 }}>
              {step + 1}.
            </span>
            {current.explanation}
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <button onClick={reset} style={{
            background: "#111827", color: "#64748b", border: "1px solid #1e293b",
            borderRadius: 12, padding: "11px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}>↺ Reset</button>
          <button onClick={prev} disabled={step === 0} style={{
            background: step === 0 ? "#0a0a14" : "#111827",
            color: step === 0 ? "#1e293b" : "#e2e8f0",
            border: "1px solid #1e293b", borderRadius: 12, padding: "11px 20px",
            fontSize: 13, fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer",
            fontFamily: "'Inter', sans-serif",
          }}>←</button>
          <button onClick={() => setIsPlaying(p => !p)} style={{
            background: isPlaying ? "linear-gradient(135deg, #dc2626, #ef4444)" : `linear-gradient(135deg, ${phaseColor}, ${phaseColor}bb)`,
            color: "#fff", border: "none", borderRadius: 12, padding: "11px 28px",
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif",
            boxShadow: `0 4px 20px ${isPlaying ? "#dc262644" : phaseColor + "33"}`,
          }}>{isPlaying ? "⏸ Pause" : "▶ Lecture auto"}</button>
          <button onClick={next} disabled={step === STEPS.length - 1} style={{
            background: step === STEPS.length - 1 ? "#0a0a14" : "#111827",
            color: step === STEPS.length - 1 ? "#1e293b" : "#e2e8f0",
            border: "1px solid #1e293b", borderRadius: 12, padding: "11px 20px",
            fontSize: 13, fontWeight: 600, cursor: step === STEPS.length - 1 ? "not-allowed" : "pointer",
            fontFamily: "'Inter', sans-serif",
          }}>→</button>
        </div>

        <p style={{
          textAlign: "center", fontSize: 11, color: "#334155", marginTop: 10,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          ← → naviguer · Espace play/pause · cliquer sur les dots pour sauter à une étape
        </p>
      </div>
    </div>
  );
}
