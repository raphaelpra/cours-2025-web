import { Hono } from "hono"

const port = 3006
const app = new Hono()

app.get("/", (c) => {
    return c.text("Bonjour depuis Hono 👋\n")
})

Bun.serve({
    port,
    fetch: app.fetch,
})

console.log(`Server running on http://localhost:${port}`)
