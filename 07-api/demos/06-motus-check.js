import { Hono } from "hono"

const app = new Hono()

const words = ["cours", "motus", "api", "python", "worker"]

function compareWords(target, guess) {
    return guess.split("").map((letter, index) => {
        if (letter === target[index]) {
            return { letter, state: "correct" }
        }

        if (target.includes(letter)) {
            return { letter, state: "present" }
        }

        return { letter, state: "absent" }
    })
}

function buildCurrentGuess(target, letters, alreadyGuess) {
    return target
        .split("")
        .map((targetLetter, index) => {
            if (alreadyGuess[index] === targetLetter) {
                return targetLetter
            }

            if (letters[index].state === "correct") {
                return targetLetter
            }

            return "."
        })
        .join("")
}

function getWordById(id) {
    if (!Number.isInteger(id) || id < 0 || id >= words.length) {
        return null
    }

    return words[id]
}

function getGameInfo(id, word) {
    return {
        id,
        length: word.length,
        firstLetter: word[0],
    }
}

function validateAlreadyGuess(target, alreadyGuess) {
    if (typeof alreadyGuess !== "string") {
        return "alreadyGuess doit être une chaîne de caractères"
    }

    const normalized = alreadyGuess.trim().toLowerCase()

    if (normalized.length !== target.length) {
        return "alreadyGuess doit avoir la bonne longueur"
    }

    for (const [index, letter] of normalized.split("").entries()) {
        if (letter !== "." && letter !== target[index]) {
            return "alreadyGuess doit seulement contenir '.' ou des lettres déjà trouvées"
        }
    }

    return null
}

app.get("/", (c) => {
    return c.json({
        message: "API Motus prête",
        endpoints: ["GET /games/random", "GET /games/:id", "POST /games/:id/guess"],
    })
})

app.get("/games/random", (c) => {
    const id = Math.floor(Math.random() * words.length)
    const word = words[id]

    return c.json(getGameInfo(id, word))
})

app.get("/games/:id", (c) => {
    const id = Number(c.req.param("id"))
    const word = getWordById(id)

    if (!word) {
        return c.json({ error: "Partie introuvable" }, 404)
    }

    return c.json(getGameInfo(id, word))
})

app.post("/games/:id/guess", async (c) => {
    let body

    try {
        body = await c.req.json()
    } catch {
        return c.json({ error: "JSON invalide" }, 400)
    }

    const id = Number(c.req.param("id"))
    const word = getWordById(id)

    if (!word) {
        return c.json({ error: "Partie introuvable" }, 404)
    }

    if (typeof body !== "object" || body === null || typeof body.guess !== "string") {
        return c.json({ error: "guess doit être une chaîne de caractères" }, 400)
    }

    const guess = body.guess.trim().toLowerCase()

    if (!guess) {
        return c.json({ error: "guess est obligatoire" }, 400)
    }

    if (word.length !== guess.length) {
        return c.json({ error: "guess doit avoir la bonne longueur" }, 400)
    }

    let alreadyGuess = ".".repeat(word.length)

    if ("alreadyGuess" in body && body.alreadyGuess !== undefined) {
        const error = validateAlreadyGuess(word, body.alreadyGuess)

        if (error) {
            return c.json({ error }, 400)
        }

        alreadyGuess = body.alreadyGuess.trim().toLowerCase()
    }

    const letters = compareWords(word, guess)
    const guessed = guess === word
    const currentGuess = buildCurrentGuess(word, letters, alreadyGuess)

    return c.json({
        id,
        letters,
        currentGuess,
        guessed,
    })
})

export default app
