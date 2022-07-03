import type { Document } from "mongoose"

interface IUser extends Document {
    account: {
        name: string
        email: string
        password: string
        role: string
    }
    security: {
        account_enabled: boolean
        account_verified: boolean
        otp_enabled: boolean
        temp_otp_key: string
        recovery_keys: string[]
    }
}
