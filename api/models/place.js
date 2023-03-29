const mongoose = require('mongoose')
const { Schema } = mongoose

const placeSchema = new Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    title: String,
    rating: Number,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: Number,
    checkOut: Number,
    maxGuest: Number,
    price: Number,
})

const placeModel = mongoose.model("Place", placeSchema)
module.exports = placeModel 