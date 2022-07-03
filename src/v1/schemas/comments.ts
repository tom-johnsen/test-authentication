import mongoose from "mongoose"

const { Schema, model } = mongoose

const additionalSchema = new Schema({
    data: { type: String, required: true }
})

const commentSchema = new Schema(
    {
        comment: { type: String, required: true },
        additional: { type: { additionalSchema } }
        //externalSchema: [{ type: Schema.Types.ObjectId, ref: "AnotherSchema" }]
    },
    { timestamps: true }
)

export default model("Comment", commentSchema)
