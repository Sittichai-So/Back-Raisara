import mongoose from "mongoose"

const { Schema, model } = mongoose;

const userSchema = new Schema({

    username: {
        type: String,
        required: true,
        trim: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber:{
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default:true    
    },

});

const User = model('users', userSchema);

export default User;