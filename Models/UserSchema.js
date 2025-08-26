const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {raw} = require("express");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        index: true,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        index: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// password hashing
UserSchema.pre('save', function (next) {
    try{
        this.password = bcrypt.hashSync(this.password, 0);
        next();
    } catch (error){
        console.error("Error while hashing the password before saving:", error.message);
        next(error);
    }
})


// password verification
UserSchema.methods.isValidPassword = async function(password) {
    try{
        const user = this;

        if (!user.password) {
            throw new Error("Password hash not set for this user");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        return isMatch;
    } catch (error){
        console.error("Error while validating user password:", error.message);
        return false;
    }
};

const User = model('User', UserSchema);

module.exports = User;
