import { Hono } from "hono"

const app = new Hono()

app.get("/", (c) => {
    return c.text("POST /api/messages avec un body JSON\n")
})

app.post("/api/messages", async (c) => {
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

    return c.json(
        {
            ok: true,
            item: {
                name,
                message,
                createdAt: new Date().toISOString(),
            },
        },
        201,
    )
})

export default app
