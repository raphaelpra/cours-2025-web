import { Hono } from "hono"

const app = new Hono()
const submissions = []

app.get("/", (c) => {
    return c.json({
        ok: true,
        message: "API contact prête",
        endpoints: [
            "GET /",
            "GET /api/submissions",
            "POST /api/submissions",
        ],
    })
})

app.get("/api/submissions", (c) => {
    return c.json({
        count: submissions.length,
        items: submissions,
    })
})

app.post("/api/submissions", async (c) => {
    let body

    try {
        body = await c.req.json()
    } catch {
        return c.json({ ok: false, error: "JSON invalide" }, 400)
    }

    const name = String(body.name ?? "").trim()
    const message = String(body.message ?? "").trim()

    if (!name || !message) {
        return c.json({ ok: false, error: "name et message sont obligatoires" }, 400)
    }

    const item = {
        id: crypto.randomUUID(),
        name,
        message,
        createdAt: new Date().toISOString(),
    }

    submissions.push(item)

    return c.json({ ok: true, item }, 201)
})

export default app
