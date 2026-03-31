import { Hono } from "hono"

const app = new Hono()

app.get("/", (c) => c.text("Essaie /hello/Ada ou /search?q=motus\n"))

app.get("/hello/:name", (c) => {
    const name = c.req.param("name")
    return c.text(`Bonjour ${name} !\n`)
})

app.get("/search", (c) => {
    const query = c.req.query("q") ?? ""
    return c.json({ query, length: query.length })
})

export default app
