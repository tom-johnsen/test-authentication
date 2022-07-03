import { model } from "mongoose"
import schema from "../schemas/user"
import jwt from "jsonwebtoken"
import type { Model } from "mongoose"
import type { IUser } from "../@types/user"
import bcrypt from "bcrypt"

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined")
if (!JWT_EXPIRES_IN) throw new Error("JWT_EXPIRES_IN is not defined")

// Hash password
const hashPassword = async (plainPassword: string): Promise<string> => {
    return await bcrypt.hash(plainPassword, 10)
}

// Pre-save logic here
schema.pre("save", async function (next) {
    let { password } = this.account

    const plaintextPassword = password
    if (plaintextPassword && this.isModified("password")) password = await hashPassword(plaintextPassword)

    next()
})

// Generate JWT token
schema.methods["generateJWT"] = function (): string {
    return jwt.sign(
        {
            id: this._id,
            account: this.account,
            security: this.security
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN
        }
    )
}

// Check if provided password is correct
schema.statics["checkCredentials"] = async function (email, unencrytedPassword): Promise<IUser | null> {
    const user = await this.findOne({ email })
    if (user) {
        const hashedPw = user.password
        if (!hashedPw) return null
        const isMatch = await bcrypt.compare(unencrytedPassword, hashedPw)

        if (isMatch) return user
    }

    return null
}

// Post-save logic here
schema.post("save", function (doc, next) {
    next()
})

export default model("User", schema) as Model<IUser>
