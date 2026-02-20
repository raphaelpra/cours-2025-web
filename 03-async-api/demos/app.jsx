import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import EventLoop from "./event-loop.jsx";
import Promises from "./promises.jsx";
import Chaining from "./chaining.jsx";
import AsyncAwait from "./async-await.jsx";

const DEMOS = [
    {
        id: "event-loop",
        title: "1. Event Loop",
        subtitle: "setTimeout & callbacks",
        color: "#f59e0b",
        component: EventLoop,
    },
    {
        id: "promises",
        title: "2. Promises",
        subtitle: "resolve, reject, then, catch",
        color: "#a855f7",
        component: Promises,
    },
    {
        id: "chaining",
        title: "3. Chainage",
        subtitle: ".then().then()",
        color: "#3b82f6",
        component: Chaining,
    },
    {
        id: "async-await",
        title: "4. async/await",
        subtitle: "Sucre syntaxique",
        color: "#06b6d4",
        component: AsyncAwait,
    },
];

function App() {
    const [active, setActive] = useState(0);
    const Component = DEMOS[active].component;

    return (
        <div>
            <nav
                style={{
                    display: "flex",
                    gap: 8,
                    padding: "12px 16px",
                    justifyContent: "center",
                    background: "#05050a",
                    borderBottom: "1px solid #14141f",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                }}
            >
                {DEMOS.map((demo, i) => (
                    <button
                        type="button"
                        key={demo.id}
                        onClick={() => setActive(i)}
                        style={{
                            background:
                                i === active
                                    ? `${demo.color}18`
                                    : "#0a0a14",
                            color: i === active ? demo.color : "#4a5568",
                            border: `1.5px solid ${i === active ? demo.color + "55" : "#14141f"}`,
                            borderRadius: 12,
                            padding: "8px 18px",
                            cursor: "pointer",
                            fontFamily:
                                "'JetBrains Mono', 'Fira Code', monospace",
                            fontSize: 12,
                            fontWeight: 700,
                            transition: "all 0.2s",
                        }}
                    >
                        <div>{demo.title}</div>
                        <div
                            style={{
                                fontSize: 9,
                                fontWeight: 400,
                                opacity: 0.6,
                                marginTop: 2,
                            }}
                        >
                            {demo.subtitle}
                        </div>
                    </button>
                ))}
            </nav>
            <Component />
        </div>
    );
}

createRoot(document.getElementById("root")).render(<App />);
