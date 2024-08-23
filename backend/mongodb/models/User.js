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
        minLength: 10,
        maxLength: 50,
        unique: true
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
    favoriteComics: [
        {
            comicId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comic',
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
},
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "users");
