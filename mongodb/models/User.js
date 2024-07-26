const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minLength: 6,
        maxLength: 20,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
    },
    admin:{
        type: Boolean,
        default: false,
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
