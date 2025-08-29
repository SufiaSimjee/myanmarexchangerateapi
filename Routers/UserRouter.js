
const passport = require("passport");
const express = require("express");
const ObjectId = require('mongoose').Types.ObjectId;
const userRouter = express.Router();
const User = require("../Models/UserSchema");
const generateJWTToken = require("../Auth/JwtTokenGenerator");





let userUpdateTracker = 0;


userRouter.get("/test-token", passport.authenticate("jwt", { session: false }), (req, res) => {
        try {
            delete req.user.password;
            res.status(200).json({message: "Token is valid!", user: req.user});
        } catch (error) {
            console.error("Error in /test-token:", error);
            res.status(500).json({
                message: "An error occurred while processing the request.",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    }
);



userRouter.delete('/delete/:id', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try{
        const { id } = req.params;
        const {username} = req.user;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: `Invalid ID format: '${id}'. Please provide a valid MongoDB ObjectId in the request URL.`
            });
        }

        // Find the user
        const userAccount = await User.findById(id).lean();

        if (!userAccount) {
            return res.status(404).json({
                message: "No account found with the provided ID."
            });
        }

        if(username !== process.env.DEFAULT_ADMIN_USERNAME){
            if (userAccount.username !== username) {
                return res.status(403).json({
                    message: "You do not have permission to delete an account of another user."
                });
            }
        }

        // Delete the user
        await User.findByIdAndDelete(id);

        if(userUpdateTracker > 0){
            userUpdateTracker--;
        }

        return res.status(204).json({ // 204 Deleted
            message: "Account Delete successful",
        });

    } catch (error) {
        console.error("Delete User Error:", error);
        return res.status(500).json({
            message: "An unexpected error occurred while deleting the account.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
})

userRouter.post("/signup", async (req, res) => {
    try {
        let { email, username, password, role } = req.body;

        if ((!email && !username) || !password) {
            return res.status(400).json({
                message: "Invalid request. Please provide a username/email and password."
            });
        }


        //  Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username },
            ]
        });

        if (existingUser) {
            return res.status(409).json({ // 409 Conflict
                message: "An account with this email or username already exists."
            });
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password,
            role
        });

        await newUser.save();
        userUpdateTracker++;

        // Generate JWT token
        const userAccount = await User.findOne({
            $or: [
                { email: email },
                { username: username },
            ]
        }).lean();
        const token = generateJWTToken(userAccount);

        return res.status(201).json({ // 201 Created
            message: "Sign up successful",
            accountId: userAccount._id,
            token: token
        });

    } catch (error) {
        console.error("Sign Up error:", error);
        return res.status(500).json({
            message: "An unexpected error occurred. Please try again later.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});


userRouter.post("/login", async (req, res) => {
    try {
        let { email, username, password } = req.body;

        if ((!email && !username) || !password) {
            return res.status(400).json({
                message: "Invalid request. Please provide a username/email and password."
            });
        }



        const userAccount = await User.findOne({
            $or: [
                { email: email },
                { username: username },
            ]
        });

        if (!userAccount) {
            return res.status(404).json({
                message: "No account found with the provided email/username."
            });
        }

        const isValidPassword = await userAccount.isValidPassword(password);

        if (!isValidPassword) {
            return res.status(401).json({
                message: "Incorrect password. Please try again."
            });
        }

        const token = generateJWTToken(userAccount);
        return res.status(200).json({
            message: "Login successful",
            accountId: userAccount._id,
            token: token
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "An unexpected error occurred. Please try again later.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});


module.exports = userRouter