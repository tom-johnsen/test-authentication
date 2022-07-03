import type { RequestHandler } from "express"

const notFound: RequestHandler = (_, res) => res.status(404).send("Not found")

export default notFound
