import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import nodemailer from 'nodemailer';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRegisterValidate } from "../validation/joiFunction.js"
import { verifyOTPwithJWT } from "../middleware/verifyOTPwithJWT.middleware.js"
const blacklist = new Set();
import dotenv from 'dotenv';
import express from 'express';
import NodeCache from 'node-cache';
import { emailVerify } from "../models/emailVerification.modal.js"
import { io } from "../app.js"
dotenv.config();



const secretKey = 'verifyOTPwithJWT';

const generateJWT = async (verifyEmail, verifyOTP) => {
    return jwt.sign({ verifyEmail, verifyOTP }, secretKey, { expiresIn: '1h' });
}


const generateAccessTokens1234 = async (userId) => {
    try {
        const user = await User.findById(userId);


        const accessToken = user.generateAccessToken();


        return { accessToken };
    } catch (error) {
        console.error("Error generating access token:", error);
        throw new ApiError(500, "Something went wrong while generating access token");
    }
};

const userLogin = asyncHandler(async (req, res) => {
    const { email, fullName, password } = req.userLoginValidate;

    const user = await User.findOne({
        $or: [{ fullName }, { email }]
    });

    if (!user) {
        return res.status(404).json({ error: "User does not exist" });
    }
 
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return res.status(404).json({ error: "Invalid user credentials" });
    }


    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

    const loggedInUser = await User.findById(user._id).select("-password ");
    loggedInUser.authToken = accessToken;
    loggedInUser.isActive = true;
    await loggedInUser.save();

    return res.status(200).json({ user: loggedInUser, message: "User logged In Successfully", token: accessToken });
});


const userLogout = asyncHandler(async (req, res) => {
    console.log("hello");
    const { SenderId } = req.body;
    console.log(req.body);
    const logout = await User.findByIdAndUpdate(SenderId, {
        isActive: false,
        authToken: null
    }, { new: true });
    if (logout) {
        return res.status(200).json({ message: "Logout successful" });
    }

});


function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
const sandMail = asyncHandler(async (req, res) => {
    const { email } = req.emailSandValidate;
    const userExist = await emailVerify.findOne({ email });
    if (userExist) {
        return res.status(400).json({ error: `${email} is already registered` });
    }
    const otp = generateOTP();
    console.log(email, otp)
    const userEmail = await emailVerify.create({ email, otp });

    if (!userEmail) {
        return res.status(400).json({ error: 'Failed to store email verification data' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'deep8013a@gmail.com',
            pass: 'hqwlkpmkyysflovl'
        }
    });

    const mailOptions = {
        from: 'youremail@gmail.com',
        to: email,
        subject: `Your verify credentials`,
        text: `Your OTP: ${otp}`,
        html: `<b>Your OTP: ${otp} Expires after 10 minutes </b>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ message: "OTP sand successfully in your Gmail account" })

        }
    });
});

const userRigister = asyncHandler(async (req, res) => {

    const { email, password, confirmPassword, otp, fullName } = req.userRegisterValidate;

    try {

        const user = await emailVerify.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if (user.otp != otp) {
            return res.status(400).json({ error: 'Your OTP does not match' });
        }

        if (password != confirmPassword) {
            return res.status(400).json({ error: 'Password and Confirm password does not match' });
        }

        const store = await User.create({
            email,
            password,
            fullName,
            isActive: true
        });

        if (!store) {
            return res.status(400).json({ error: 'User Registretion Failed' });
        }
        user.isActive = true;
        user.save();
        return res.status(200).json({ message: 'User Registretion Successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }


});

const getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find().select("-password -authToken");
    if (!users) {
        return res.status(404).json({ error: 'No users found' });
    }

    return res.status(200).json({ message: 'Users retrieved successfully', data: users });
});

const updateUser = asyncHandler(async (req, res) => {
    const { password, updateId } = req.body;

    try {
        const user = await User.findOne({ _id:updateId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.password = password;
        await user.save();
        return res.status(200).json({ message: 'User password updated successfully', data: user });
    } catch (error) {
        console.error('Error updating user password:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


const searchUser = asyncHandler(async (req, res) => {

    let { searchTerm } = req.body;
    

    const regex = new RegExp(searchTerm, 'i'); 

    try {
        const result = await User.find({
            $or: [
                { name: regex },
                { email: regex } 
            ]
        }).exec();

        res.status(200).json({ message: 'Search results', data: result });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }

    // searchTerm = searchTerm.toLowerCase();
    // const user = await User.find({ fullName: { $regex: new RegExp(searchTerm, 'i') } });
    // if (!user || user.length === 0) {
    //     return res.status(404).json({ message: 'No matching users found' });
    // }
    // return res.status(200).json({ message: 'Matching users found', data: user });
});

const addUser = asyncHandler(async (req, res) => {
    const { SenderId, data } = req.body;

    try {
        // Find the user by SenderId
        const user = await User.findOne({ _id: SenderId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user list already contains the data
        if (user.userId.includes(data)) {
            return res.status(400).json({ message: 'This user already exists' });
        }

        // Add the data to the user list and save the user
        user.userId.push(data);
        await user.save();

        // Return success message
        return res.status(200).json({ message: 'User added successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error adding user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});




const listAddUsers = asyncHandler(async (req, res) => {
    const { SenderId } = req.body;
    try {
        const user = await User.findOne({ _id: SenderId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userIds = user.userId;
        const promises = userIds.map(async (id) => {
            return await User.findOne({ _id: id });
        });
        const userData = await Promise.all(promises);

        
        return res.status(200).json({ message: 'get users list ', data: userData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});




const addUserRemove = asyncHandler(async (req, res) => {
    const { removeId, SenderId } = req.body;
    const user = await User.findOne({ _id: SenderId });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const index = user.userId.indexOf(removeId);
    if (index === -1) {
        return res.status(200).json({ message: 'removeId not found in userId array', data: user });
    }

    user.userId.splice(index, 1);
    await user.save();
    return res.status(200).json({ message: 'removeId removed from userId array', data: user });
});
const oflineStatus = asyncHandler(async (req, res) => {

    const { SenderId } = req.body;
    if (!SenderId) {
        return;
    }
    const user = await User.findOne({ _id: SenderId });
    user.isActive = false;
    user.save();
    if (!user) {
        return
    }
    const userIds = user.userId;
    const promises = userIds.map(async (id) => {
        return await User.findOne({ _id: id });
    });
    const userData = await Promise.all(promises);

    io.emit('statusData', ({ userData }));
});
const onlineStatus = asyncHandler(async (req, res) => {
    const { SenderId } = req.body;
    if (!SenderId){
        return;
    }
    const user = await User.findOne({ _id: SenderId });
    user.isActive = true;
    user.save();
    if (!user) {
        return 
    }
    const userIds = user.userId;
    const promises = userIds.map(async (id) => {
        return await User.findOne({ _id: id });
    });
    const userData = await Promise.all(promises);

    io.emit('statusData', ({ userData }));

});






export { userRigister, sandMail, userLogin, userLogout, getAllUsers, updateUser, searchUser, addUser, listAddUsers, addUserRemove, oflineStatus, onlineStatus }