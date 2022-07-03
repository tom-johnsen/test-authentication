import { isValidObjectId } from "mongoose"
import express from "express"
import createError from "http-errors"
import type { RequestHandler } from "express"

import model from "../models/user"

const router = express.Router()

const getAll: RequestHandler = async (_, res, next) => {
    try {
        const result = await model.find()
        res.send(result)
    } catch (error) {
        next(error)
    }
}

const getByID: RequestHandler = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params["id"])) next(createError(400, `ID ${req.params["id"]} is invalid`))
        else {
            const result = await model.findById(req.params["id"])
            if (!result) next(createError(404, `ID ${req.params["id"]} was not found`))
            else res.status(200).send(result)
        }
    } catch (error) {
        next(error)
    }
}

const postNew: RequestHandler = async (req, res, next) => {
    try {
        const entry = new model(req.body)
        const result = await entry.save()
        res.status(201).send(result)
    } catch (error) {
        next(error)
    }
}

const putByID: RequestHandler = async (req, res, next) => {
    try {
        let result
        if (!isValidObjectId(req.params["id"])) next(createError(400, `ID ${req.params["id"]} is invalid`))
        else
            result = await model.findByIdAndUpdate(req.params["id"], req.body, {
                runValidators: true,
                new: true,
                useFindAndModify: false
            })

        if (!result) next(createError(404, `ID ${req.params["id"]} was not found`))
        else res.status(200).send(result)
    } catch (error) {
        next(error)
    }
}

const deleteByID: RequestHandler = async (req, res, next) => {
    try {
        let result
        if (!isValidObjectId(req.params["id"])) next(createError(400, `ID ${req.params["id"]} is invalid`))
        else
            result = await model.findByIdAndDelete(req.params["id"], {
                useFindAndModify: false
            })

        if (result) res.status(200).send("Deleted")
        else next(createError(404, `ID ${req.params["id"]} was not found!`))
    } catch (error) {
        next(error)
    }
}

router.get("/", getAll)
router.get("/:id", getByID)
router.post("/", postNew)
router.put("/:id", putByID)
router.delete("/:id", deleteByID)

export default router
