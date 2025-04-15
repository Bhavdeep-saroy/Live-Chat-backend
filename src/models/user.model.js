import mongoose from "mongoose";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";

const { Schema } = mongoose;

const userSchema = new Schema({
    fullName: {
        type: String,
        lowercase: true,
        index: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    
    password: {
        type: String,
        index: true,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        index: true
    }],

    authToken: {
        type: String,
        default: null
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

const User = mongoose.model("User", userSchema);

export { User };
