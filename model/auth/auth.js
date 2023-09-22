const mongoose = require('mongoose')
require('dotenv').config()

const authSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    seller: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model(process.env.USER_AUTH_COLLECTION_NAME, authSchema)