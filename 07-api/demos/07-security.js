import { Hono } from "hono"

const app = new Hono()

function unauthorized(message) {
    return new Response(JSON.stringify({ error: message }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
    })
}

function forbidden(message) {
    return new Response(JSON.stringify({ error: message }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
    })
}

function parseBasicAuth(header) {
    if (!header?.startsWith("Basic ")) {
        return null
    }

    let decoded

    try {
        decoded = atob(header.slice(6))
    } catch {
        return null
    }

    const separator = decoded.indexOf(":")

    if (separator === -1) {
        return null
    }

    return {
        username: decoded.slice(0, separator),
        password: decoded.slice(separator + 1),
    }
}

app.get("/", (c) => {
    return c.json({
        message: "Démo sécurité prête",
        endpoints: [
            "GET /public",
            "GET /api-key",
            "GET /bearer",
            "GET /basic",
        ],
    })
})

app.get("/public", (c) => c.json({ message: "Tout le monde peut passer" }))

app.get("/api-key", (c) => {
    const apiKey = c.req.header("x-api-key")

    if (apiKey !== "demo-key") {
        return forbidden("X-API-Key invalide")
    }

    return c.json({ message: "Accès API key autorisé" })
})

app.get("/bearer", (c) => {
    const authorization = c.req.header("authorization")

    if (!authorization?.startsWith("Bearer ")) {
        return unauthorized("Bearer token manquant")
    }

    const token = authorization.slice(7)

    if (token !== "demo-token") {
        return forbidden("Bearer token invalide")
    }

    return c.json({ message: "Accès bearer autorisé" })
})

app.get("/basic", (c) => {
    const credentials = parseBasicAuth(c.req.header("authorization"))

    if (!credentials) {
        return unauthorized("Basic auth manquant")
    }

    if (credentials.username !== "ada" || credentials.password !== "lovelace") {
        return forbidden("Identifiants invalides")
    }

    return c.json({ message: "Accès basic autorisé", user: credentials.username })
})

export default app
