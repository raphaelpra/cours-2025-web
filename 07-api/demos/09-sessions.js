import { Hono } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"

const app = new Hono()
const sessions = new Map()

app.get("/", (c) => {
    return c.json({
        message: "Démo sessions prête",
        endpoints: ["POST /login", "GET /me", "POST /logout"],
    })
})

app.post("/login", async (c) => {
    let body

    try {
        body = await c.req.json()
    } catch {
        return c.json({ error: "JSON invalide" }, 400)
    }

    if (typeof body !== "object" || body === null || typeof body.username !== "string") {
        return c.json({ error: "username doit être une chaîne" }, 400)
    }

    const username = body.username.trim().toLowerCase()

    if (!username) {
        return c.json({ error: "username est obligatoire" }, 400)
    }

    const sessionId = crypto.randomUUID()
    sessions.set(sessionId, { username, createdAt: new Date().toISOString() })

    setCookie(c, "session-id", sessionId, {
        httpOnly: true,
        sameSite: "Lax",
        path: "/",
    })

    return c.json({ message: "Session créée", username })
})

app.get("/me", (c) => {
    const sessionId = getCookie(c, "session-id")

    if (!sessionId) {
        return c.json({ error: "Session manquante" }, 401)
    }

    const session = sessions.get(sessionId)

    if (!session) {
        return c.json({ error: "Session inconnue ou expirée" }, 401)
    }

    return c.json(session)
})

app.post("/logout", (c) => {
    const sessionId = getCookie(c, "session-id")

    if (sessionId) {
        sessions.delete(sessionId)
    }

    deleteCookie(c, "session-id", { path: "/" })
    return c.json({ message: "Session supprimée" })
})

export default app
