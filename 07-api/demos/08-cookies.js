import { Hono } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"

const app = new Hono()

app.get("/", (c) => {
    return c.json({
        message: "Démo cookies prête",
        endpoints: ["GET /set", "GET /get", "GET /logout"],
    })
})

app.get("/set", (c) => {
    setCookie(c, "favorite-language", "bun", {
        httpOnly: true,
        sameSite: "Lax",
        path: "/",
        maxAge: 60 * 30,
    })

    return c.json({
        message: "Cookie envoyé",
        cookie: "favorite-language=bun",
    })
})

app.get("/get", (c) => {
    const language = getCookie(c, "favorite-language") ?? null
    return c.json({ language })
})

app.get("/logout", (c) => {
    deleteCookie(c, "favorite-language", { path: "/" })
    return c.json({ message: "Cookie supprimé" })
})

export default app
