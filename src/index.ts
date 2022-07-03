import "dotenv/config"
import express from "express"
import helmet from "helmet"
import mongoose from "mongoose"
import comments from "./v1/routes/comments"
import error from "./handlers/error"
import notFound from "./handlers/404"

const port = process.env["PORT"] || 3001
const mongoConnector = process.env["MONGODB_URI"] || "mongodb://localhost"
const mongoDB = process.env["MONGODB_DATABASE"] || "no_env"
const mongoURL = new URL(mongoDB, mongoConnector).toString()

const app = express()
const v1 = express.Router()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use("/api/v1", v1)

v1.use("/comments", comments)

app.use("*", notFound)
app.use(error)

app.listen(port, () => {
    mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log(`MongoDB connected to database \"${mongoDB}\".`)
    console.log(`Server is running on port ${port}`)
    console.log("API version 1 is available at /api/v1")
})
