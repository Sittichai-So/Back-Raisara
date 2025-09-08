import mongoose from "mongoose"

const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phoneNumber: {
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
    displayName: {
        type: String,
        required: false,
        trim: true
    },
    avatar: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    bio: {
        type: String,
        required: false,
        trim: true,
        maxLength: 500
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user', 'moderator'],
        default: 'user'
    },
    room: {
        id: {
            type: String,
            required: false
        },
        nameRoom: {
            type: String,
            required: false,
            trim: true
        }
    },
    status: {
        type: String,
        required: true,
        enum: ['online', 'offline', 'away'],
        default: 'offline'
    },
    lastLogin: {
        type: Date,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true    
    }
}, {
    timestamps: true
});

userSchema.index({ status: 1 });
userSchema.index({ username: 1, email: 1 });

userSchema.virtual('fullName').get(function() {
    return `${this.firstname} ${this.lastname}`;
});

userSchema.methods.isOnline = function() {
    return this.status === 'online';
};

userSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'online') {
        this.lastLogin = new Date();
    }
    next();
});

const User = model('User', userSchema, 'users');

export default User;