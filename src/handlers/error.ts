import type { ErrorRequestHandler } from "express"

const error: ErrorRequestHandler = (err, _, res) => {
    console.error(err.stack)
    res.status(err.status || 500).send("Something broke!")
}

export default error
