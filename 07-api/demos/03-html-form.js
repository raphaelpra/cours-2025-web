import { Hono } from "hono"

const app = new Hono()

function page(title, content) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: sans-serif; max-width: 720px; margin: 40px auto; padding: 0 16px; }
        form { display: grid; gap: 12px; }
        input, textarea, button { font: inherit; padding: 10px; }
        textarea { min-height: 120px; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 6px; }
    </style>
</head>
<body>
    ${content}
</body>
</html>`
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;")
}

app.get("/", (c) => {
    return c.html(
        page(
            "Formulaire Hono",
            `
            <h1>Formulaire de contact</h1>
            <p>Cette démo sert juste à montrer qu'un serveur Hono peut aussi répondre en HTML, pas seulement en JSON.</p>
            <form method="GET" action="/preview">
                <label>Nom <input name="name" /></label>
                <label>Message <textarea name="message"></textarea></label>
                <button type="submit">Prévisualiser</button>
            </form>
            <p>La prévisualisation passe volontairement par un <code>GET</code> pour voir les valeurs dans l'URL.</p>
            `,
        ),
    )
})

app.get("/preview", (c) => {
    const name = escapeHtml(c.req.query("name") ?? "Anonyme")
    const message = escapeHtml(c.req.query("message") ?? "")

    return c.html(
        page(
            "Prévisualisation",
            `
            <h1>Prévisualisation</h1>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Message :</strong></p>
            <pre>${message}</pre>
            <p><a href="/">Retour</a></p>
            `,
        ),
    )
})

export default app
