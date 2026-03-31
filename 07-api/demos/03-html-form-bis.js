import { Hono } from "hono"
import { serveStatic } from "hono/bun"

const app = new Hono()

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;")
}

function page(title, content) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: sans-serif; max-width: 720px; margin: 40px auto; padding: 0 16px; }
        pre { background: #f4f4f4; padding: 12px; border-radius: 12px; }
    </style>
</head>
<body>
    ${content}
</body>
</html>`
}

app.use(
    "/static/*",
    serveStatic({
        root: "./demos",
        rewriteRequestPath: (path) => path.replace(/^\/static/, ""),
    }),
)

app.get("/", (c) => {
    return c.redirect("/static/03-html-form-bis.html")
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
