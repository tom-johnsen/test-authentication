import { Schema } from "mongoose"
import type { IUser } from "v1/@types/user"

const userSchema = new Schema(
    {
        account: {
            name: { type: String, required: true }, // smartly concat name and surname
            email: { type: String, required: true }, // validate: { isEmail: true }
            password: { type: String, required: true }, // TODO: hash this and require minimum length and use of special characters
            role: { type: String, required: true, default: "user", immuatble: true } // user, admin, superadmin
        },
        security: {
            account_enabled: { type: Boolean, required: true, default: true }, // admin can toggle this field to disable account
            account_verified: { type: Boolean, default: false }, // TODO: add a verification email
            otp_enabled: { type: Boolean, deafult: false }, // If the user has enabled 2FA on their account.
            temp_otp_key: { type: String, required: true }, // Incase user fails to set up OTP, we can use this to generate a new one before it is properly saved to the database
            recovery_keys: { type: [String], required: true } // TODO: tell user to save these keys in a safe place in case of lost 2FA device
        }
    },
    { timestamps: true } // createdAt, updatedAt
) as Schema<IUser>

export default userSchema
