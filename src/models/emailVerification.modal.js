import mongoose from "mongoose"
const {Schema} = mongoose


const emailVerifySchema = new Schema({
    email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    otp: {
        type: String,
        index: true,
        required: true 
    },
    isActive: {
        type: Boolean,
        default: false 
    }
}, { timestamps: true });


const emailVerify = mongoose.model("emailVerification", emailVerifySchema)
export { emailVerify }